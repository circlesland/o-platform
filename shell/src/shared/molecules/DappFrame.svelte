<script lang="ts">
import { onMount } from "svelte";
import { ProcessStarted } from "@o-platform/o-process/dist/events/processStarted";
import { Generate } from "@o-platform/o-utils/dist/generate";
import { shellProcess } from "../processes/shellProcess";
import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
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
import { media } from "../stores/media";
import { me } from "../stores/me";
import { getSessionInfo } from "../../dapps/o-passport/processes/identify/services/getSessionInfo";
import { EventsDocument } from "../api/data/types";
import {log} from "../logUiEvent";

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

/**
 * A stack of opened modal pages.
 */
const stack:{
  dappId: string,
  params: { [x: string]: any }
}[] = [];

async function onBack() {
  log("onBack() - current stack: ", stack);
  if (stack.length < 2) {
    await onRoot();
    return;
  }
  stack.pop();
  const previous = stack[stack.length - 1];
  log("onBack() - new stack: ", stack);

  const previousContext: {
    runtimeDapp: RuntimeDapp<any>,
    routable: Page<any, any>,
    params: {[x:string]:any}
  } = {};

  const previousDapp = findDappById(previous.dappId);
  previousContext.runtimeDapp = previousDapp
    ? await RuntimeDapps.instance().getRuntimeDapp(previousDapp)
    : null;

  const routable = findRoutableByParams(previousContext.runtimeDapp, previous.params)
  if (!routable.found) {
    throw new Error(`The page from the back stack couldn't be found: ${JSON.stringify(previous)}`);
  }
  if (routable.routable.type != "page") {
    throw new Error(`The page from the back stack is not a page: ${JSON.stringify(previous)}`)
  }
  previousContext.routable = <Page<any, any>>routable;
  previousContext.params = previous.params;

  console.log("onBack() - TODO: set the following context: ", previousContext);
  const path = Object.keys(previous.params)
    .filter(o => parseInt(o) != Number.NaN && o >= 0 && o <= 6)
    .map(o => previous.params[o])
    .filter(o => !!o && o != "")
    .reduce((p,c) => p + "/" + c, "");

  stack.pop();
  await push(`#/${previous.params.dappId}${path}`);
}

async function onStay() {
  log("onStay() - current stack: ", stack);
  if (stack.length < 1) {
    await onRoot();
    return;
  }
  const previous = stack.pop();
  log("onStay() - new stack: ", stack);

  const previousContext: {
    runtimeDapp: RuntimeDapp<any>,
    routable: Page<any, any>,
    params: {[x:string]:any}
  } = {};

  const previousDapp = findDappById(previous.dappId);
  previousContext.runtimeDapp = previousDapp
    ? await RuntimeDapps.instance().getRuntimeDapp(previousDapp)
    : null;

  const routable = findRoutableByParams(previousContext.runtimeDapp, previous.params)
  if (!routable.found) {
    throw new Error(`The page from the back stack couldn't be found: ${JSON.stringify(previous)}`);
  }
  if (routable.routable.type != "page") {
    throw new Error(`The page from the back stack is not a page: ${JSON.stringify(previous)}`)
  }
  previousContext.routable = <Page<any, any>>routable;
  previousContext.params = previous.params;

  console.log("onStay() - TODO: set the following context: ", previousContext);
  const path = Object.keys(previous.params)
    .filter(o => parseInt(o) != Number.NaN && o >= 0 && o <= 6)
    .map(o => previous.params[o])
    .filter(o => !!o && o != "")
    .reduce((p,c) => p + "/" + c, "");

  await push(`#/${previous.params.dappId}${path}`);
  await handleUrlChanged();
}

async function onRoot() {
  log("onRoot() - current stack: ", stack);
  if (stack.length == 0) {
    await onCloseModal();
    return;
  }
  const root = stack[0];
  log("onRoot() - new stack: ", stack);

  const previousContext: {
    runtimeDapp: RuntimeDapp<any>,
    routable: Page<any, any>,
    params: {[x:string]:any}
  } = {};

  const previousDapp = findDappById(root.dappId);
  previousContext.runtimeDapp = previousDapp
    ? await RuntimeDapps.instance().getRuntimeDapp(previousDapp)
    : null;

  const routable = findDefaultRoute(previousContext.runtimeDapp);
  if (!routable.found) {
    throw new Error(`The page from the back stack couldn't be found: ${JSON.stringify(root)}`);
  }
  if (routable.routable.type != "page") {
    throw new Error(`The page from the back stack is not a page: ${JSON.stringify(root)}`)
  }

  while (stack.length > 0) stack.pop();

  const path = routable.routable.routeParts.map(o => o.replace("=", "")).join("/");
  onCloseModal();
  const dapp = previousDapp.dappId.substr(0, previousDapp.dappId.indexOf(":"));
  await push(`#/${dapp}/${path}`)
}

function setNav(navArgs: GenerateNavManifestArgs) {
  log(`setNav(navArgs: GenerateNavManifestArgs)`, navArgs);

  if (navArgs.centerIsOpen && !preModalNavArgs) {
    preModalNavArgs = currentNavArgs;
  }
  let args = { ...navArgs, showLogin: dapp.dappId == "homepage:1" && !layout.dialogs.center };
  navigation = generateNavManifest(args, null);
  currentNavArgs = args;
}

/**
 * This function is called only one time after the first route.
 */
async function init() {
  log(`init()`);
  const session = await getSessionInfo();

  if (session.isLoggedOn && session.hasProfile) {
    window.o.apiClient.client.subscribeToResult().then((apiClient) => {
      apiClient
        .subscribe({
          query: EventsDocument,
        })
        .subscribe((next) => {
          if (next.data.events.type == "new_message") {
            window.o.publishEvent(<any>{
              type: "shell.refresh",
              dapp: "friends:1",
              data: null,
            });
            window.o.publishEvent(<any>{
              type: "new_message",
            });
            var audio = new Audio("blblblbl.mp3");
            audio.play();
          } else {
            window.o.publishEvent(<any>{
              type: "blockchain_event",
            });
            window.o.publishEvent(<any>{
              type: "shell.refresh",
              dapp: "friends:1",
              data: null,
            });
            window.o.publishEvent(<any>{
              type: "shell.refresh",
              dapp: "banking:1",
              data: null,
            });
          }
          inbox.reload();
        });
    });
  }
  if (!$me || !session.isLoggedOn) {
    await push("/");
    return;
  } else {

    inbox.reload();
  }
}

function onOpenNavigation() {
  log("onOpenNavigation()");
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
    notificationCount: $inbox ? $inbox.length : 0,
    centerIsOpen: false,
    centerContainsProcess: false,
  });
}
function onCloseNavigation() {
  log("onCloseNavigation()");
  layout.dialogs.left = {
    ...layout.dialogs.left,
    isOpen: false,
  };
  setNav({
    leftIsOpen: false,
    rightIsOpen: false,
    notificationCount: $inbox ? $inbox.length : 0,
    centerIsOpen: false,
    centerContainsProcess: false,
  });
}
function onOpenContacts() {
  push("#/friends/chat");
}
function onOpenModal() {
  log("onOpenModal()");
  showModalPage(
    false,
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
    notificationCount: $inbox ? $inbox.length : 0,
    centerIsOpen: true,
    centerContainsProcess: false,
  });
}
function onHome() {
  push("#/dashboard");
}
async function onCloseModal() {
  log("onCloseModal()");

  await hideCenter();

  setNav({
    ...preModalNavArgs,
    notificationCount: $inbox ? $inbox.length : 0,
  });
}
function onRequestCloseModal() {
  log("onRequestCloseModal()");
  if (!runningProcess) {
    //onCloseModal();
    onBack();
    return;
  }
  const process: Process = window.o.stateMachines.findById(
    runningProcess.processId
  );
  if (!process) {
    //onCloseModal();
    onBack();
  }
  onProcessContinued();
  process.sendEvent({ type: "process.cancelRequest" });
}
function onProcessCancelRequest() {
  log("onProcessCancelRequest()");
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
  log("onRunProcess(event: any)", event);
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
  log("onProcessStopped()");
  // TODO: How to handle onProcessStopped() vs. onRoot()? Exit to the root page when a process stopped or go back to the last card?
  //       Below is the "to last card" solution
  await onStay();

  // TODO: The following is the "to root" solution
  /*
  await onCloseModal();
  if (preModalNavArgs) {
    setNav({
      ...preModalNavArgs,
      notificationCount: $inbox ? $inbox.length : 0,
    });
    preModalNavArgs = null;
  } else {
    setNav({
      notificationCount: $inbox ? $inbox.length : 0,
      centerIsOpen: false,
      centerContainsProcess: false,
      leftIsOpen: false,
      rightIsOpen: false,
    });
  }
  */
}

function onProcessContinued() {
  log("onProcessContinued()");
  setNav({
    notificationCount: $inbox ? $inbox.length : 0,
    centerIsOpen: true,
    centerContainsProcess: true,
    leftIsOpen: false,
    rightIsOpen: false,
  });
}
function onProcessCanGoBack() {
  log("onProcessCanGoBack()");
  setNav({
    notificationCount: $inbox ? $inbox.length : 0,
    centerIsOpen: true,
    centerContainsProcess: true,
    leftIsOpen: false,
    rightIsOpen: false,
    canSkip: currentNavArgs.canSkip,
    canGoBack: true,
  });
}
function onProcessCanSkip() {
  log("onProcessCanSkip()");
  setNav({
    notificationCount: $inbox ? $inbox.length : 0,
    centerIsOpen: true,
    centerContainsProcess: true,
    leftIsOpen: false,
    rightIsOpen: false,
    canGoBack: currentNavArgs.canGoBack,
    canSkip: true,
  });
}
function onProcessBack() {
  log("onProcessBack()");
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
  log("onProcessSkip()");
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
  log("onInputFocused()");
  if (isMobile()) {
    document.body.classList.add("keyboard-open");
  }
  return;
}
function onInputBlurred() {
  log("onInputBlurred()");
  if (isMobile()) {
    document.body.classList.remove("keyboard-open");
  }
  return;
}
onMount(async () => {
  log("onMount()");

  await window.o.events.subscribe(<any>(async (event) => {
    log("DappFrame event: ", event);
    switch (event.type) {
      case "shell.back":
        onBack();
        break;
      case "shell.root":
        onRoot();
        break;
      case "shell.forward":
        break;
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
        break;
      case "shell.closeNavigation":
        onCloseNavigation();
        break;
      case "shell.contacts":
        onOpenContacts();
        break;
      case "shell.openModal":
        onOpenModal();
        break;
      case "shell.openModalProcess":
        showModalProcess("");
        break;
      case "shell.home":
        onHome();
        break;
      case "shell.inputFocused":
        onInputFocused();
        break;
      case "shell.inputBlurred":
        onInputBlurred();
        break;
      case "process.cancelRequest":
        onProcessCancelRequest();
        break;
      case "shell.requestCloseModal":
        await onRequestCloseModal();
        break;
      case "shell.closeModal":
        await onCloseModal();
        break;
      case "shell.runProcess":
        await onRunProcess(event);
        break;
      case "shell.processStarted":
        runningProcess = event;
        break;
      case "process.stopped":
        await onProcessStopped();
        runningProcess = null;
        break;
    }
  }));

  // Set the global "runProcess" function. This needs to be done here
  // because at any point before the dialog wouldn't be ready.
  window.o.runProcess = async function runProcess(
    processDefinition: ProcessDefinition<any, any>,
    contextData: { [x: string]: any },
    dirtyFlags: { [x: string]: boolean } | undefined,
    onlyThesePages?: string[]
  ) {
    log(`window.o.runProcess(processDefinition: ${processDefinition.name}) `, contextData);
    const modifier = async (ctx) => {
      ctx.childProcessDefinition = processDefinition;
      ctx.childContext = {
        data: contextData,
        dirtyFlags: !dirtyFlags ? {} : dirtyFlags,
        initialDirtyFlags: !dirtyFlags ? {} : dirtyFlags,
        onlyThesePages: !onlyThesePages ? [] : onlyThesePages,
      };
      return ctx;
    };
    const requestEvent: any = new RunProcess(shellProcess, true, modifier);
    requestEvent.id = Generate.randomHexString(8);
    const processStarted: ProcessStarted =
      await window.o.requestEvent<ProcessStarted>(requestEvent);
    showModalProcess(processStarted.processId);
  };
  setNav({
    centerContainsProcess: false,
    centerIsOpen: false,
    rightIsOpen: false,
    leftIsOpen: false,
    notificationCount: $inbox ? $inbox.length : 0,
  });
  if (!identityChecked && !dapp.noAuthentication) {
    //window.o.runProcess(identify, {}, {});
    identityChecked = true;
  }
});
function showQuickActions() {
  log(`showQuickActions()`);
  // setCloseAsNavCenter();
  showModalPage(
    false,
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
  // Open / Close Navigation on screen-size basis.
  // OKay, this breaks a lot of things. sorry about that.
  // if ($media.small) {
  //   console.log("DUDE");
  //   setNav({
  //     ...currentNavArgs,
  //     leftIsOpen: false,
  //   });
  // }
  // if ($media.large) {
  //   window.o.publishEvent({
  //     type: "shell.openNavigation",
  //   });
  // }
}
function findDefaultRoute(runtimeDapp: RuntimeDapp<any>) {
  log(`findDefaultRoute(runtimeDapp: ${runtimeDapp.dappId})`);
  // If no nextRoutable could be found then look for a default in the dapp
  const defaultRoutable = findRoutableByParams(runtimeDapp, {
    dappId: runtimeDapp.dappId,
    "1":
      runtimeDapp.defaultRoute.length > 0 ? runtimeDapp.defaultRoute[0] : null,
    "2":
      runtimeDapp.defaultRoute.length > 1 ? runtimeDapp.defaultRoute[1] : null,
    "3":
      runtimeDapp.defaultRoute.length > 2 ? runtimeDapp.defaultRoute[2] : null,
    "4":
      runtimeDapp.defaultRoute.length > 3 ? runtimeDapp.defaultRoute[3] : null,
    "5":
      runtimeDapp.defaultRoute.length > 4 ? runtimeDapp.defaultRoute[4] : null,
    "6":
      runtimeDapp.defaultRoute.length > 5 ? runtimeDapp.defaultRoute[5] : null,
  });
  if (defaultRoutable) {
    const result = <FindRouteResult>{
      routable: defaultRoutable.routable,
      found: true,
      params: {
        ...defaultRoutable.params,
      },
    };
    log(`findDefaultRoute(runtimeDapp: ${runtimeDapp.dappId}) - found: `, result);
    return result;
  } else {
    return <FindRouteResult>{
      found: false,
    };
  }
}
let currentParams:{
  dappId: string;
  "1": string | null;
  "2": string | null;
  "3": string | null;
  "4": string | null;
  "5": string | null;
  "6": string | null;
} = null;

let firstUrlChangedCall = true;
async function handleUrlChanged() {
  log(`handleUrlChanged()`);
  const navArgs = <GenerateNavManifestArgs>{};
  dapp = findDappById(params.dappId);
  runtimeDapp = dapp
    ? await RuntimeDapps.instance().getRuntimeDapp(dapp)
    : null;

  if (!runtimeDapp) {
    // throw new Error(`Couldn't find a dapp with the id: ${params.dappId}`);
    log(`handleUrlChanged() - Couldn't find a dapp with the id: ${params.dappId} - going to /`);
    await push("/");
    return;
  }

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
  log(`handleUrlChanged() - Found routable: ${routable.title} (type: ${routable.type})`);

  currentParams = JSON.parse(JSON.stringify(params));

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
      showModalPage(true, runtimeDapp, page, findRouteResult.params);
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

  // Automatically open leftNav on desktop unless it's marketplace
  if (dapp.dappId != "marketplace:1") {
    if ($media.large) {
      if (!layout.dialogs.center) {
        window.o.publishEvent({
          type: "shell.openNavigation",
        });
      }
    }
  }

  if (!navigation) {
    navigation = generateNavManifest(navArgs, null);
  }

  if (firstUrlChangedCall) {
    firstUrlChangedCall = false;
    init();
  }

  // If the user is not logged-on return to the homepage
  const session = await getSessionInfo();
  if (!$me || !session.isLoggedOn || !sessionStorage.getItem("circlesKey")) {
    await push("/");
    return;
  }
}

function showModalProcess(processId?: string) {
  log(`showModalProcess(processId: ${processId ? processId : 'undefined'})`);
  modalContent = "process";
  const process = window.o.stateMachines.findById(processId);
  showModalPage(
    false,
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
    notificationCount: $inbox ? $inbox.length : 0,
    rightIsOpen: false,
  });
}

let lastModalPage: {
  runtimeDapp: RuntimeDapp<any>;
  routable: Page<any, any>;
  params: { [x: string]: any };
};

function showModalPage(
  pushToStack: boolean,
  runtimeDapp: RuntimeDapp<any>,
  routable: Page<any, any>,
  params: { [x: string]: any }
) {
  log(`showModalPage(pushToStack: ${pushToStack}) - current stack:`, stack);
  if (pushToStack) {
    stack.push({
      dappId: runtimeDapp.dappId,
      params: currentParams
    });
  }
  log(`showModalPage(pushToStack: ${pushToStack}) - new stack:`, stack);

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
    canGoBack: stack.length > 1,
    centerIsOpen: true,
    centerContainsProcess: false,
    leftIsOpen: false,
    notificationCount: $inbox ? $inbox.length : 0,
    rightIsOpen: false,
  });
}
function showMainPage(
  runtimeDapp: RuntimeDapp<any>,
  routable: Page<any, any>,
  params: { [x: string]: any }
) {
  log(`showMainPage(runtimeDapp: ${runtimeDapp.dappId}, routable: ${routable.title} (type: ${routable.type}), params: object)`, params);
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
  setNav(currentNavArgs);
}

async function hideCenter() {
  log(`hideCenter()`);

  modalContent = "none";
  layout = {
    ...layout,
    dialogs: {
      ...layout.dialogs,
      center: null,
    }
  };
  /*
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
      false,
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
   */
}
</script>

<Layout
  layout="{layout}"
  navigation="{navigation}"
  on:clickedOutside="{() => {onRoot()}}"
  sliderPages="{[]}" />
