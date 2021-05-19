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
  import {
    deploySafe,
    HubSignupContextData,
  } from "./dapps/o-banking/processes/deploySafe";
  import Progress from "./dapps/o-homepage/components/Progress.svelte";

  let isOpen: boolean = false;
  let processWaiting: boolean = false;
  let beforeCancelPrompt: Prompt; // Is set when the "do you want to cancel?" prompt is shown
  let modalProcess: Process;
  let modalProcessEventSubscription: Subscription;
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

  function routeLoading(args) {
    processWaiting = false;
    if (!publicUrls[args.detail.location] && !$me) {
      setTimeout(() => {
        window.location.href = "/#/login";
      }, 0);
    }
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
            redirectTo: "/dashboard",
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
  let triggered = false;

  $: {
    /* Avoid scrolling background on open modal */
    /*
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
     */

    if ($me && $me.circlesSafeOwner && !balanceThresholdTrigger) {
      if (!!localStorage.getItem("isCreatingSafe")) {
        balanceThresholdTrigger = new XDaiThresholdTrigger(
          $me.circlesSafeOwner,
          INVITE_VALUE - 0.005,
          async (address, threshold) => {
            console.log("The safe creation balance threshold was reached!");
            const requestEvent = new RunProcess<ShellProcessContext>(
              shellProcess,
              true,
              async (ctx) => {
                ctx.childProcessDefinition = deploySafe;
                ctx.childContext = {
                  data: <HubSignupContextData>{
                    privateKey: localStorage.getItem("circlesKey"),
                  },
                };
                return ctx;
              }
            );

            requestEvent.id = Generate.randomHexString(8);
            window.o.publishEvent(requestEvent);
          }
        );
      } else if (
        !triggered &&
        (!!localStorage.getItem("fundsSafe") ||
          !!localStorage.getItem("signsUpAtCircles"))
      ) {
        const requestEvent = new RunProcess<ShellProcessContext>(
          shellProcess,
          true,
          async (ctx) => {
            ctx.childProcessDefinition = deploySafe;
            ctx.childContext = {
              data: <HubSignupContextData>{
                privateKey: localStorage.getItem("circlesKey"),
              },
            };
            return ctx;
          }
        );

        requestEvent.id = Generate.randomHexString(8);
        window.o.publishEvent(requestEvent);
        triggered = true;
      }
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

  {#if lastLoadedDapp && lastLoadedPage && !lastLoadedDapp.hideFooter && !lastLoadedPage.hideFooter}
    {#if lastLoadedDapp.dappId === "homepage:1"}
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
            {#each lastLoadedDapp.pages
              .filter((o) => !o.isSystem)
              .slice(0, 2) as page}
              <a
                href="#/{lastLoadedDapp.routeParts.join('/') +
                  '/' +
                  page.routeParts.join('/')}"
                class="justify-self-center tab w-full text-center focus:text-teal-500 hover:text-teal-500  "
                class:hidden={isOpen}
              >
                <NavItem
                  isSelected={lastLoadedPage.routeParts[0] ===
                    page.title.toLowerCase()}
                  label={page.title}
                />
              </a>
            {/each}
            {#if !processWaiting}
              {#if !beforeCancelPrompt && lastPrompt && lastPrompt.navigation.canGoBack}
                <button
                  class="btn btn-outline btn-white ml-7 sm:ml-9"
                  on:click={() => modalProcess.sendAnswer(new Back())}
                  >BACK</button
                >
              {/if}
              <button
                class="justify-self-center min-w-min w-16 h-16 mx-2"
                class:bg-white={!isOpen}
                class:shadow-lg={!isOpen}
                class:col-start-3={!lastPrompt ||
                  (lastPrompt && !lastPrompt.navigation.canGoBack)}
                class:col-end-3={beforeCancelPrompt ||
                  !lastPrompt ||
                  (lastPrompt && !lastPrompt.navigation.canGoBack)}
              >
                {#if !isOpen}
                  <div
                    class="absolute transition-none shadow-md joinnowbutton btn btn-primary bottom-2 left-1/2"
                    on:click={() => login()}
                  >
                    <svg
                      class="inline w-6 h-6 mr-3"
                      viewBox="0 0 229 255"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M118.5 237C150.437 237 179.424 224.366 200.734 203.822C209.904 197.627 215.933 187.136 215.933 175.236C215.933 156.198 200.499 140.764 181.461 140.764C170.572 140.764 160.863 145.812 154.545 153.695L154.457 153.627C145.313 163.112 132.476 169.012 118.261 169.012C90.4957 169.012 67.9879 146.504 67.9879 118.739C67.9879 90.9745 90.4957 68.4667 118.261 68.4667C132.339 68.4667 145.067 74.254 154.193 83.5795L154.29 83.5037C160.581 90.2293 169.535 94.4328 179.471 94.4328C198.51 94.4328 213.944 78.9988 213.944 59.9601C213.944 48.1884 208.043 37.7949 199.039 31.5755C177.899 11.9794 149.599 0 118.5 0C53.0543 0 0 53.0543 0 118.5C0 183.946 53.0543 237 118.5 237Z"
                        fill="white"
                      />
                      <ellipse
                        cx="118.979"
                        cy="118.739"
                        rx="26.5727"
                        ry="26.3333"
                        fill="white"
                      />
                    </svg>
                    Join Now
                  </div>
                {:else}
                  <img
                    class="w-full -mt-4"
                    src="/images/common/close.png"
                    alt="close"
                    on:click={() => {
                      isOpen = !isOpen;
                      if (!isOpen) {
                        lastPrompt = null;
                        if (modalProcess) {
                          modalProcess.sendEvent(new Cancel());
                        }
                      }
                    }}
                  />
                {/if}
              </button>
              {#if !beforeCancelPrompt && lastPrompt && lastPrompt.navigation.canSkip}
                <button
                  class="btn btn-outline btn-white mr-7 sm:mr-9"
                  on:click={() => modalProcess.sendAnswer(new Skip())}
                  >SKIP</button
                >
              {/if}
            {/if}
            {#if lastLoadedDapp}
              {#each lastLoadedDapp.pages
                .filter((o) => !o.isSystem)
                .splice(2) as page}
                <a
                  href="#/{lastLoadedDapp.routeParts.join('/') +
                    '/' +
                    page.routeParts.join('/')}"
                  class="justify-self-center tab text-center"
                  class:hidden={isOpen}
                >
                  <NavItem
                    isSelected={lastLoadedPage.title == page.title}
                    label={page.title}
                  />
                </a>
              {/each}
            {/if}
            <!-- NOT MODAL END -->
          </div>
        </div>
      </footer>
    {:else}
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
            {#each lastLoadedDapp.pages
              .filter((o) => !o.isSystem)
              .slice(0, 2) as page}
              <a
                href="#/{lastLoadedDapp.routeParts.join('/') +
                  '/' +
                  page.routeParts.join('/')}"
                class="justify-self-center tab w-full text-center focus:text-teal-500 hover:text-teal-500  "
                class:hidden={isOpen}
              >
                <NavItem
                  isSelected={lastLoadedPage.routeParts[0] ===
                    page.title.toLowerCase()}
                  label={page.title}
                />
              </a>
            {/each}

            {#if !processWaiting}
              {#if !beforeCancelPrompt && lastPrompt && lastPrompt.navigation.canGoBack}
                <button
                  class="btn btn-outline btn-white ml-7 sm:ml-9"
                  on:click={() => modalProcess.sendAnswer(new Back())}
                  >BACK</button
                >
              {/if}
              <button
                class="justify-self-center btn-circle -m-4 min-w-min w-16 h-16 mx-2 circles-button "
                class:bg-white={!isOpen}
                class:shadow-lg={!isOpen}
                class:col-start-3={!lastPrompt ||
                  (lastPrompt && !lastPrompt.navigation.canGoBack)}
                class:col-end-3={beforeCancelPrompt ||
                  !lastPrompt ||
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
                {#if !isOpen}
                  <img
                    class="w-full"
                    src="/images/common/circles.png"
                    alt="open"
                  />
                {:else}
                  <img
                    class="w-full"
                    src="/images/common/close.png"
                    alt="close"
                  />
                {/if}
              </button>
              {#if !beforeCancelPrompt && lastPrompt && lastPrompt.navigation.canSkip}
                <button
                  class="btn btn-outline btn-white mr-7 sm:mr-9"
                  on:click={() => modalProcess.sendAnswer(new Skip())}
                  >SKIP</button
                >
              {/if}
            {/if}
            {#if lastLoadedDapp}
              {#each lastLoadedDapp.pages
                .filter((o) => !o.isSystem)
                .splice(2) as page}
                <a
                  href="#/{lastLoadedDapp.routeParts.join('/') +
                    '/' +
                    page.routeParts.join('/')}"
                  class="justify-self-center tab text-center"
                  class:hidden={isOpen}
                >
                  <NavItem
                    isSelected={lastLoadedPage.title == page.title}
                    label={page.title}
                  />
                </a>
              {/each}
            {/if}
            <!-- NOT MODAL END -->
          </div>
        </div>
      </footer>
    {/if}
  {/if}
</div>

<Modal bind:isOpen on:closeRequest={modalWantsToClose}>
  <div class="font-primary">
    {#if modalProcess}
      <ProcessContainer
        bind:beforeCancelPrompt
        bind:waiting={processWaiting}
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
  .tab:hover,
  .tab:focus,
  .tab:active {
    @apply text-light;
  }
  .tab:hover {
    @apply text-secondary;
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
</style>
