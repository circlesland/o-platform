<script context="module" lang="ts">
import { IShell } from "./shell";
import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { Generate } from "@o-platform/o-utils/dist/generate";
import LoadingIndicator from "./shared/atoms/LoadingIndicator.svelte";
import Success from "./shared/atoms/Success.svelte";
import ErrorIndicator from "./shared/atoms/Error.svelte";
import { useMachine } from "@xstate/svelte";
import { Subject, Subscription } from "rxjs";
import { ProcessEvent } from "@o-platform/o-process/dist/interfaces/processEvent";
import { AnyEventObject } from "xstate";
import { Bubble } from "@o-platform/o-process/dist/events/bubble";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Process } from "@o-platform/o-process/dist/interfaces/process";
import { Sinker } from "@o-platform/o-process/dist/events/sinker";
import { shellEvents } from "./shared/shellEvents";
import { ApiConnection } from "./shared/apiConnection";
import { getProcessContext } from "./main";
import { Stopped } from "@o-platform/o-process/dist/events/stopped";
import { me } from "./shared/stores/me";
import { Environment } from "./shared/environment";

const runningProcesses: {
  [id: string]: Process;
} = {};

const shell: IShell = {
  stateMachines: {
    findById(processId: string) {
      return runningProcesses[processId];
    },
    async run<TContext>(
      definition: ProcessDefinition<any, any>,
      contextModifier?: (processContext: ProcessContext<any>) => Promise<TContext>
    ) {
      const processId = Generate.randomHexString(8);
      console.log(`Starting process (id: ${processId}) with definition:`, definition);

      const machine = (<any>definition).stateMachine(LoadingIndicator, Success, ErrorIndicator);
      const machineOptions = {
        context: contextModifier ? await contextModifier(await getProcessContext()) : await getProcessContext(),
      };
      const { service, state, send } = useMachine(machine, machineOptions);

      const outEvents = new Subject<ProcessEvent>();
      const inEvents = new Subject<ProcessEvent>();

      let lastInEvent: AnyEventObject;

      service.onTransition((state1, event) => {
        // console.log(`Shellprocess state: ${state1.value}, event: ${event.type}`)
        if (event.type == "error.platform" || event.type == "xstate.error") {
          console.error(`An error occurred during the execution of process '${definition.name}'::`, event);
        }
        if (event.type == "process.ipc.bubble") {
          process.lastReceivedBubble = <Bubble>event;
        }

        //console.log(`window.o.stateMachines: forwarding event to the processEvents stream of process '${definition.name}':`, event);
        if (event == lastInEvent) {
          // TODO: Hack: Skip this event - it's 'reflected'
          lastInEvent = null;
          return;
        }
        outEvents.next(<any>{
          stopped: false,
          currentState: state1,
          previousState: state1.history,
          event: event,
        });
      });

      service.onStop(() => {
        outEvents.next({
          stopped: true,
        });

        let result:any = undefined;
        if ((<any>service)._state?.event?.data) {
          result = (<any>service)._state.event.data;
          console.log("stopped process (service._state.event.data): ", result);
        }

        delete runningProcesses[processId];
        window.o.publishEvent(new Stopped(processId, result));
      });

      function isProcessEvent(event: PlatformEvent | ProcessEvent): event is ProcessEvent {
        return (event as ProcessEvent).currentState !== null;
      }

      const process = <Process>{
        id: processId,
        events: outEvents,
        inEvents: inEvents,
        lastReceivedBubble: null,
        sendEvent: (event: PlatformEvent & { type: string }) => {
          if (isProcessEvent(event)) {
            lastInEvent = event;
            inEvents.next(<any>{
              event: event,
            });
          }
          send(event);
        },
        sendAnswer(answer: PlatformEvent) {
          if (!this.lastReceivedBubble || this.lastReceivedBubble.noReply) {
            throw new Error(
              "Cannot answer because no Bubble event was received before or the event hat the 'noReply' property set."
            );
          }
          process.sendEvent(<Sinker>{
            type: "process.ipc.sinker",
            levels: this.lastReceivedBubble.levels ?? 0,
            backTrace: this.lastReceivedBubble.trace,
            wrappedEvent: answer,
          });
        },
      };

      service.start();

      runningProcesses[processId] = process;

      return process;
    },
  },
  events: shellEvents.observable,
  publishEvent: (event) => {
    if (event.type == "shell.progress") {
      console.log("Progress event: ", event);
    }
    return shellEvents.publish(event);
  },
  requestEvent: <TResult extends PlatformEvent>(requestEvent) => {
    const timeoutPeriod = 100;
    return new Promise<TResult>((resolve, reject) => {
      let answerSubscription: Subscription;
      let answered = false;

      let timeout = setTimeout(() => {
        if (answered) return;

        reject(
          new Error(`The request event with the id ${requestEvent.id} wasn't answered within ${timeoutPeriod} ms`)
        );
      }, timeoutPeriod);

      answerSubscription = window.o.events.subscribe((event) => {
        if (event.responseToId != requestEvent.id) {
          return;
        }

        answerSubscription.unsubscribe();
        clearTimeout(timeout);

        resolve(<TResult>event);
      });

      window.o.publishEvent(requestEvent);
    });
  },
};

async function connectToApi() {
  console.log(`Connecting to ${Environment.authEndpointUrl} ..`);
  shell.authClient = new ApiConnection(Environment.authEndpointUrl);

  console.log(`Connecting to ${Environment.apiEndpointUrl} ..`);
  shell.apiClient = new ApiConnection(Environment.apiEndpointUrl, "include");

  console.log(`Connecting to ${Environment.circlesSubgraphEndpoint} ..`);
  shell.theGraphClient = new ApiConnection(Environment.circlesSubgraphEndpoint);
}

connectToApi().then(() => {
  console.log(`Connected to ${Environment.authEndpointUrl} and ${Environment.apiEndpointUrl}`);
});

declare global {
  interface Window {
    o: IShell;
    runInitMachine: () => void;
  }
}

window.o = shell;
</script>

<script lang="ts">
import "./shared/css/tailwind.css";

import Router from "svelte-spa-router";
import { SvelteToast } from "./shared/molecules/Toast";
import DappFrame from "src/shared/molecules/DappFrame.svelte";
import NotFound from "src/shared/pages/NotFound.svelte";
import { interpret } from "xstate";
import { initMachine } from "./dapps/o-onboarding/processes/init";
import { ubiMachine } from "./shared/ubiTimer2";
import { InitContext } from "./dapps/o-onboarding/processes/initContext";
import { LogoutDocument } from "./shared/api/data/types";

let ubiMachineInterpreter: any;
const v = 1;
const currentLocalStorageSchemaVersion = localStorage.getItem("localStorageSchemaVersion");
if (!currentLocalStorageSchemaVersion || parseInt(currentLocalStorageSchemaVersion) < v) {
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem("localStorageSchemaVersion", v.toString());

  window.o.apiClient.client.subscribeToResult().then((apiClient) => {
    apiClient.mutate({
      mutation: LogoutDocument,
    });
  });
}

window.runInitMachine = (context?: InitContext) => {
  if (context) {
    interpret(initMachine.withContext(context)).start();
  } else {
    interpret(initMachine).start();
  }
};
let _routes = {
  "/:dappId?/:1?/:2?/:3?/:4?/:5?/:6?": DappFrame,
  "*": NotFound,
};
</script>

<SvelteToast />

<Router
  routes="{_routes}"
  on:routeLoaded={() => {
    if (!ubiMachineInterpreter && $me && $me.circlesAddress) {
      ubiMachineInterpreter = interpret(ubiMachine)
        .onEvent((event) => {
          console.log('UBI machine event:', event);
        })
        .onTransition((state) => {
          console.log('UBI machine transition:', state.value);
        })
        .start();
    }
  }} />
