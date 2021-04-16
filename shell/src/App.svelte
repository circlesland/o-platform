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
    shellProcess,
    ShellProcessContext,
  } from "./shared/processes/shellProcess";
  import { authenticate } from "./dapps/o-auth/processes/authenticate";
  import Error from "./shared/atoms/Error.svelte";
  import LoadingIndicator from "./shared/atoms/LoadingIndicator.svelte";
  import Success from "./shared/atoms/Success.svelte";
  import { Generate } from "@o-platform/o-utils/dist/generate";
  import { Subscription } from "rxjs";
  import { Prompt } from "@o-platform/o-process/dist/events/prompt";
  import { Back } from "@o-platform/o-process/dist/events/back";
  import { Skip } from "@o-platform/o-process/dist/events/skip";
  import { Cancel } from "@o-platform/o-process/dist/events/cancel";
  import { ProcessEvent } from "@o-platform/o-process/dist/interfaces/processEvent";
  import { PageManifest } from "@o-platform/o-interfaces/dist/pageManifest";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";

  let isOpen: boolean = false;
  let modalProcess: Process;
  let modalProcessEventSubscription: Subscription;

  let progressIndicator: {
    message: string;
    percent: number;
  };

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
  });

  function modalWantsToClose() {
    // Use this to cancel the close request etc.
    if (isOpen) {
      isOpen = false;
      lastPrompt = null;
      if (modalProcess) {
        modalProcess.sendEvent(new Cancel());
      }
      return;
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

    if (isOpen) {
      isOpen = false;
      lastPrompt = null;
      if (modalProcess) {
        modalProcess.sendEvent(new Cancel());
      }
      return;
    }
  }

  function authenticateWithCircles(appId: string, code?: string) {
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
        ctx.childProcessDefinition = authenticate;
        ctx.childContext = {
          data: {
            appId: appId,
            code: code,
          },
          dirtyFlags: {},
          environment: {
            errorView: Error,
            progressView: LoadingIndicator,
            successView: Success,
          },
        };
        return ctx;
      }
    );

    requestEvent.id = Generate.randomHexString(8);
    window.o.publishEvent(requestEvent);
  }

  let globalState = window.o.globalState;

  let layoutClasses = "";
  $: {
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

  <main class="flex-1 overflow-y-visible z-30">
    <div class="w-full mx-auto {layoutClasses}">
      <Router
        {routes}
        on:conditionsFailed={conditionsFailed}
        on:routeLoading={routeLoading}
        on:routeLoaded={routeLoaded}
      />
    </div>
  </main>

  {#if lastLoadedDapp && !lastLoadedDapp.hideFooter && lastLoadedPage && !lastLoadedPage.hideFooter}
    {#if !globalState.hasKey}
      <footer class="z-50  w-full sticky bottom-0 ">
        <div class="flex justify-around ">
          <button
            class="mb-4 btn btn-outline bg-base-100"
            on:click={() => authenticateWithCircles("circles.land")}
          >
            {#if !isOpen}
              <img
                width="15px"
                class="mr-3"
                src="/images/common/circles.png"
                alt="circles.land"
              /> login with circles
            {:else}
              <img
                width="15px"
                class="mr-3"
                src="/images/common/circles.png"
                alt="circles.land"
              /> Close
            {/if}
          </button>
        </div>
      </footer>
    {:else}
      <footer
        class="z-50  w-full sticky bottom-0 bg-white h-12 border-t border-base-300"
      >
        <div class="w-full mx-auto md:w-2/3 xl:w-1/2 ">
          {#if !modalProcess}
            <!-- NOT MODAL START -->
            <div class="grid grid-cols-5">
              {#if lastLoadedDapp}
                {#each lastLoadedDapp.pages
                  .filter((o) => !o.isSystem)
                  .slice(0, 2) as page}
                  <a
                    href="#/{lastLoadedDapp.routeParts.join('/') +
                      '/' +
                      page.routeParts.join('/')}"
                    class="justify-self-center inline-block w-full text-center focus:text-teal-500 hover:text-teal-500"
                  >
                    <div
                      class="justify-self-center h-full m-auto mt-1 bottom-nav-icon icon-{page.title.toLowerCase()} "
                    />
                    <span class="block text-xs tab p-0">{page.title}</span>
                  </a>
                {/each}
              {/if}
              <button
                class="justify-self-center col-start-3 col-end-3 bg-white btn-circle -m-4 min-w-min w-14 h-14 mx-2 shadow-lg circles-button "
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

              {#if lastLoadedDapp}
                {#each lastLoadedDapp.pages

                .filter((o) => !o.isSystem)
                .splice(2) as page}
                <a
                  href="#/{lastLoadedDapp.routeParts.join('/') +
                    '/' +
                    page.routeParts.join('/')}"
                  class="justify-self-center inline-block w-full text-center focus:text-teal-500 hover:text-teal-500"
                >
                  <div
                    class="justify-self-center h-full m-auto mt-1  bottom-nav-icon icon-{page.title.toLowerCase()}"
                  />
                  <span class="block text-xs tab p-0">{page.title}</span>
                </a>
              {/each}
            {/if}
            <!-- NOT MODAL END -->
          </div>
        {:else}
          <!-- MODAL START -->
          <div class="grid grid-cols-1">
            {#if lastPrompt && lastPrompt.navigation.canGoBack}
              <button
                class="bg-white btn btn-outline"
                on:click={() => modalProcess.sendAnswer(new Back())}>back</button
              >
            {/if}

              <button
                class="justify-self-center bg-white btn-circle -m-4 min-w-min w-14 h-14 mx-2 shadow-lg circles-button "
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
                class="bg-white btn btn-outline"
                on:click={() => modalProcess.sendAnswer(new Skip())}>skip</button
              >
            {/if}
          </div>
          <!--  MODAL END -->
        {/if}
        </div>
      </footer>
    {/if}
  {/if}
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
        <div class="mb-8 space-y-4">
          {#each getLastLoadedDapp().actions as action}
            <button
              on:click={() =>
                window.o.publishEvent(action.event(getLastLoadedDapp()))}
              class="w-full btn btn-primary btn-outline">{action.label}</button
            >
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</Modal>
