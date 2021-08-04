<script lang="ts">
  import {onMount} from "svelte";
  import {ProcessStarted} from "@o-platform/o-process/dist/events/processStarted";
  import {Generate} from "@o-platform/o-utils/dist/generate";
  import {shellProcess} from "../processes/shellProcess";
  import {RunProcess} from "@o-platform/o-process/dist/events/runProcess";
  import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
  import {identify} from "../../dapps/o-passport/processes/identify/identify";

  // Import Swiper styles
  import "swiper/swiper-bundle.css";

  import "swiper/components/navigation/navigation.min.css";
  import "swiper/components/pagination/pagination.min.css";

  // import Swiper core and required modules
  import SwiperCore, {Pagination, Navigation} from "swiper/core";
  import Layout from "../../dapps/o-onboarding/layouts/Layout.svelte";
  import ProcessContainer from "../../shared/molecules/ProcessContainer.svelte";
  import LinkComponent from "../../shared/molecules/NextNav/Components/Link.svelte";
  import ListComponent from "../../shared/molecules/NextNav/Components/List.svelte";
  import ActionButtonComponent from "../../shared/molecules/NextNav/Components/ActionButton.svelte";
  import {RuntimeLayout} from "../../dapps/o-onboarding/layouts/layout";
  import NavigationList from "../../dapps/o-onboarding/views/NavigationList.svelte";
  import QuickActions from "../../dapps/o-onboarding/views/QuickActions.svelte";
  import {NavigationManifest} from "@o-platform/o-interfaces/dist/navigationManifest";
  import {Page} from "@o-platform/o-interfaces/dist/routables/page";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {findDappById} from "../functions/findDappById";
  import {RuntimeDapps} from "../../runtimeDapps";
  import {findRoutableByParams, FindRouteResult} from "../functions/findRoutableByParams";
  import {pop, push} from "svelte-spa-router";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";

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

  let lastParamsJson: string = "";
  let identityChecked: boolean = false;
  let dappFrameState:  any;
  let nextRoutable: Routable|undefined;

  let dapp:DappManifest<any>;
  let runtimeDapp: RuntimeDapp<any>;
  let routable: Routable;
  let modalContent: "process" | "page" | "quickActions" | "none" = "none";

  let layout: RuntimeLayout = <RuntimeLayout>{
      main: undefined,
      dialogs:{
          left: undefined,
          center: undefined,
          right: undefined
      }
  };

  let navigation: NavigationManifest;

  onMount(async () => {
      window.o.events.subscribe(async event => {
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
              case "process.stopped":
                  await hideCenter();
                  break;
          }
      });

      // Set the global "runProcess" function. This needs to be done here
      // because before the dialog wouldn't be ready.
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
          showModalProcess(processStarted.processId)
      };

      navigation = {
          leftSlot: {
              component: LinkComponent,
                  props: {
                  icon: "list",
                      action: () => {
                      // TODO: Expand collapse nav
                      navigation.leftSlot.props.icon =
                          navigation.leftSlot.props.icon === "list"
                              ? "simplearrowleft"
                              : "list";

                      if (navigation.leftSlot.props.icon === "list") {
                          // TODO: Close nav
                          layout.dialogs.left = {
                              isOpen: false,
                              component: NavigationList,
                              routable: routable,
                              runtimeDapp: runtimeDapp,
                              params: {
                                  routable: routable,
                                  runtimeDapp: runtimeDapp,
                              }
                          }
                      } else {
                          // TODO: Open nav
                          layout.dialogs.left = {
                              isOpen: true,
                              component: NavigationList,
                              routable: routable,
                              runtimeDapp: runtimeDapp,
                              params: {
                                  routable: routable,
                                  runtimeDapp: runtimeDapp,
                              }
                          }
                      }
                      // forwardNavEvent({position: "left"})
                  },
              },
          },
          navPill: {
              left: {
                  component: ListComponent,
                      props: {
                      icon: "list",
                          action: () => {
                      },
                  },
              },
              center: {
                  component: ActionButtonComponent,
                      props: {
                      icon: "logo",
                          action: () => {
                          showModalPage(runtimeDapp, <Page<any, any>>{
                              position: "modal",
                              component: QuickActions
                          }, {});
                          // forwardNavEvent({position: "center"})
                      }
                  },
              },
              right: {
                  component: LinkComponent,
                      props: {
                      icon: "home",
                          action: () => {
                          push("#/dashboard")
                      },
                  },
              },
          }
      };

      if (!identityChecked) {
          window.o.runProcess(identify, {}, {});
          identityChecked = true;
      }

  });

  function setCloseAsNavCenter() {
      navigation.navPill.center = {
          component: ActionButtonComponent,
          props: {
              icon: "close",
              action: () => hideCenter()
          }
      };
  }

  function showQuickActions() {
      setCloseAsNavCenter();
      showModalPage(runtimeDapp, <Page<any, any>>{
          position: "modal",
          component: QuickActions
      }, {});
  }

  function setQuickActionsForNavCenter() {
      navigation.navPill.center = {
          component: ActionButtonComponent,
          props: {
              icon: "logo",
              action: () => showQuickActions()
          },
      };
  }

  let startProcessing: boolean = true;

  $: {
      if (startProcessing) {
          const paramsJson = JSON.stringify(params);
          if (lastParamsJson !== paramsJson) {
              handleUrlChanged();
              lastParamsJson = paramsJson;
          }
      }
  }

  function findDefaultRoute(runtimeDapp: RuntimeDapp<any>) {
          // If no nextRoutable could be found then look for a default in the dapp
      const defaultRoutable = findRoutableByParams(runtimeDapp, {
          dappId: runtimeDapp.dappId,
          "1": runtimeDapp.defaultRoute.length > 0 ? runtimeDapp.defaultRoute[0] : null,
          "2": runtimeDapp.defaultRoute.length > 1 ? runtimeDapp.defaultRoute[1] : null,
          "3": runtimeDapp.defaultRoute.length > 2 ? runtimeDapp.defaultRoute[2] : null,
          "4": runtimeDapp.defaultRoute.length > 3 ? runtimeDapp.defaultRoute[3] : null,
          "5": runtimeDapp.defaultRoute.length > 4 ? runtimeDapp.defaultRoute[4] : null,
          "6": runtimeDapp.defaultRoute.length > 5 ? runtimeDapp.defaultRoute[5] : null,
      });
      if (defaultRoutable) {
          return <FindRouteResult>{
              routable: defaultRoutable.routable,
              found: true,
              params: defaultRoutable.params
          };
      } else {
          return <FindRouteResult>{
              found: false
          };
      }
  }

  async function handleUrlChanged() {
      dapp = findDappById(params.dappId);
      runtimeDapp = dapp ? await RuntimeDapps.instance().getRuntimeDapp(dapp) : null;
      if (!runtimeDapp)
          throw new Error(`Couldn't find a dapp with the id: ${params.dappId}`);

      const findRouteResult = findRoutableByParams(runtimeDapp, params);
      if (!findRouteResult.found) {
          throw new Error(`Couldn't find a routable for params: \n${JSON.stringify(params, null, 2)}`);
      }

      routable = findRouteResult.routable;

      if (findRouteResult.routable.type === "page") {
          const page:Page<any,any> = <any>findRouteResult.routable;
          if (page.position === "modal") {
              if (!layout.main) {
                  // Check if the modal page was called directly. In this case the default main
                  // page of the corresponding dapp must be loaded as well.
                  const defaultRoute = findDefaultRoute(runtimeDapp);
                  if (defaultRoute.found && defaultRoute.routable.type === "page") {
                      showMainPage(runtimeDapp, <any>defaultRoute.routable, findRouteResult.params);
                  } else {
                      // TODO: 404
                  }
              }

              showModalPage(runtimeDapp, page, findRouteResult.params);
          } else {
              await hideCenter();
              showMainPage(runtimeDapp, page, findRouteResult.params);
          }
      }

      window.o.publishEvent({
          type: "shell.routeChanged",
          runtimeDapp: runtimeDapp,
          routable: findRouteResult.routable
      })

      setNav(runtimeDapp, findRouteResult.routable, findRouteResult.params);
  }

  function showModalProcess(processId: string) {
      modalContent = "process";
      const process = window.o.stateMachines.findById(processId);
      showModalPage(runtimeDapp, <Page<any, any>>{
          component: ProcessContainer
      }, {process});

      setCloseAsNavCenter();
  }


  function setNav(runtimeDapp:RuntimeDapp<any>, currentRoutable:Routable, params:{[x:string]:any}) {
      if (layout.dialogs.center && layout.dialogs.center.isOpen) {
          navigation.leftSlot = null;
          navigation.rightSlot = null;
      } else {
          navigation.leftSlot = {
              component: LinkComponent,
              props: {
                  icon: "list",
                  action: () => {
                      // TODO: Expand collapse nav
                      navigation.leftSlot.props.icon =
                          navigation.leftSlot.props.icon === "list"
                              ? "simplearrowleft"
                              : "list";

                      if (navigation.leftSlot.props.icon === "list") {
                          // TODO: Close nav
                          layout = {
                              ...layout,
                              dialogs: {
                                  ...layout.dialogs,
                                  left: {
                                      isOpen: false,
                                      component: NavigationList,
                                      routable: currentRoutable,
                                      runtimeDapp: runtimeDapp,
                                      params: {
                                          routable: currentRoutable,
                                          runtimeDapp: runtimeDapp
                                      }
                                  }
                              }
                          }
                      } else {
                          layout = {
                              ...layout,
                              dialogs: {
                                  ...layout.dialogs,
                                  left: {
                                      isOpen: true,
                                      component: NavigationList,
                                      routable: currentRoutable,
                                      runtimeDapp: runtimeDapp,
                                      params: {
                                          routable: currentRoutable,
                                          runtimeDapp: runtimeDapp
                                      }
                                  }
                              }
                          }
                      }
                      // forwardNavEvent({position: "left"})
                  }
              }
          };
          console.log("SetNav leftSlot: ", navigation.leftSlot);
          console.log("SetNav leftDialog: ", layout.dialogs.left);
      }

      if (runtimeDapp.navigation) {
          if (runtimeDapp.navigation.leftSlot) {
              navigation.leftSlot = runtimeDapp.navigation.leftSlot;
          }
          if (runtimeDapp.navigation.navPill) {
              if (runtimeDapp.navigation.navPill.left) {
              }
              if (runtimeDapp.navigation.navPill.right) {
              }
              navigation.leftSlot = runtimeDapp.navigation.rightSlot;
          }
          if (runtimeDapp.navigation.rightSlot) {
              navigation.leftSlot = runtimeDapp.navigation.rightSlot;
          }
      }
  }

  function showModalPage(runtimeDapp:RuntimeDapp<any>, routable:Page<any, any>, params:{[x:string]:any}) {
      layout = {
          ...layout,
          dialogs: {
              ...layout.dialogs,
              center: {
                  component: routable.component,
                  params: params,
                  isOpen: true,
                  runtimeDapp: runtimeDapp,
                  routable: routable
              }
          }
      }
  }

  function showMainPage(runtimeDapp:RuntimeDapp<any>, routable:Page<any, any>, params:{[x:string]:any}) {
      layout = {
          ...layout,
          main: {
              component: routable.component,
              params: {
                  ...params,
                  runtimeDapp: runtimeDapp,
                  routable: routable
              },
              isOpen: true,
              runtimeDapp: runtimeDapp,
              routable: routable
          }
      }
  }

  async function hideCenter() {
      modalContent = "none";
      if (layout.dialogs.center
          && layout.dialogs.center.routable
          && layout.dialogs.center.routable.type === "page"
          && nextRoutable.type === "page"
          && (<any>nextRoutable).position === "modal") {
          await pop();
          setQuickActionsForNavCenter();
          return;
      } else {
          layout = {
              ...layout,
              dialogs: {
                  ...layout.dialogs,
                  center: null
              }
          }
          setQuickActionsForNavCenter();
      }
  }

</script>

<Layout layout={layout}
        navigation={navigation}
        on:clickedOutside={() => {
            if (modalContent === "none")
                return;
            hideCenter();
        }}
        sliderPages={[]}/>
