<script lang="ts">
  import {onMount} from "svelte";
  import {Page} from "@o-platform/o-interfaces/dist/routables/page";
  import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";
  import {Trigger} from "@o-platform/o-interfaces/dist/routables/trigger";
  import {Link} from "@o-platform/o-interfaces/dist/routables/link";
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
  import {RuntimeLayout} from "../../dapps/o-onboarding/layouts/layout";
  import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
  import {findRoutableByParams} from "../functions/findRoutableByParams";
  import {DappFrameState} from "./dappFrameState";
  import {RuntimeDapps} from "../../runtimeDapps";
  import {findDappById} from "../functions/findDappById";
  import {NavigationManifest} from "@o-platform/o-interfaces/dist/navigationManifest";
  import LinkComponent from "./NextNav/Components/Link.svelte";
  import ListComponent from "./NextNav/Components/List.svelte";
  import ActionButtonComponent from "./NextNav/Components/ActionButton.svelte";
  import {find} from "rxjs/operators";

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
  let dapp: DappManifest<any>;
  let state = new DappFrameState();

  let layout: RuntimeLayout = <RuntimeLayout>{
      main: undefined,
      dialogs:{
          left: undefined,
          center: undefined,
          right: undefined
      }
  };

  let navigation: NavigationManifest = {
      leftSlot: {
          component: LinkComponent,
          props: {
              icon: "list",
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
                  }
              },
          },
          right: {
              component: LinkComponent,
              props: {
                  icon: "home",
                  action: () => {
                  },
              },
          },
      }
  };

  $: {
      const paramsJson = JSON.stringify(params);
      if (lastParamsJson !== paramsJson) {
          onParamsChanged();
      }
  }

  async function handleShellEvent(event: PlatformEvent) {
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
              state.hideProcess();
              break;
      }
  }

  onMount(async () => {
      state.layout.subscribe(event => layout = event);
      state.navigation.subscribe(event => navigation = event);

      window.o.events.subscribe(handleShellEvent);

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
          state.showProcess(processStarted.processId);
      };

      if (!identityChecked) {
          window.o.runProcess(identify, {}, {});
          identityChecked = true;
      }
  });

  async function onParamsChanged() {
      const dapp = findDappById(params.dappId);
      if (!dapp) {
          throw new Error(`Not found`);
      }

      const runtimeDapp = await RuntimeDapps.instance().getRuntimeDapp(dapp);
      const findRouteResult = findRoutableByParams(dapp, params);

      if (!findRouteResult.found && dapp.defaultRoute) {
          // If no routable could be found then look for a default in the dapp
          const defaultRoutable = findRoutableByParams(dapp, {
              dappId: dapp.dappId,
              "1": dapp.defaultRoute.length > 0 ? dapp.defaultRoute[0] : null,
              "2": dapp.defaultRoute.length > 1 ? dapp.defaultRoute[1] : null,
              "3": dapp.defaultRoute.length > 2 ? dapp.defaultRoute[2] : null,
              "4": dapp.defaultRoute.length > 3 ? dapp.defaultRoute[3] : null,
              "5": dapp.defaultRoute.length > 4 ? dapp.defaultRoute[4] : null,
              "6": dapp.defaultRoute.length > 5 ? dapp.defaultRoute[5] : null,
          });
          findRouteResult.routable = defaultRoutable.routable;
          findRouteResult.found = true;
          findRouteResult.pageParams = defaultRoutable.pageParams;
      }

      if (!findRouteResult.found) {
          throw new Error(`Not found`);
      }

      switch (findRouteResult.routable.type) {
          case "page":
              const page = <Page<any, any>>findRouteResult.routable;
              state.showPage(runtimeDapp, page, findRouteResult.pageParams)
              break;
          case "trigger":
              const _entryTrigger = <Trigger<any, any>>findRouteResult.routable;
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
              break;
          case "link":
              const link = <Link<any, any>>findRouteResult.routable;
              link.url(params, dapp);
              window.history.back();
              return;
      }
  }

</script>

<Layout layout={layout} navigation={navigation} sliderPages={[]} />
