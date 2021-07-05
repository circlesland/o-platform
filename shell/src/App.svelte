<script lang="ts">
  import "./shared/css/base.css";
  import "./shared/css/components.css";
  import "./shared/css/utilities.css";
  import routes from "./loader";
  import { getLastLoadedDapp } from "./loader";
  import { getLastLoadedPage } from "./loader";
  import Router, { push } from "svelte-spa-router";
  import Modal from "./shared/molecules/Modal.svelte";
  import ProcessContainer from "./shared/molecules/ProcessContainer.svelte";
  import { Process } from "@o-platform/o-process/dist/interfaces/process";
  import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import { NavigateTo } from "@o-platform/o-events/dist/shell/navigateTo";
  import { ProgressSignal } from "@o-platform/o-events/dist/signals/progressSignal";
  import { ProcessStarted } from "@o-platform/o-process/dist/events/processStarted";
  import {
    runShellProcess
  } from "./shared/processes/shellProcess";
  import { Subscription } from "rxjs";
  import { Prompt } from "@o-platform/o-process/dist/events/prompt";
  import {
    Cancel,
    CancelRequest,
  } from "@o-platform/o-process/dist/events/cancel";
  import { ProcessEvent } from "@o-platform/o-process/dist/interfaces/processEvent";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
  import {
    identify,
    IdentifyContextData,
  } from "./dapps/o-passport/processes/identify/identify";
  import { SvelteToast } from "./shared/molecules/Toast";
  import { XDaiThresholdTrigger } from "./xDaiThresholdTrigger";
  import { me } from "./shared/stores/me";
  import { INVITE_VALUE } from "./dapps/o-passport/processes/invite/invite";
  import {
    deploySafe,
    HubSignupContextData,
  } from "./dapps/o-banking/processes/deploySafe";
  import DappNavItem from "./shared/atoms/DappsNavItem.svelte";
  import NextNav from "./shared/molecules/NextNav/NextNav.svelte";
  import Icons from "./shared/molecules/Icons.svelte";
  import {onMount} from "svelte";
  import {Page} from "@o-platform/o-interfaces/dist/routables/page";
  import {backStack} from "./main";

  let isOpen: boolean = false;
  let processWaiting: boolean = false;
  let beforeCancelPrompt: Prompt<any>; // Is set when the "do you want to cancel?" prompt is shown
  let modalProcess: Process;
  let showList: boolean = false;
  let showHomeMenuList: boolean = false;

  let modalProcessEventSubscription: Subscription;
  let current;

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

  window.o.events.subscribe(async (event: PlatformEvent) => {
    if (event.type === "shell.closeModal") {
      console.log("___modal: close")
      isOpen = false;
      lastPrompt = null;
    }
    if (event.type === "shell.openModal") {
      console.log("___modal: open")
      isOpen = true;
    }
    if (event.type === "shell.dappLoading") {
      routeLoaded();
    }
    if (event.type === "shell.runProcess") {
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
              lastPrompt = <Prompt<any>>(<any>processEvent.event).wrappedEvent;
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
  });

  function modalWantsToClose() {
    // Use this to cancel the close request etc.
    if (modalProcess && isOpen) {
      modalProcess.sendEvent(new CancelRequest());
    }
    if (!modalProcess && isOpen) {
      console.log("___modal: closed")
      isOpen = false;
      showList = false;
    }
  }

  function conditionsFailed(event) {
    // TODO: Cannot currently remember what this callback does. Lookup documentation.
  }

  let lastPrompt: Prompt<any> | undefined = undefined;

  function routeLoading(args) {
    processWaiting = false;
    if (!publicUrls[args.detail.location] && !$me) {
      setTimeout(() => {
        window.location.href = "/#/login";
      }, 0);
    }
  }

  let lastLoadedPage: Page<any,any>;
  let lastLoadedDapp: DappManifest<any>;

  function routeLoaded() {
    // Pretty self explanatory. For more lookup the svelte-spa-router docs,
    lastLoadedPage = getLastLoadedPage();
    lastLoadedDapp = getLastLoadedDapp();

    console.log("LAST DAPP: ", lastLoadedDapp);
    console.log("LAST PAGE: ", lastLoadedPage);
  }

  async function login(appId: string, code?: string) {
    if (isOpen) {
      console.log("___modal: closed")
      isOpen = false;
      lastPrompt = null;
      if (modalProcess) {
        modalProcess.sendEvent(new Cancel());
      }
      return;
    }
    window.o.publishEvent(runShellProcess(identify, <IdentifyContextData>{
      redirectTo: "/dashboard",
    }));
  }

  let layoutClasses = "";

  let balanceThresholdTrigger: XDaiThresholdTrigger;
  let triggered = false;

  $: {
    /* Avoid scrolling background on open modal */

    if (isOpen) {
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
            window.o.publishEvent(runShellProcess(deploySafe, <HubSignupContextData>{
              privateKey: localStorage.getItem("circlesKey"),
            }));
          }
        );
      } else if (
        !triggered &&
        (!!localStorage.getItem("fundsSafe") ||
          !!localStorage.getItem("signsUpAtCircles"))
      ) {
        window.o.publishEvent(runShellProcess(deploySafe, <HubSignupContextData>{
          privateKey: localStorage.getItem("circlesKey"),
        }));
        triggered = true;
      }
    }

    layoutClasses =
      (lastLoadedDapp && lastLoadedDapp.isFullWidth) ||
      (lastLoadedPage && lastLoadedPage.isFullWidth)
        ? ""
        : "md:w-2/3 xl:w-1/2";
  }

  function handleActionButton(event) {
    if (event.detail.actionButton == "close") {
      modalWantsToClose();
    }
    if (event.detail.actionButton == "open") {
      console.log("___modal: open")
      isOpen = true;
    }
  }
  function handleMenuButton(event) {
    if (event.detail.menuButton == "close") {
      modalWantsToClose();
    }
    if (event.detail.menuButton == "open") {
      // Load menu from dispatch.
      if (event.detail.action && event.detail.action == "homemenu") {
        showHomeMenuList = true;
      } else {
        showList = true;
      }
      console.log("___modal: open")
      isOpen = true;
    }
  }

  let _routes:any;
  onMount(async () => {
    _routes = await routes();
    console.log("Loaded routes:", _routes);
  });
</script>

{#if _routes}
<SvelteToast />
<div class="flex flex-col text-base">
  <!-- TODO: Note: All headers are now part of their dapps
  <header class="z-10 w-full mx-auto md:w-2/3 xl:w-1/2">
  </header> -->

  <main class="z-30 flex-1 overflow-y-auto">
    <div
      class="w-full mx-auto {layoutClasses}"
      class:mb-16={!isOpen &&
        lastLoadedDapp &&
        lastLoadedDapp.dappId !== "homepage:1"}
      class:blur={isOpen}
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
    navigation={lastLoadedDapp.navigation}
    bind:modalProcess
    bind:lastPrompt
    on:actionButton={handleActionButton}
    on:menuButton={handleMenuButton}
  />
{/if}
<Modal bind:isOpen on:closeRequest={modalWantsToClose}>
  <!-- TODO: Put each nav content into Components and load via manifest  -->
  {#if modalProcess}
    <ProcessContainer
      bind:beforeCancelPrompt
      bind:waiting={processWaiting}
      process={modalProcess}
      on:stopped={() => {
        console.log("___modal: closed")

        isOpen = false;
        lastPrompt = null;
        modalProcess = null;

        if (backStack.length > 0) {
          backStack.pop();
          history.back();
        }
      }}
    />
  {:else if showList}
    <div class="flex flex-col p-4 space-y-6">
      {#each lastLoadedDapp.routables.filter((o) => !o.isSystem) as page}
        <DappNavItem
          segment="#/{lastLoadedDapp.routeParts.join('/') +
            '/' +
            page.routeParts.join('/')}"
          title={page.title}
          on:navigate={modalWantsToClose}
        />
      {/each}
    </div>
  {:else if showHomeMenuList}
    <div class="flex flex-col p-4 space-y-6">
      <DappNavItem segment="/" title="Home" on:navigate={modalWantsToClose} />
      <DappNavItem
        segment="https://discord.gg/CS6xq7jECR"
        title="Chat"
        external={true}
        on:navigate={modalWantsToClose}
      />
      <DappNavItem
        segment="https://aboutcircles.com"
        title="Forum"
        external={true}
        on:navigate={modalWantsToClose}
      />
      <DappNavItem
        segment="https://blog.circles.land/"
        title="Blog"
        external={true}
        on:navigate={modalWantsToClose}
      />
      <DappNavItem
        segment="https://blog.circles.land/whitepaper/"
        title="Whitepaper"
        external={true}
        on:navigate={modalWantsToClose}
      />
    </div>
  {:else}
    <!-- No process -->
    {#if getLastLoadedDapp()}
      <div class="flex flex-wrap items-center justify-center p-4 space-x-10">
        {#each getLastLoadedDapp().jumplist.items({}, getLastLoadedDapp()) as action}
          <div
            on:click={() => window.o.publishEvent(action.event)}
            class="flex-grow text-xs text-center cursor-pointer "
            class:text-error={action.key === "logout"}
          >
            <Icons icon={action.icon} />
            <span class="block mt-2">{action.label}</span>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</Modal>

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
</style>
{/if}