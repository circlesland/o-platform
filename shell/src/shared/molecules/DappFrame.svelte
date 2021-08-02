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
  import {RuntimeLayout} from "../../dapps/o-onboarding/layouts/layout";
  import {NavigationManifest} from "@o-platform/o-interfaces/dist/navigationManifest";
  import LinkComponent from "./NextNav/Components/Link.svelte";
  import ListComponent from "./NextNav/Components/List.svelte";
  import ActionButtonComponent from "./NextNav/Components/ActionButton.svelte";
  import {interpret, Interpreter} from "xstate";
  import {dappFrame} from "../../dapps/o-onboarding/components/dappFrame";
  import {SHOW_PROCESS} from "../../dapps/o-onboarding/components/dialog";

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

  let layout: RuntimeLayout = <RuntimeLayout>{
      main: undefined,
      dialogs:{
          left: undefined,
          center: undefined,
          right: undefined
      },
      a: null
  };

  let navigation: NavigationManifest = {
      leftSlot: {
          component: LinkComponent,
          props: {
              icon: "list",
              action: () => {
                  clickedOutside({position: "left"})
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
                      clickedOutside({position: "center"})
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
              case "shell.navigation.left.click":
                  console.log("shell.navigation.left.click")
                  dappFrameState.send({type: "NAVIGATION_CLICK", position: "left"});
                  break;
              case "shell.navigation.center.click":
                  console.log("shell.navigation.center.click")
                  dappFrameState.send({type: "NAVIGATION_CLICK", position: "center"});
                  break;
              case "shell.navigation.right.click":
                  console.log("shell.navigation.right.click")
                  dappFrameState.send({type: "NAVIGATION_CLICK", position: "right"});
                  break;
              case "process.stopped":
                  dappFrameState.send({type: "PROCESS_STOPPED"});
                  break;
          }
      });
      dappFrameState = interpret(dappFrame)
          .onEvent(event => {
              // console.log("dappFrameState event:", event);
              if (event.type === "LAYOUT_CHANGED") {
                  console.log("LAYOUT CHANGED:", event)
                  layout = (<any>event).layout;
              }
              if (event.type === "NAVIGATION_CHANGED") {
                  navigation = (<any>event).navigation;
              }
          })
          .onTransition(state => {
              // console.log("dappFrameState state:", state.value)
          })
          .start();

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
          dappFrameState.send(<SHOW_PROCESS>{
              type: "SHOW_PROCESS",
              processId: processStarted.processId
          });
      };

      if (!identityChecked) {
          window.o.runProcess(identify, {}, {});
          identityChecked = true;
      }
  });

  $: {
      const paramsJson = JSON.stringify(params);
      if (dappFrameState && lastParamsJson !== paramsJson) {
          dappFrameState.send(<SHOW_PROCESS>{
              type: "URL_CHANGED",
              ...params
          });
      }
  }

  function clickedOutside(e:any) {
      switch (e.detail.position) {
          case "left":
              dappFrameState.send({type: "NAVIGATION_CLICK", position: "left"});
              break;
          case "center":
              dappFrameState.send({type: "NAVIGATION_CLICK", position: "center"});
              break;
          case "right":
              dappFrameState.send({type: "NAVIGATION_CLICK", position: "right"});
              break;
      }
  }

</script>

<Layout layout={layout}
        navigation={navigation}
        sliderPages={[]}/>
