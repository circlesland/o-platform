<script lang="ts">
  import { onMount } from "svelte";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import { Page } from "@o-platform/o-interfaces/dist/routables/page";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
  import { Trigger } from "@o-platform/o-interfaces/dist/routables/trigger";
  import { dapps } from "../../loader";
  import { arraysEqual } from "../functions/arraysEqual";
  import { Link } from "@o-platform/o-interfaces/dist/routables/link";
  import Modal2 from "./Modal2.svelte";
  import { location, push } from "svelte-spa-router";
  import { getNavigationManifest } from "../functions/GetNavigationManifest.svelte";
  import { ProcessContainerNavigation } from "./ProcessContainer.svelte";
  import { NavigationManifest } from "@o-platform/o-interfaces/dist/navigationManifest";
  import NextNav from "./NextNav/NextNav.svelte";
  import Notification from "./NextNav/Components/Notification.svelte";
  import NotFound from "./../pages/NotFound.svelte";
  import { ProcessStarted } from "@o-platform/o-process/dist/events/processStarted";
  import { Generate } from "@o-platform/o-utils/dist/generate";
  import { shellProcess } from "../processes/shellProcess";
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
  import { identify } from "../../dapps/o-passport/processes/identify/identify";
  import { inbox } from "../stores/inbox";
  import { showNotifications } from "../processes/showNotifications";

  import AsideMenuLeft from "./AsideMenuLeft.svelte";
  import AsideMenuRight from "./AsideMenuRight.svelte";
  import Icons from "./Icons.svelte";

  import "simplebar";
  import "simplebar/dist/simplebar.css";

  // Import Swiper styles
  import "swiper/swiper-bundle.css";

  import "swiper/components/navigation/navigation.min.css";
  import "swiper/components/pagination/pagination.min.css";

  // import Swiper core and required modules
  import SwiperCore, { Pagination, Navigation } from "swiper/core";

  // install Swiper modules
  SwiperCore.use([Navigation, Pagination]);

  export let params: {
    dappId: string;
    "1": string | null;
    "2": string | null;
    "3": string | null;
    "4": string | null;
    "5": string | null;
    "6": string | null;
  };

  let isLeftSideBarOpen: boolean = false;
  let isRightSideBarOpen: boolean = false;

  let pageParams: { [x: string]: any } = {};

  let layoutClasses = "";

  let _mainPage: Page<any, any>;
  let _modalPage: Page<any, any>;

  let _entryTrigger: Trigger<any, any>;

  let _modal: Modal2;
  let _modalIsOpen = false;

  let _processNavigation: ProcessContainerNavigation;
  let _navManifest: NavigationManifest;
  let _asideMenuLeft: AsideMenuLeft;

  let _runtimeDapps: { [dappId: string]: RuntimeDapp<any> } = {};

  let dapp: DappManifest<any>;
  let runtimeDapp: RuntimeDapp<any>;
  let routable: Routable;
  let mounted: boolean;
  let lastMainUrl: string;

  function openPage(route) {
    let link =
      runtimeDapp.routeParts
        .map((o) => (o.startsWith("=") ? o.replace("=", "") : o))
        .join("/") +
      "/" +
      route.routeParts
        .map((o) => (o.startsWith("=") ? o.replace("=", "") : o))
        .join("/");
    push(`#/${link}`);
  }

  // Counts how often a detail page was opened and is reset whenever a regular site was displayed.
  // This is used to show/hide the back button when navigating in detail pages.
  let detailStack = [];

  let identityChecked: boolean = false;

  let navigateablePages: any;
  let previousPage: any;
  let nextPage: any;

  onMount(async () => {
    window.o.events.subscribe(async (event: PlatformEvent) => {
      switch (event.type) {
        case "shell.runProcess":
          const runProcessEvent = <RunProcess<any>>event;
          const runningProcess = await window.o.stateMachines.run(
            runProcessEvent.definition,
            runProcessEvent.contextModifier
          );

          // If not, send an event with the process id.
          const startedEvent = new ProcessStarted(runningProcess.id);
          startedEvent.responseToId = runProcessEvent.id;
          window.o.publishEvent(startedEvent);
          break;
      }
    });

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

      const processStarted: ProcessStarted = await window.o.requestEvent<
        ProcessStarted
      >(requestEvent);
      _modal.showProcess(processStarted.processId);
    };

    onParamsChanged();
    mounted = true;

    if (!identityChecked) {
      window.o.runProcess(identify, {}, {});
      identityChecked = true;
    }
  });

  let lastParamsJson: string;

  $: {
    if (params && mounted && lastParamsJson != JSON.stringify(params)) {
      onParamsChanged();
      lastParamsJson = JSON.stringify(params);
    }

    layoutClasses =
      (dapp && dapp.isFullWidth) || (_mainPage && _mainPage.isFullWidth)
        ? ""
        : "md:w-2/3 xl:w-1/2";

    // TODO: ADD ASIDE MENU CHECK
    if (_modal && _modalIsOpen) {
      // isLeftMenuOpen = false;
      document.body.style.overflow = "hidden";
    } else {
      // isLeftMenuOpen = true;
      document.body.style.overflow = "visible";
    }

    if (
      $inbox.length &&
      _navManifest &&
      _navManifest.navPill &&
      _modal.getState().contentType !== "process"
    ) {
      _navManifest.navPill.left = {
        component: Notification,
        props: {
          action: () => {
            let item;
            let s = inbox.subscribe((o) => {
              item = o;
            });
            s();

            window.o.runProcess(showNotifications, {
              events: JSON.parse(JSON.stringify(item)),
            });
          },
        },
      };
    }

    if (runtimeDapp) {
      navigateablePages = runtimeDapp.routables.filter((o) => !o.isSystem);
      nextPage = navigateablePages[
        navigateablePages.findIndex(
          (x) => x.routeParts === routable.routeParts
        ) + 1
      ]
        ? navigateablePages[
            navigateablePages.findIndex(
              (x) => x.routeParts === routable.routeParts
            ) + 1
          ]
        : null;
      previousPage = navigateablePages[
        navigateablePages.findIndex(
          (x) => x.routeParts === routable.routeParts
        ) - 1
      ]
        ? navigateablePages[
            navigateablePages.findIndex(
              (x) => x.routeParts === routable.routeParts
            ) - 1
          ]
        : null;
    }
  }

  function onParamsChanged() {
    let dappId: string;
    if (!params.dappId) {
      const defaultApp = dapps.find(
        (o) => o.routeParts && o.routeParts.length == 0
      );
      if (defaultApp) {
        dappId = defaultApp.dappId;
      } else {
        _mainPage = null;
        return;
      }
      params.dappId = dappId;
    } else {
      dappId = params.dappId.endsWith(":1")
        ? params.dappId
        : params.dappId + ":1";
    }

    dapp = dapps.find((o) => o.dappId == dappId);
    if (!_runtimeDapps[dappId]) {
      _runtimeDapps[dappId] = <RuntimeDapp<any>>{
        ...dapp,
        route: dapp,
        state: {},
      };
      if (_runtimeDapps[dappId].initialize) {
        _runtimeDapps[dappId].initialize([], runtimeDapp);
      }
    }

    runtimeDapp = _runtimeDapps[dappId];

    if (!dapp) {
      _mainPage = null;
      return;
    }

    const findRoute = (params: { [x: string]: string }) => {
      const newPageParams = {};
      let matchingRoute: Routable;

      let routePartsFromParams = [];
      if (params["1"]) routePartsFromParams.push(params["1"]);
      if (params["2"]) routePartsFromParams.push(params["2"]);
      if (params["3"]) routePartsFromParams.push(params["3"]);
      if (params["4"]) routePartsFromParams.push(params["4"]);
      if (params["5"]) routePartsFromParams.push(params["5"]);
      if (params["6"]) routePartsFromParams.push(params["6"]);

      let possibleRoutes = dapp.routables.filter(
        (o) => o.routeParts.length == routePartsFromParams.length
      );
      console.log("Possible routes (same length):", possibleRoutes);

      for (let route of possibleRoutes) {
        const exactParts = route.routeParts
          .filter((part) => part.startsWith("="))
          .map((o) => o.replace("=", ""));
        if (exactParts.length <= routePartsFromParams.length) {
          // Could be a matching route
          const overlapFromParams = routePartsFromParams.slice(
            0,
            exactParts.length
          );
          if (arraysEqual(exactParts, overlapFromParams)) {
            matchingRoute = route;
            console.log("Matching route:", route);

            const remainingParamsSpec = route.routeParts
              .slice(exactParts.length)
              .map((o) => o.replace(":", "").replace("?", ""));
            const remainingParams = routePartsFromParams.slice(
              exactParts.length
            );

            for (let i = 0; i < remainingParamsSpec.length; i++) {
              newPageParams[remainingParamsSpec[i]] = remainingParams[i];
            }
            break;
          }
        }
      }

      return {
        found: !!matchingRoute,
        routable: matchingRoute,
        pageParams: newPageParams,
      };
    };

    const findRouteResult = findRoute(params);
    if (!findRouteResult.found) {
      _mainPage = null;
      return;
    }

    routable = findRouteResult.routable;
    const newPageParams = findRouteResult.pageParams;

    if (
      routable.type === "page" &&
      (<Page<any, any>>routable).position !== "modal"
    ) {
      if (_modalPage && _modalIsOpen) {
        if (!_modal.closeModal()) {
          // TODO: This doesn't work as intended. (when in a process and user presses browser->back then strange URLs can arise).
          push(lastMainUrl);
          return;
        }
      }
      _mainPage = <Page<any, any>>routable;
      pageParams = newPageParams;
      lastMainUrl = $location;
      detailStack = [];
    } else if (
      routable.type === "page" &&
      (<Page<any, any>>routable).position === "modal"
    ) {
      _modalPage = <Page<any, any>>routable;
      if (_mainPage) {
        if (
          detailStack.length > 1 &&
          detailStack[detailStack.length - 2] == $location
        ) {
          // We went back
          detailStack.pop();
        } else {
          detailStack.push($location);
        }
      }
      _modal.showPage(
        _modalPage,
        newPageParams,
        runtimeDapp,
        routable,
        detailStack.length
      );
    } else if (routable.type === "trigger") {
      _entryTrigger = <Trigger<any, any>>routable;
      if (_entryTrigger.eventFactory) {
        const triggerEvent = _entryTrigger.eventFactory(params, dapp);
        if (!triggerEvent) {
          throw new Error(
            `The _entryTrigger.eventFactory didn't return an event.`
          );
        }
        window.o.publishEvent(triggerEvent);
      }
      if (_entryTrigger.action) {
        _entryTrigger.action(params, dapp);
      }
    } else if (routable.type === "link") {
      const link = <Link<any, any>>routable;
      link.url(params, dapp);
      window.history.back();
      return;
    } else {
      throw new Error(
        `Entry point type '${routable.type}' is not supported by the DappFrame.`
      );
    }

    if (!_mainPage && dapp.defaultRoute) {
      const defaultRoutable = findRoute({
        dappId: dapp.dappId,
        "1": dapp.defaultRoute.length > 0 ? dapp.defaultRoute[0] : null,
        "2": dapp.defaultRoute.length > 1 ? dapp.defaultRoute[1] : null,
        "3": dapp.defaultRoute.length > 2 ? dapp.defaultRoute[2] : null,
        "4": dapp.defaultRoute.length > 3 ? dapp.defaultRoute[3] : null,
        "5": dapp.defaultRoute.length > 4 ? dapp.defaultRoute[4] : null,
        "6": dapp.defaultRoute.length > 5 ? dapp.defaultRoute[5] : null,
      });
      if (defaultRoutable.found) {
        _mainPage = <any>defaultRoutable.routable;
        lastMainUrl = `/${
          dapp.dappId
        }/${defaultRoutable.routable.routeParts
          .map((o) => o.replace("=", ""))
          .join("/")}`;
      }
      pageParams = defaultRoutable.pageParams;
    }

    _navManifest = generateNavManifest();
  }

  function generateNavManifest() {
    const navManifest = getNavigationManifest(
      runtimeDapp,
      _processNavigation,
      _modal,
      _asideMenuLeft,
      null
    );
    console.log("generateNavManifest: ", navManifest);

    return navManifest;
  }

  function handleLeftSideBarOpen(event) {
    isLeftSideBarOpen = event.detail.state;
    if (event.detail.state == true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }
  function handleRightSideBarOpen(event) {
    isRightSideBarOpen = event.detail.state;
  }
</script>

<div class="absolute flex flex-row w-full overflow-auto">
  {#if runtimeDapp}
    <AsideMenuLeft
      {runtimeDapp}
      bind:this={_asideMenuLeft}
      on:openLeftSidebar={handleLeftSideBarOpen}
    />
  {/if}
  <main class="relative z-30 w-full overflow-auto">

    {#if previousPage}
      <div
        class="fixed cursor-pointer top-1/2 left-2"
        on:click={() => openPage(previousPage)}
      >
        <Icons icon="simplearrowleft" />
      </div>
    {/if}
    {#if nextPage}
      <div
        class="fixed cursor-pointer top-1/2 right-2"
        on:click={() => openPage(nextPage)}
      >
        <Icons icon="simplearrowright" />
      </div>
    {/if}
    <div
      class="w-full mainContent"
      class:pl-64={isLeftSideBarOpen}
      class:pr-64={isRightSideBarOpen}
      class:mb-16={(!_modal || !_modalIsOpen) && dapp && dapp.dappId !== 'homepage:1'}
      class:blur={_modal && _modalIsOpen}
    >

      {#if _mainPage}
        <svelte:component
          this={_mainPage.component}
          params={pageParams}
          {runtimeDapp}
          {routable}
        />
      {:else}
        <NotFound />
      {/if}
    </div>
  </main>
  <AsideMenuRight on:isRightSideBarOpen={handleRightSideBarOpen} />
</div>
{#if _navManifest}
  <NextNav navigation={_navManifest} />
{/if}
<Modal2
  {runtimeDapp}
  {routable}
  bind:this={_modal}
  on:navigation={(event) => {
    _processNavigation = event.detail;
    _navManifest = generateNavManifest();
  }}
  on:modalOpen={(e) => {
    _modalIsOpen = e.detail;
    _navManifest = generateNavManifest();
    if (!_modalIsOpen && _modalPage && lastMainUrl) {
      push(lastMainUrl);
      _modalPage = null;
    }
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

  /* .mainContent {
    --tw-text-opacity: 1;
    background-image: linear-gradient(
      180deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(253, 254, 255, 1) 85%,
      rgba(13, 43, 102, 0) 100%
    );
  } */

  .swiper-container {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;

    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }

  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
