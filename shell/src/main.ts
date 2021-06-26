import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {IShell} from "./shell";
import {shellEvents} from "./shared/shellEvents";
import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {useMachine} from "xstate-svelte";
import {Subject} from "rxjs";
import {ProcessEvent} from "@o-platform/o-process/dist/interfaces/processEvent";
import {Bubble} from "@o-platform/o-process/dist/events/bubble";
import {Process} from "@o-platform/o-process/dist/interfaces/process";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {Sinker} from "@o-platform/o-process/dist/events/sinker";
import {ApiConnection} from "./shared/apiConnection";

import LoadingIndicator from "./shared/atoms/LoadingIndicator.svelte";
import Success from "./shared/atoms/Success.svelte";
import Error from "./shared/atoms/Error.svelte";
import App from "src/App.svelte";
import {AnyEventObject} from "xstate";
import {Generate} from "@o-platform/o-utils/dist/generate";

dayjs.extend(relativeTime)

// TODO: Use a service like 'https://github.com/ipfs/js-ipfs/blob/6870873f0696bb5d8d91fce4a4ef1f7420443993/packages/ipfs-message-port-server/src/server.js#L134'
//       to share data between different app domains.

declare global {
  interface Window {
    o: IShell
  }
}

export async function getProcessContext(): Promise<ProcessContext<any>> {
  return <ProcessContext<any>>{
    data: {}
  };
}

const runningProcesses : {
  [id:string]:Process
} = {
}

const shell: IShell = {
  stateMachines: {
    findById(processId:string) {
      return runningProcesses[processId];
    },
    async run<TContext>(definition: ProcessDefinition<any, any>, contextModifier?: (processContext: ProcessContext<any>) => Promise<TContext>) {
      const processId = Generate.randomHexString(8);
      console.log(`Starting process (id: ${processId}) with definition:`, definition);

      const machine = (<any>definition).stateMachine(LoadingIndicator, Success, Error);
      const machineOptions = {
        context: contextModifier
            ? await contextModifier(await getProcessContext())
            : await getProcessContext()
      };
      const _1 = useMachine(machine, machineOptions);
      const _2 = useMachine(machine, machineOptions);
      const _3 = useMachine(machine, machineOptions);

      const {service, state, send} = useMachine(machine, machineOptions);

      const outEvents = new Subject<ProcessEvent>();
      const inEvents = new Subject<ProcessEvent>();

      let lastInEvent:AnyEventObject;

      service.onTransition((state1, event) => {
        if (event.type == 'error.platform' || event.type == "xstate.error") {
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
          event: event
        });
      });

      service.onStop(() => {
        outEvents.next({
          stopped: true
        });

        delete runningProcesses[processId];
      });

      function isProcessEvent (event: PlatformEvent | ProcessEvent): event is ProcessEvent {
        return (event as ProcessEvent).currentState !== null;
      }

      const process: Process = {
        id: processId,
        events: outEvents,
        inEvents: inEvents,
        lastReceivedBubble: null,
        sendEvent: (event) => {
          if (isProcessEvent(event)) {
            lastInEvent = event;
            inEvents.next(<any>{
              event: event
            });
          }
          send(event);
        },
        sendAnswer(answer: PlatformEvent) {
          if (!this.lastReceivedBubble || this.lastReceivedBubble.noReply) {
            throw new window.Error("Cannot answer because no Bubble event was received before or the event hat the 'noReply' property set.")
          }
          process.sendEvent(<Sinker>{
            type: "process.ipc.sinker",
            levels: this.lastReceivedBubble.levels ?? 0,
            backTrace: this.lastReceivedBubble.trace,
            wrappedEvent: answer
          });
        }
      };

      service.start();

      runningProcesses[processId] = process;

      return process;
    }
  },
  events: shellEvents.observable,
  publishEvent: event => shellEvents.publish(event),
  authClient: null
};

async function connectToApi() {
  console.log(`Connecting to __AUTH_ENDPOINT__ ..`);
  shell.authClient = new ApiConnection("__AUTH_ENDPOINT__/");

  console.log(`Connecting to __API_ENDPOINT__ ..`);
  shell.apiClient = new ApiConnection("__API_ENDPOINT__/", "include");

  console.log(`Connecting to __CIRCLES_SUBGRAPH_ENDPOINT__ ..`);
  shell.theGraphClient = new ApiConnection("__CIRCLES_SUBGRAPH_ENDPOINT__");
}
connectToApi().then(() => {
  console.log(`Connected to __AUTH_ENDPOINT__ and __API_ENDPOINT__`)
});

window.o = shell;

console.log("Starting ..", {
  userAgent: navigator.userAgent
})

export default new App({
  target: document.body,
});
