<script context="module" lang="ts">
  import { IShell } from "./shell";
  import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
  import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
  import { Generate } from "@o-platform/o-utils/dist/generate";
  import LoadingIndicator from "./shared/atoms/LoadingIndicator.svelte";
  import Success from "./shared/atoms/Success.svelte";
  import ErrorIndicator from "./shared/atoms/Error.svelte";
  import { useMachine } from "xstate-svelte";
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
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import { ProcessStarted } from "@o-platform/o-process/dist/events/processStarted";
  import { shellProcess } from "./shared/processes/shellProcess";

  /**
   * Contains events which have been sent by the DappFrame.
   * It's used to track which "modal-close" events should also
   * trigger a history.back() call.
   */
  export let backStack: PlatformEvent[] = [];

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
        contextModifier?: (
          processContext: ProcessContext<any>
        ) => Promise<TContext>
      ) {
        const processId = Generate.randomHexString(8);
        console.log(
          `Starting process (id: ${processId}) with definition:`,
          definition
        );

        const machine = (<any>definition).stateMachine(
          LoadingIndicator,
          Success,
          ErrorIndicator
        );
        const machineOptions = {
          context: contextModifier
            ? await contextModifier(await getProcessContext())
            : await getProcessContext(),
        };
        const { service, state, send } = useMachine(machine, machineOptions);

        const outEvents = new Subject<ProcessEvent>();
        const inEvents = new Subject<ProcessEvent>();

        let lastInEvent: AnyEventObject;

        service.onTransition((state1, event) => {
          if (event.type == "error.platform" || event.type == "xstate.error") {
            console.error(
              `An error occurred during the execution of process '${definition.name}'::`,
              event
            );
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

          delete runningProcesses[processId];
        });

        function isProcessEvent(
          event: PlatformEvent | ProcessEvent
        ): event is ProcessEvent {
          return (event as ProcessEvent).currentState !== null;
        }

        const process: Process = {
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
    publishEvent: (event) => shellEvents.publish(event),
    requestEvent: <TResult extends PlatformEvent>(requestEvent) => {
      const timeoutPeriod = 100;
      return new Promise<TResult>((resolve, reject) => {
        let answerSubscription: Subscription;
        let answered = false;

        let timeout = setTimeout(() => {
          if (answered) return;

          reject(
            new Error(
              `The request event with the id ${requestEvent.id} wasn't answered within ${timeoutPeriod} ms`
            )
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
    authClient: null,
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
    console.log(`Connected to __AUTH_ENDPOINT__ and __API_ENDPOINT__`);
  });

  declare global {
    interface Window {
      o: IShell;
    }
  }

  window.o = shell;
</script>

<script lang="ts">
  import "./shared/css/base.css";
  import "./shared/css/components.css";
  import "./shared/css/utilities.css";
  import routes from "./loader";
  import { getLastLoadedDapp } from "./loader";
  import { getLastLoadedPage } from "./loader";
  import Router, { push } from "svelte-spa-router";
  import Modal2 from "./shared/molecules/Modal2.svelte";
  import { NavigateTo } from "@o-platform/o-events/dist/shell/navigateTo";
  import { ProgressSignal } from "@o-platform/o-events/dist/signals/progressSignal";
  import { getMergedNavigationManifest } from "@o-platform/o-interfaces/dist/navigationManifest";
  import { Prompt } from "@o-platform/o-process/dist/events/prompt";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
  import { SvelteToast } from "./shared/molecules/Toast";
  import { XDaiThresholdTrigger } from "./xDaiThresholdTrigger";
  import { me } from "./shared/stores/me";
  import { INVITE_VALUE } from "./dapps/o-passport/processes/invite/invite";
  import {
    deploySafe,
    HubSignupContextData,
  } from "./dapps/o-banking/processes/deploySafe";
  import NextNav from "./shared/molecules/NextNav/NextNav.svelte";
  import { onMount } from "svelte";
  import { Page } from "@o-platform/o-interfaces/dist/routables/page";

  let modalProcessEventSubscription: Subscription;
  let current;
  let isOpen = false;
  let modal: Modal2;

  let publicUrls = {
    "/": true,
    "/miva": true,
    "/citizens": true,
    "/countries": true,
    "/banking/find-my-safe": true,
    "/milestones": true,
  };

  let progressIndicator: {
    message: string;
    percent: number;
  };

  window.o.runProcess = async function runProcess(
    processDefinition: ProcessDefinition<any, any>,
    contextData: { [x: string]: any },
    dirtyFlags: { [x: string]: boolean } | undefined
  ) {
    const modifier = async (ctx) => {
      ctx.childProcessDefinition = processDefinition;
      ctx.childContext = {
        data: contextData,
        dirtyFlags: !dirtyFlags ? {} : dirtyFlags,
      };
      return ctx;
    };
    const requestEvent: any = new RunProcess(shellProcess, true, modifier);
    requestEvent.id = Generate.randomHexString(8);

    const processStarted: ProcessStarted =
      await window.o.requestEvent<ProcessStarted>(requestEvent);
    modal.showProcess(processStarted.processId);
  };

  function handleActionButton(event) {
    if (
      event.detail.menuButton == "close" ||
      event.detail.actionButton == "close"
    ) {
      modal.closeModal();
      return;
    }
    if (event.detail.actionButton == "open") {
      modal.showJumplist(getLastLoadedDapp());
      return;
    }

    if (event.detail.action.type && event.detail.action.type == "linklist") {
      if (event.detail.action.target == "dappsList") {
        modal.showNavigation(getLastLoadedDapp());
        return;
      }
    }

    if (event.detail.action.type && event.detail.action.type == "link") {
      if (event.detail.action.target) {
        if (event.detail.action.target == "backlink") {
          window.history.back();
        } else {
          push(event.detail.action.target);
        }
      }
    }
  }

  async function onRunProcess(event: PlatformEvent) {
    const runProcessEvent = <RunProcess<any>>event;
    const runningProcess = await window.o.stateMachines.run(
      runProcessEvent.definition,
      runProcessEvent.contextModifier
    );

    // If not, send an event with the process id.
    const startedEvent = new ProcessStarted(runningProcess.id);
    startedEvent.responseToId = runProcessEvent.id;
    window.o.publishEvent(startedEvent);
  }

  window.o.events.subscribe(async (event: PlatformEvent) => {
    switch (event.type) {
      case "shell.dappLoading":
        routeLoaded();
        break;
      case "shell.runProcess":
        await onRunProcess(event);
        break;
      case "shell.begin":
        break;
      case "shell.navigateTo":
        push("#" + (<NavigateTo>event).route);
        break;
      case "shell.done":
        progressIndicator = null;
        break;
      case "shell.progress":
        const progressEvent: ProgressSignal = <ProgressSignal>event;
        progressIndicator = {
          message: progressEvent.message,
          percent: progressEvent.percent,
        };
        break;
    }
  });

  function conditionsFailed(event) {
    // TODO: Cannot currently remember what this callback does. Lookup documentation.
  }

  let lastPrompt: Prompt<any> | undefined = undefined;

  function routeLoading(args) {
    // processWaiting = false;
    if (!publicUrls[args.detail.location] && !$me) {
      setTimeout(() => {
        window.location.href = "/#/login";
      }, 0);
    }
  }

  let lastLoadedPage: Page<any, any>;
  let lastLoadedDapp: DappManifest<any>;

  function routeLoaded() {
    // Pretty self explanatory. For more lookup the svelte-spa-router docs,
    lastLoadedPage = getLastLoadedPage();
    lastLoadedDapp = getLastLoadedDapp();

    console.log("LAST DAPP: ", lastLoadedDapp);
    console.log("LAST PAGE: ", lastLoadedPage);
  }

  let layoutClasses = "";

  let balanceThresholdTrigger: XDaiThresholdTrigger;
  let triggered = false;

  $: {
    /* Avoid scrolling background on open modal */

    if (modal && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    if ($me && $me.circlesSafeOwner && !balanceThresholdTrigger) {
      if (!!localStorage.getItem("isCreatingSafe")) {
        console.log(
          "Waiting until the required balance to create a new safe is reached .."
        );
        balanceThresholdTrigger = new XDaiThresholdTrigger(
          $me.circlesSafeOwner,
          INVITE_VALUE - 0.005,
          async (address: string, threshold: number) => {
            console.log("The safe creation balance threshold was reached!");
            window.o.runProcess(deploySafe, <HubSignupContextData>{
              privateKey: localStorage.getItem("circlesKey"),
            });
          }
        );
      } else if (
        !triggered &&
        (!!localStorage.getItem("fundsSafe") ||
          !!localStorage.getItem("signsUpAtCircles"))
      ) {
        window.o.runProcess(deploySafe, <HubSignupContextData>{
          privateKey: localStorage.getItem("circlesKey"),
        });
        triggered = true;
      }
    }

    layoutClasses =
      (lastLoadedDapp && lastLoadedDapp.isFullWidth) ||
      (lastLoadedPage && lastLoadedPage.isFullWidth)
        ? ""
        : "md:w-2/3 xl:w-1/2";
  }

  let _routes: any;
  onMount(async () => {
    _routes = await routes();
    console.log("Loaded routes:", _routes);
  });
</script>

{#if _routes}
  <SvelteToast />
  <div class="flex flex-col text-base">
    <main class="z-30 flex-1 overflow-y-auto">
      <div
        class="mainContent w-full mx-auto {layoutClasses}"
        class:mb-16={(!modal || !isOpen) &&
          lastLoadedDapp &&
          lastLoadedDapp.dappId !== "homepage:1"}
        class:blur={modal && isOpen}
      >
        <Router
          routes={_routes}
          on:conditionsFailed={conditionsFailed}
          on:routeLoading={routeLoading}
        />
      </div>
    </main>
  </div>
  {#if lastLoadedDapp && lastLoadedDapp.navigation}
    <NextNav
      {isOpen}
      login={lastLoadedDapp && lastLoadedDapp.dappId === "homepage:1"}
      navigation={getMergedNavigationManifest(lastLoadedDapp, lastLoadedPage)}
      bind:lastPrompt
      on:actionButton={handleActionButton}
    />
  {/if}
  <Modal2
    bind:this={modal}
    on:modalOpen={(e) => {
      isOpen = e.detail;
    }}
  />
  <style>
    .tab:hover,
    .tab:focus,
    .tab:active {
      @apply text-light;
    }
    .tab:hover {
      @apply text-base;
    }
    .isOpen {
      background: transparent;
      border: none;
    }
    /* Background Blurring for firefox and other non supportive browsers */
    @supports not (
      (backdrop-filter: blur(4px)) or (-webkit-backdrop-filter: blur(4px))
    ) {
      .blur {
        filter: blur(4px);
        -webkit-transition: all 0.35s ease-in-out;
        -moz-transition: all 0.35s ease-in-out;
        transition: all 0.35s ease-in-out;
      }
      /* Firefox fix for sticky bottom prev-sibling height */
      main {
        padding-bottom: 4rem;
      }
    }
    .joinnowbutton {
      transform: translate(-50%, 0) !important;
      animation: none !important;
    }
    .joinnowbutton:active:focus,
    .joinnowbutton:active:hover {
      transform: translate(-50%, 0);
      animation: none !important;
    }
    .mainContent {
      --tw-text-opacity: 1;
      background-image: linear-gradient(
        180deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(253, 254, 255, 1) 85%,
        rgba(13, 43, 102, 0) 100%
      );
    }
  </style>
{/if}
