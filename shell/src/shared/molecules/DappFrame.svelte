<script lang="ts">
  import {onMount} from "svelte";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import {Page} from "@o-platform/o-interfaces/dist/routables/page";
  import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";
  import {Trigger} from "@o-platform/o-interfaces/dist/routables/trigger";
  import {dapps} from "../../loader";
  import {arraysEqual} from "../functions/arraysEqual";
  import {Link} from "@o-platform/o-interfaces/dist/routables/link";
  import Modal2 from "./Modal2.svelte";
  import {location, push} from "svelte-spa-router";
  import {getNavigationManifest} from "../functions/GetNavigationManifest.svelte";
  import {ProcessContainerNavigation} from "./ProcessContainer.svelte";
  import {NavigationManifest} from "@o-platform/o-interfaces/dist/navigationManifest";
  import NextNav from "./NextNav/NextNav.svelte";
  import Notification from "./NextNav/Components/Notification.svelte";
  import NotFound from "./../pages/NotFound.svelte";
  import {ProcessStarted} from "@o-platform/o-process/dist/events/processStarted";
  import {Generate} from "@o-platform/o-utils/dist/generate";
  import {shellProcess} from "../processes/shellProcess";
  import {RunProcess} from "@o-platform/o-process/dist/events/runProcess";
  import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
  import {identify} from "../../dapps/o-passport/processes/identify/identify";
  import {inbox} from "../stores/inbox";
  import {showNotifications} from "../processes/showNotifications";
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";

  import Icons from "./Icons.svelte";

  // Import Swiper styles
  import "swiper/swiper-bundle.css";

  import "swiper/components/navigation/navigation.min.css";
  import "swiper/components/pagination/pagination.min.css";

  // import Swiper core and required modules
  import SwiperCore, {Pagination, Navigation} from "swiper/core";
  import Layout from "../../dapps/o-onboarding/layouts/Layout.svelte";
  import Home from "../../dapps/o-homepage/pages/Home.svelte";
  import NavigationList from "../../dapps/o-onboarding/views/NavigationList.svelte";
  import Text from "../../dapps/o-onboarding/views/Text.svelte";
  import FilterList from "../../dapps/o-onboarding/views/FilterList.svelte";
  import {interpret} from "xstate";
  import {dialogMachine, DialogStateEvent, SHOW_PAGE} from "../../dapps/o-onboarding/components/dialog";
  import LinkComponent from "./NextNav/Components/Link.svelte";
  import ListComponent from "./NextNav/Components/List.svelte";
  import ActionButtonComponent from "./NextNav/Components/ActionButton.svelte";
  import {RuntimeLayout} from "../../dapps/o-onboarding/layouts/layout";

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
/*
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

  // Counts how often a detail page was opened and is reset whenever a regular site was displayed.
  // This is used to show/hide the back button when navigating in detail pages.
  let detailStack = [];

  let identityChecked: boolean = false;

  let navigateablePages: any;
  let previousPage: any;
  let nextPage: any;
  let currentPage: any;

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

      const processStarted: ProcessStarted = await window.o.requestEvent<ProcessStarted>(requestEvent);
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
      // ATTENTION! THIS IS A HACK!
      if (routable && routable.title == "Circles Land") {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "visible";
      }
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
      currentPage =
              navigateablePages[
                      navigateablePages.findIndex(
                              (x) => x.routeParts === routable.routeParts
                      )
                      ];
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
  }

  function handleRightSideBarOpen(event) {
    isRightSideBarOpen = event.detail.state;
  }
*/
  let mounted: boolean;
  let lastParamsJson: string;
  let identityChecked: boolean = false;
  let _runtimeDapps: { [dappId: string]: RuntimeDapp<any> } = {};
  let dapp: DappManifest<any>;
  let runtimeDapp: RuntimeDapp<any>;
  let routable: Routable;
  let _mainPage: Page<any, any>;
  let _modalPage: Page<any, any>;
  let lastMainUrl: string;
  let _entryTrigger: Trigger<any, any>;
  let pageParams: { [x: string]: any } = {};

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

          const processStarted: ProcessStarted = await window.o.requestEvent<ProcessStarted>(requestEvent);
          centerDialogMachine.send(<any><DialogStateEvent>{
              type: "SHOW_PROCESS",
              processId: processStarted.processId
          });
      };

      onParamsChanged();
      mounted = true;

      if (!identityChecked) {
          window.o.runProcess(identify, {}, {});
          identityChecked = true;
      }
  });

  $: {
      if (params && mounted && lastParamsJson != JSON.stringify(params)) {
          onParamsChanged();
          lastParamsJson = JSON.stringify(params);
      }

      if (
          $inbox.length &&
          navigationManifest &&
          navigationManifest.navPill /*&&
          _modal.getState().contentType !== "process"*/
      ) {
          navigationManifest.navPill.left = {
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
          if (_modalPage && layout.dialogs.center.isOpen) {

              /*
              if (!_modal.closeModal()) {
                  // TODO: This doesn't work as intended. (when in a process and user presses browser->back then strange URLs can arise).
                  push(lastMainUrl);
                  return;
              }
               */
          }
          _mainPage = <Page<any, any>>routable;
          pageParams = newPageParams;
          lastMainUrl = $location;
          const showPage = <SHOW_PAGE>{
              type: "SHOW_PAGE",
              page: _mainPage,
              pageParams: newPageParams,
              routable: routable,
              runtimeDapp: runtimeDapp
          };
          console.log(`mainDialogMachine.send():`, showPage)
          centerDialogMachine.send(<any>showPage);
      } else if (
          routable.type === "page" &&
          (<Page<any, any>>routable).position === "modal"
      ) {
          _modalPage = <Page<any, any>>routable;
          const showPage = <SHOW_PAGE>{
              type: "SHOW_PAGE",
              page: _modalPage,
              pageParams: newPageParams,
              routable: routable,
              runtimeDapp: runtimeDapp
          };
          console.log(`mainDialogMachine.send():`, showPage)
          mainDialogMachine.send(<any>showPage);
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

      //_navManifest = generateNavManifest();
  }

  let layout: RuntimeLayout = <RuntimeLayout>{
      main: undefined,
      dialogs:{
          left: undefined,
          center: undefined,
          right: undefined
      }
  };

  const mainDialogMachine = interpret(dialogMachine)
      .onEvent(event => {
          console.log("mainDialogMachine.onEvent: ", event);

          if (event.type === "CONTENT_CHANGED") {
              layout.main = (<any>event).content;
          }
      })
      .onTransition((state) => console.log("mainDialogMachine.onTransition: ", state.value))
      .start();

  const leftDialogMachine = interpret(dialogMachine)
      .onEvent(event => {
          console.log("leftDialogMachine.onEvent: ", event);

          if (event.type === "CONTENT_CHANGED") {
              layout.dialogs.left = (<any>event).content;
          }
      })
      .onTransition((state) => console.log("leftDialogMachine.onTransition: ", state.value))
      .start();

  const centerDialogMachine = interpret(dialogMachine)
      .onEvent(event => {
          console.log("centerDialogMachine.onEvent: ", event);

          if (event.type === "CONTENT_CHANGED") {
              layout.dialogs.center = (<any>event).content;
          }
      })
      .onTransition((state) => console.log("centerDialogMachine.onTransition: ", state.value))
      .start();


  const rightDialogMachine = interpret(dialogMachine)
      .onEvent(event => {
          console.log("rightDialogMachine.onEvent: ", event);

          if (event.type === "CONTENT_CHANGED") {
              layout.dialogs.right = (<any>event).content;
          }
      })
      .onTransition((state) => console.log("rightDialogMachine.onTransition: ", state.value))
      .start();


  const navigationManifest: NavigationManifest = {
      navPill: {
          left: {
              component: ListComponent,
              props: {
                  icon: "list",
                  action: () => {
                      layout.dialogs.left.isOpen = !layout.dialogs.left.isOpen;
                  },
              },
          },
          center: {
              component: ActionButtonComponent,
              props: {
                  icon: "logo",
                  action: () => {
                      layout.dialogs.center.isOpen = !layout.dialogs.center.isOpen;
                  }
              },
          },
          right: {
              component: LinkComponent,
              props: {
                  icon: "home",
                  action: () => {
                      alert("Home sweet home")
                  },
              },
          },
      },
      leftSlot: {
          component: LinkComponent,
          props: {
              icon: "list",
              action: () => layout.dialogs.left.isOpen = !layout.dialogs.left.isOpen
          },
      }
  };

</script>

<Layout layout={layout} navigation={navigationManifest} sliderPages={[]} />
