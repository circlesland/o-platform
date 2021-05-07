<script lang="ts">
  import "./shared/css/base.css";
  import "./shared/css/components.css";
  import "./shared/css/utilities.css";

  import routes from "./loader";
  import { getLastLoadedDapp } from "./loader";
  import { getLastLoadedPage } from "./loader";

  import Router, { push, location } from "svelte-spa-router";
  import Modal from "./shared/molecules/Modal.svelte";
  import ProcessContainer from "./shared/molecules/ProcessContainer.svelte";
  import NavItem from "./shared/atoms/NavItem.svelte";
  import { Process } from "@o-platform/o-process/dist/interfaces/process";
  import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import { NavigateTo } from "@o-platform/o-events/dist/shell/navigateTo";
  import { ProgressSignal } from "@o-platform/o-events/dist/signals/progressSignal";
  import { ProcessStarted } from "@o-platform/o-process/dist/events/processStarted";
  import {
    shellProcess,
    ShellProcessContext,
  } from "./shared/processes/shellProcess";
  import { Generate } from "@o-platform/o-utils/dist/generate";
  import { Subscription } from "rxjs";
  import { Prompt } from "@o-platform/o-process/dist/events/prompt";
  import { Back } from "@o-platform/o-process/dist/events/back";
  import { Skip } from "@o-platform/o-process/dist/events/skip";
  import {
    Cancel,
    CancelRequest,
  } from "@o-platform/o-process/dist/events/cancel";
  import { ProcessEvent } from "@o-platform/o-process/dist/interfaces/processEvent";
  import { PageManifest } from "@o-platform/o-interfaces/dist/pageManifest";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
  import {
    identify,
    IdentifyContextData,
  } from "./dapps/o-passport/processes/identify/identify";
  import { SvelteToast } from "./shared/molecules/Toast";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { ContextAction } from "@o-platform/o-events/dist/shell/contextAction";
  import { XDaiThresholdTrigger } from "./xDaiThresholdTrigger";
  import { me } from "./shared/stores/me";
  import { INVITE_VALUE } from "./dapps/o-passport/processes/invite/invite";
  import {hubSignup, HubSignupContextData} from "./dapps/o-banking/processes/hubSignup";
  import {deploySafe} from "./dapps/o-banking/processes/deploySafe";

  let isOpen: boolean = false;
  let modalProcess: Process;
  let modalProcessEventSubscription: Subscription;

  let progressIndicator: {
    message: string;
    percent: number;
  };

  let contextActions: {
    key: string;
    icon?: string;
    label: string;
    event: (runtimeDapp: RuntimeDapp<any>) => PlatformEvent;
  }[];

  window.o.events.subscribe(async (event: PlatformEvent) => {
    if (event.type === "shell.closeModal") {
      isOpen = false;
      lastPrompt = null;
    }
    if (event.type === "shell.openModal") {
      isOpen = true;
    }
    if (event.type == "shell.runProcess") {
      const runProcessEvent = <RunProcess<any>>event;
      const runningProcess = await window.o.stateMachines.run(
        runProcessEvent.definition,
        runProcessEvent.contextModifier
      );

      if (runProcessEvent.inWindow) {
        // If the process should be started modal, let App.svelte's ProcessContainer handle it.
        modalProcess = runningProcess;
        isOpen = true;
        modalProcessEventSubscription = modalProcess.events.subscribe(
          (processEvent: ProcessEvent) => {
            if (
              processEvent.event &&
              processEvent.event.type == "process.ipc.bubble" &&
              (<any>processEvent.event).wrappedEvent.type == "process.prompt"
            ) {
              console.log(
                "lastPrompt:",
                (<any>processEvent.event).wrappedEvent
              );
              lastPrompt = <Prompt>(<any>processEvent.event).wrappedEvent;
            }
          }
        );
      } else {
        // If not, send an event with the process id.
        const startedEvent = new ProcessStarted(runningProcess.id);
        startedEvent.responseToId = runProcessEvent.id;
        window.o.publishEvent(startedEvent);
      }
    }
    if (event.type === "shell.begin") {
    }
    if (event.type === "shell.navigateTo") {
      push("#" + (<NavigateTo>event).route);
    }
    if (event.type === "shell.done") {
      progressIndicator = null;
    }
    if (event.type === "shell.progress") {
      const progressEvent: ProgressSignal = <ProgressSignal>event;
      progressIndicator = {
        message: progressEvent.message,
        percent: progressEvent.percent,
      };
    }
    if (event.type === "shell.contextAction") {
      contextActions.push((<ContextAction>event).action);
    }
  });

  function modalWantsToClose() {
    // Use this to cancel the close request etc.
    if (modalProcess && isOpen) {
      modalProcess.sendEvent(new CancelRequest());
    }
    if (!modalProcess && isOpen) {
      isOpen = false;
    }
  }

  function conditionsFailed(event) {
    // TODO: Cannot currently remember what this callback does. Lookup documentation.
  }

  let lastPrompt: Prompt | undefined = undefined;

  function routeLoading() {
    // Pretty self explanatory. For more lookup the svelte-spa-router docs,
  }

  let lastLoadedPage: PageManifest;
  let lastLoadedDapp: DappManifest<any>;

  function routeLoaded() {
    // Pretty self explanatory. For more lookup the svelte-spa-router docs,
    lastLoadedPage = getLastLoadedPage();
    lastLoadedDapp = getLastLoadedDapp();

    console.log("LAST PAGE: ", lastLoadedPage);
    // Clear the context actions after every route change
    contextActions = [];
  }

  async function login(appId: string, code?: string) {
    if (isOpen) {
      isOpen = false;
      lastPrompt = null;
      if (modalProcess) {
        modalProcess.sendEvent(new Cancel());
      }
      return;
    }
    const requestEvent = new RunProcess<ShellProcessContext>(
      shellProcess,
      true,
      async (ctx) => {
        ctx.childProcessDefinition = identify;
        ctx.childContext = {
          data: <IdentifyContextData>{
            redirectTo: $location,
          },
        };
        return ctx;
      }
    );

    requestEvent.id = Generate.randomHexString(8);
    window.o.publishEvent(requestEvent);
  }

  let layoutClasses = "";

  let balanceThresholdTrigger: XDaiThresholdTrigger;

  $: {
    if (
      $me &&
      localStorage.getItem("isCreatingSafe") === "true" &&
      $me.circlesSafeOwner &&
      !balanceThresholdTrigger
    ) {
      balanceThresholdTrigger = new XDaiThresholdTrigger(
        $me.circlesSafeOwner,
        INVITE_VALUE,
        async (address, threshold) => {
          console.log("The safe creation balance threshold was reached!");
          const requestEvent = new RunProcess<ShellProcessContext>(
                  shellProcess,
                  true,
                  async (ctx) => {
                    ctx.childProcessDefinition = deploySafe;
                    ctx.childContext = {
                      data: <HubSignupContextData>{
                        privateKey: localStorage.getItem("circlesKey")
                      },
                    };
                    return ctx;
                  }
          );

          requestEvent.id = Generate.randomHexString(8);
          window.o.publishEvent(requestEvent);
        }
      );
    }

    layoutClasses =
      (lastLoadedDapp && lastLoadedDapp.isFullWidth) ||
      (lastLoadedPage && lastLoadedPage.isFullWidth)
        ? ""
        : "md:w-2/3 xl:w-1/2";
  }
</script>

<div class="flex flex-col h-screen ">
  <!-- TODO: Note: All headers are now part of their dapps
  <header class="w-full mx-auto md:w-2/3 xl:w-1/2 z-10">
  </header> -->

  <SvelteToast />
  <main class="flex-1 overflow-y-visible z-30" class:blur={isOpen}>
    <div class="w-full mx-auto {layoutClasses}">
      <Router
        {routes}
        on:conditionsFailed={conditionsFailed}
        on:routeLoading={routeLoading}
        on:routeLoaded={routeLoaded}
      />
    </div>
  </main>

  <footer
    class="z-50  w-full sticky bottom-0 bg-white h-12 border-t border-base-300 pb-16"
    class:isOpen
  >
    <div class="w-full mx-auto md:w-2/3 xl:w-1/2 ">
      <!-- NOT MODAL START -->
      <div
        class="grid  {lastPrompt &&
        (lastPrompt.navigation.canGoBack || lastPrompt.navigation.canSkip)
          ? 'grid-cols-3'
          : 'grid-cols-5'}"
        class:px-4={!isOpen}
      >
        {#if lastLoadedDapp}
          {#each lastLoadedDapp.pages
            .filter((o) => !o.isSystem)
            .slice(0, 2) as page}
            <a
              href="#/{lastLoadedDapp.routeParts.join('/') +
                '/' +
                page.routeParts.join('/')}"
              class="justify-self-center tab w-full text-center focus:text-teal-500 hover:text-teal-500"
              class:hidden={isOpen}
            >
              <NavItem label={page.title} />
            </a>
          {/each}
        {/if}
        {#if lastPrompt && lastPrompt.navigation.canGoBack}
          <button
            class="btn btn-outline btn-white ml-7 sm:ml-9"
            on:click={() => modalProcess.sendAnswer(new Back())}>BACK</button
          >
        {/if}
        <button
          class="justify-self-center btn-circle -m-4 min-w-min w-16 h-16 mx-2 circles-button "
          class:bg-white={!isOpen}
          class:shadow-lg={!isOpen}
          class:col-start-3={!lastPrompt ||
            (lastPrompt && !lastPrompt.navigation.canGoBack)}
          class:col-end-3={!lastPrompt ||
            (lastPrompt && !lastPrompt.navigation.canGoBack)}
          on:click={() => {
            isOpen = !isOpen;
            if (!isOpen) {
              lastPrompt = null;
              if (modalProcess) {
                modalProcess.sendEvent(new Cancel());
              }
            }
          }}
        >
          <img
            class="w-full"
            src="/images/common/circles.png"
            alt="circles.land"
          />
        </button>
        {#if lastPrompt && lastPrompt.navigation.canSkip}
          <button
            class="btn btn-outline btn-white mr-7 sm:mr-9"
            on:click={() => modalProcess.sendAnswer(new Skip())}>SKIP</button
          >
        {/if}
        {#if lastLoadedDapp}
          {#each lastLoadedDapp.pages

            .filter((o) => !o.isSystem)
            .splice(2) as page}
            <a
              href="#/{lastLoadedDapp.routeParts.join('/') +
                '/' +
                page.routeParts.join('/')}"
              class="justify-self-center tab text-center focus:text-teal-500 hover:text-teal-500"
              class:hidden={isOpen}
            >
              <NavItem label={page.title} />
            </a>
          {/each}
        {/if}
        <!-- NOT MODAL END -->
      </div>
    </div>
  </footer>
</div>

<Modal bind:isOpen on:closeRequest={modalWantsToClose}>
  <div class="font-primary">
    {#if modalProcess}
      <ProcessContainer
        process={modalProcess}
        on:stopped={() => {
          isOpen = false;
          lastPrompt = null;
          modalProcess = null;
        }}
      />
    {:else}
      <!-- No process -->
      {#if getLastLoadedDapp()}
        <div class="space-y-4">
          {#each getLastLoadedDapp().actions.concat(contextActions) as action}
            <button
              on:click={() =>
                window.o.publishEvent(action.event(getLastLoadedDapp()))}
              class="w-full btn {action.key == 'logout'
                ? 'btn-error'
                : 'btn-primary btn-outline bg-white'}  ">{action.label}</button
            >
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</Modal>

<style>
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
</style>
