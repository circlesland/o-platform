<script lang="ts">
  import { onMount } from "svelte";
  import { ProcessStarted } from "@o-platform/o-process/dist/events/processStarted";
  import { Generate } from "@o-platform/o-utils/dist/generate";
  import { shellProcess } from "../processes/shellProcess";
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
  import { identify } from "../../dapps/o-passport/processes/identify/identify2";

  // Import Swiper styles
  import "swiper/swiper-bundle.css";

  import "swiper/components/navigation/navigation.min.css";
  import "swiper/components/pagination/pagination.min.css";

  // import Swiper core and required modules
  import SwiperCore, { Pagination, Navigation } from "swiper/core";
  import Layout from "../../shared/layouts/Layout.svelte";
  import ProcessContainer from "../../shared/molecules/ProcessContainer.svelte";
  import { RuntimeLayout } from "../layouts/layout";
  import QuickActions from "../../shared/molecules/QuickActions.svelte";
  import { NavigationManifest } from "@o-platform/o-interfaces/dist/navigationManifest";
  import { Page } from "@o-platform/o-interfaces/dist/routables/page";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { findDappById } from "../functions/findDappById";
  import { RuntimeDapps } from "../../runtimeDapps";
  import {
    findRoutableByParams,
    FindRouteResult,
  } from "../functions/findRoutableByParams";
  import { pop, push } from "svelte-spa-router";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
  import {
    generateNavManifest,
    GenerateNavManifestArgs,
  } from "../functions/generateNavManifest";
  import { inbox } from "../stores/inbox";

  import NavigationList from "../../shared/molecules/NavigationList.svelte";
  import { Process } from "@o-platform/o-process/dist/interfaces/process";
  import { isMobile } from "../functions/isMobile";

  import {
    fromCirclesLand,
    FromCirclesLandContextData,
  } from "../../dapps/o-onboarding/processes/fromCirclesLand";
  import {me} from "../stores/me";
  import {getSessionInfo} from "../../dapps/o-passport/processes/identify/services/getSessionInfo";
  import {EventsDocument} from "../api/data/types";
  import {ShellEvent} from "@o-platform/o-process/dist/events/shellEvent";

  // install Swiper modules
  SwiperCore.use([Navigation, Pagination]);

  /*
    left icons:
    open: "simplearrowleft"
    closed: "list";
     */

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
  let dappFrameState: any;
  let nextRoutable: Routable | undefined;

  let dapp: DappManifest<any>;
  let runtimeDapp: RuntimeDapp<any>;
  let routable: Routable;
  let modalContent: "process" | "page" | "quickActions" | "none" = "none";

  let layout: RuntimeLayout = <RuntimeLayout>{
    main: undefined,
    dialogs: {
      left: undefined,
      center: undefined,
      right: undefined,
    },
  };
  let navigation: NavigationManifest;
  let currentNavArgs: GenerateNavManifestArgs;
  let preModalNavArgs: GenerateNavManifestArgs;
  let runningProcess: ProcessStarted;

  function setNav(navArgs: GenerateNavManifestArgs) {
    if (navArgs.centerIsOpen && !preModalNavArgs) {
      preModalNavArgs = currentNavArgs;
    }
    navigation = generateNavManifest(navArgs, null);
    console.log("New nav:", navigation);
    currentNavArgs = navArgs;
  }

  /**
   * This function is called only one time after the first route.
   */
  async function init() {
    // setNav({
    //   ...currentNavArgs,
    //   showLogin: dapp.dappId == "homepage:1",
    // });
    const session = await getSessionInfo();
    if (!$me || !session.isLoggedOn) {
      await push("/");
      return;
    } else {
      window.o.apiClient.client.subscribeToResult()
        .then(apiClient => {
          console.log("SUBSCRIBING TO WS EVENTS ..");
          apiClient.subscribe({
            query: EventsDocument
          }).subscribe(next => {
            if (next.data.events.type == "new_message") {
              window.o.publishEvent(<any>{
                type: "shell.refresh",
                dapp: "chat:1",
                data: null,
              });
              console.log("RECEIVED WS MESSAGE EVENT:", next);
            } else {
              console.log("RECEIVED WS BLOCKCHAIN EVENT:", next);
            }
            inbox.reload();
          });
        });
    }
  }

  function onOpenNavigation() {
    layout = {
      ...layout,
      dialogs: {
        ...layout.dialogs,
        left: {
          isOpen: true,
          component: NavigationList,
          routable: routable,
          runtimeDapp: runtimeDapp,
          params: {
            routable: routable,
            runtimeDapp: runtimeDapp,
          },
        },
      },
    };
    setNav({
      leftIsOpen: true,
      rightIsOpen: false,
      notificationCount: $inbox.length,
      centerIsOpen: false,
      centerContainsProcess: false,
    });
  }

  function onCloseNavigation() {
    layout.dialogs.left = {
      ...layout.dialogs.left,
      isOpen: false,
    };
    setNav({
      leftIsOpen: false,
      rightIsOpen: false,
      notificationCount: $inbox.length,
      centerIsOpen: false,
      centerContainsProcess: false,
    });
  }

  function onOpenContacts() {
    push("#/chat");
  }

  function onOpenModal() {
    showModalPage(
      runtimeDapp,
      <Page<any, any>>{
        position: "modal",
        component: QuickActions,
      },
      {}
    );
    setNav({
      leftIsOpen: false,
      rightIsOpen: false,
      notificationCount: $inbox.length,
      centerIsOpen: true,
      centerContainsProcess: false,
    });
  }

  function onHome() {
    push("#/dashboard");
  }

  async function onCloseModal() {
    await hideCenter();

    setNav({
      ...preModalNavArgs,
      notificationCount: $inbox.length,
    });
  }

  function onRequestCloseModal() {
    if (!runningProcess) {
      onCloseModal();
      return;
    }
    const process: Process = window.o.stateMachines.findById(
      runningProcess.processId
    );
    if (!process) {
      onCloseModal();
    }
    onProcessContinued();
    process.sendEvent({ type: "process.cancelRequest" });
  }

  function onProcessCancelRequest() {
    if (!runningProcess) {
      return;
    }
    const process: Process = window.o.stateMachines.findById(
      runningProcess.processId
    );
    if (!process) {
      return;
    }
    onProcessContinued();
    process.sendEvent({ type: "process.cancelRequest" });
  }

  async function onRunProcess(event: any) {
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

  async function onProcessStopped() {
    await onCloseModal();
    if (preModalNavArgs) {
      setNav({
        ...preModalNavArgs,
        notificationCount: $inbox.length,
      });
      preModalNavArgs = null;
    } else {
      setNav({
        notificationCount: $inbox.length,
        centerIsOpen: false,
        centerContainsProcess: false,
        leftIsOpen: false,
        rightIsOpen: false,
      });
    }
  }

  function onProcessContinued() {
    setNav({
      notificationCount: $inbox.length,
      centerIsOpen: true,
      centerContainsProcess: true,
      leftIsOpen: false,
      rightIsOpen: false,
    });
  }

  function onProcessCanGoBack() {
    setNav({
      notificationCount: $inbox.length,
      centerIsOpen: true,
      centerContainsProcess: true,
      leftIsOpen: false,
      rightIsOpen: false,
      canSkip: currentNavArgs.canSkip,
      canGoBack: true,
    });
  }

  function onProcessCanSkip() {
    setNav({
      notificationCount: $inbox.length,
      centerIsOpen: true,
      centerContainsProcess: true,
      leftIsOpen: false,
      rightIsOpen: false,
      canGoBack: currentNavArgs.canGoBack,
      canSkip: true,
    });
  }

  function onProcessBack() {
    if (!runningProcess) {
      return;
    }
    const process: Process = window.o.stateMachines.findById(
      runningProcess.processId
    );
    if (!process) {
      return;
    }
    onProcessContinued();
    process.sendAnswer({ type: "process.back" });
  }

  function onProcessSkip() {
    if (!runningProcess) {
      return;
    }
    const process: Process = window.o.stateMachines.findById(
      runningProcess.processId
    );
    if (!process) {
      return;
    }
    onProcessContinued();
    process.sendAnswer({ type: "process.skip" });
  }

  function onInputFocused() {
    if (isMobile()) {
      document.body.classList.add("keyboard-open");
    }
    return;
  }
  function onInputBlurred() {
    if (isMobile()) {
      document.body.classList.remove("keyboard-open");
    }
    return;
  }

  onMount(async () => {
    window.o.events.subscribe(async event => {
      switch (event.type) {
        case "process.continued":
          onProcessContinued();
          break;
        case "process.canGoBack":
          onProcessCanGoBack();
          break;
        case "process.back":
          onProcessBack();
          break;
        case "process.canSkip":
          onProcessCanSkip();
          break;
        case "process.skip":
          onProcessSkip();
          break;
        case "shell.openNavigation":
          onOpenNavigation();
          console.log(event);
          break;
        case "shell.closeNavigation":
          onCloseNavigation();
          console.log(event);
          break;
        case "shell.contacts":
          onOpenContacts();
          console.log(event);
          break;
        case "shell.openModal":
          onOpenModal();
          console.log(event);
          break;
        case "shell.home":
          onHome();
          console.log(event);
          break;
        case "shell.inputFocused":
          onInputFocused();
          break;
        case "shell.inputBlurred":
          onInputBlurred();
          break;
        case "process.cancelRequest":
          onProcessCancelRequest();
          console.log(event);
          break;
        case "shell.requestCloseModal":
          await onRequestCloseModal();
          console.log(event);
          break;
        case "shell.closeModal":
          await onCloseModal();
          console.log(event);
          break;
        case "shell.runProcess":
          await onRunProcess(event);
          console.log(event);
          break;
        case "shell.processStarted":
          console.log("Process started:", event);
          runningProcess = event;
          break;
        case "process.stopped":
          await onProcessStopped();
          console.log(event);
          runningProcess = null;
          break;
      }
    });

    // Set the global "runProcess" function. This needs to be done here
    // because at any point before the dialog wouldn't be ready.
    window.o.runProcess = async function runProcess(
      processDefinition: ProcessDefinition<any, any>,
      contextData: { [x: string]: any },
      dirtyFlags: { [x: string]: boolean } | undefined
    ) {
      const modifier = async ctx => {
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
      showModalProcess(processStarted.processId);
    };

    setNav({
      centerContainsProcess: false,
      centerIsOpen: false,
      rightIsOpen: false,
      leftIsOpen: false,
      notificationCount: $inbox.length,
      showLogin: dapp.dappId == "homepage:1" ? true : false,
    });

    if (!identityChecked && !dapp.noAuthentication) {
      //window.o.runProcess(identify, {}, {});
      identityChecked = true;
    }
  });

  function showQuickActions() {
    // setCloseAsNavCenter();
    showModalPage(
      runtimeDapp,
      <Page<any, any>>{
        position: "modal",
        component: QuickActions,
      },
      {}
    );
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
      "1":
        runtimeDapp.defaultRoute.length > 0
          ? runtimeDapp.defaultRoute[0]
          : null,
      "2":
        runtimeDapp.defaultRoute.length > 1
          ? runtimeDapp.defaultRoute[1]
          : null,
      "3":
        runtimeDapp.defaultRoute.length > 2
          ? runtimeDapp.defaultRoute[2]
          : null,
      "4":
        runtimeDapp.defaultRoute.length > 3
          ? runtimeDapp.defaultRoute[3]
          : null,
      "5":
        runtimeDapp.defaultRoute.length > 4
          ? runtimeDapp.defaultRoute[4]
          : null,
      "6":
        runtimeDapp.defaultRoute.length > 5
          ? runtimeDapp.defaultRoute[5]
          : null,
    });
    if (defaultRoutable) {
      return <FindRouteResult>{
        routable: defaultRoutable.routable,
        found: true,
        params: {
          ...defaultRoutable.params,
        },
      };
    } else {
      return <FindRouteResult>{
        found: false,
      };
    }
  }

  let firstUrlChangedCall = true;

  async function handleUrlChanged() {

    const navArgs = <GenerateNavManifestArgs>{};

    dapp = findDappById(params.dappId);
    runtimeDapp = dapp
      ? await RuntimeDapps.instance().getRuntimeDapp(dapp)
      : null;

    if (!runtimeDapp)
      throw new Error(`Couldn't find a dapp with the id: ${params.dappId}`);

    const findRouteResult = findRoutableByParams(runtimeDapp, params);
    if (!findRouteResult.found) {
      throw new Error(
        `Couldn't find a routable for params: \n${JSON.stringify(
          params,
          null,
          2
        )}`
      );
    }

    routable = findRouteResult.routable;

    if (findRouteResult.routable.type === "page") {
      const page: Page<any, any> = <any>findRouteResult.routable;
      if (page.position === "modal") {
        if (!layout.main) {
          // Check if the modal page was called directly. In this case the default main
          // page of the corresponding dapp must be loaded as well.
          const defaultRoute = findDefaultRoute(runtimeDapp);
          if (defaultRoute.found && defaultRoute.routable.type === "page") {
            showMainPage(
              runtimeDapp,
              <any>defaultRoute.routable,
              findRouteResult.params
            );
          } else {
            // TODO: 404
          }
        }
        showModalPage(runtimeDapp, page, findRouteResult.params);
        navArgs.centerIsOpen = true;
      } else {
        await hideCenter();
        navArgs.centerIsOpen = false;
        showMainPage(runtimeDapp, page, findRouteResult.params);
      }
    }

    window.o.publishEvent({
      type: "shell.routeChanged",
      runtimeDapp: runtimeDapp,
      routable: findRouteResult.routable,
    });

    if (!navigation) {
      navigation = generateNavManifest(navArgs, null);
    }

    if (firstUrlChangedCall) {
      firstUrlChangedCall = false;
      init();
    }

    // If the user is not logged-on return to the homepage
    const session = await getSessionInfo();
    if (!$me || !session.isLoggedOn) {
      await push("/");
      return;
    }
  }

  function showModalProcess(processId: string) {
    modalContent = "process";
    const process = window.o.stateMachines.findById(processId);
    showModalPage(
      runtimeDapp,
      <Page<any, any>>{
        component: ProcessContainer,
      },
      { process }
    );

    setNav({
      centerIsOpen: true,
      centerContainsProcess: true,
      leftIsOpen: false,
      notificationCount: $inbox.length,
      rightIsOpen: false,
    });
  }

  let lastModalPage: {
    runtimeDapp: RuntimeDapp<any>;
    routable: Page<any, any>;
    params: { [x: string]: any };
  };

  function showModalPage(
    runtimeDapp: RuntimeDapp<any>,
    routable: Page<any, any>,
    params: { [x: string]: any }
  ) {
    modalContent = "page";
    if (routable.type == "page" && routable.component !== ProcessContainer) {
      lastModalPage = {
        runtimeDapp,
        routable,
        params,
      };
    }

    layout = {
      ...layout,
      dialogs: {
        ...layout.dialogs,
        center: {
          component: routable.component,
          params: {
            ...params,
            jumplist: runtimeDapp.jumplist,
            runtimeDapp: runtimeDapp,
          },
          isOpen: true,
          runtimeDapp: runtimeDapp,
          routable: routable,
        },
      },
    };

    setNav({
      centerIsOpen: true,
      centerContainsProcess: false,
      leftIsOpen: false,
      notificationCount: $inbox.length,
      rightIsOpen: false,
      showLogin: dapp.dappId == "homepage:1",
    });
  }

  function showMainPage(
    runtimeDapp: RuntimeDapp<any>,
    routable: Page<any, any>,
    params: { [x: string]: any }
  ) {
    layout = {
      ...layout,
      main: {
        component: routable.component,
        params: {
          ...params,
          runtimeDapp: runtimeDapp,
          routable: routable,
        },
        isOpen: true,
        runtimeDapp: runtimeDapp,
        routable: routable,
      },
    };

    setNav({
      ...currentNavArgs,
      showLogin: dapp.dappId == "homepage:1",
    });
  }

  async function hideCenter() {
    modalContent = "none";
    if (
      layout.dialogs.center &&
      layout.dialogs.center.routable &&
      layout.dialogs.center.routable.type === "page" &&
      routable.type === "page" &&
      (<any>routable).position === "modal"
    ) {
      await pop();
      lastModalPage = null;
      return;
    } else if (lastModalPage) {
      showModalPage(
        lastModalPage.runtimeDapp,
        lastModalPage.routable,
        lastModalPage.params
      );
      lastModalPage = null;
    } else {
      layout = {
        ...layout,
        dialogs: {
          ...layout.dialogs,
          center: null,
        },
      };
    }
  }
</script>

<Layout
  {layout}
  {navigation}
  on:clickedOutside="{() => {}}"
  sliderPages="{[]}" />

