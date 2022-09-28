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
import { findRoutableByParams, FindRouteResult } from "../functions/findRoutableByParams";
import { push } from "svelte-spa-router";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { generateNavManifest, GenerateNavManifestArgs } from "../functions/generateNavManifest";
import { inbox } from "../stores/inbox";
import NavigationList from "../../shared/molecules/NavigationList.svelte";
import { Process } from "@o-platform/o-process/dist/interfaces/process";
import { media } from "../stores/media";
import { me } from "../stores/me";
import {
  Capability,
  EventsDocument,
  EventType,
  I18n,
  NotificationEvent,
  Purchased,
  SessionInfo,
} from "../api/data/types";
import { contacts } from "../stores/contacts";
import { performOauth } from "../../dapps/o-humanode/processes/performOauth";
import { clearScrollPosition, popScrollPosition, pushScrollPosition } from "../layouts/Center.svelte";
import { myChats } from "../stores/myChat";
import { myTransactions } from "../stores/myTransactions";
import { assetBalances } from "../stores/assetsBalances";
import { myPurchases } from "../stores/myPurchases";
import { upsertIdentity } from "../../dapps/o-passport/processes/upsertIdentity";
import { goToPreviouslyDesiredRouteIfExisting } from "../../dapps/o-onboarding/processes/init";
import { Trigger } from "@o-platform/o-interfaces/dist/routables/trigger";
import { mySales } from "../stores/mySales";
import { Stopped } from "@o-platform/o-process/dist/events/stopped";
import { Environment } from "../environment";

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
let capabilities: Capability[];
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
let _scrollY: number;
let runningProcess: ProcessStarted;

/**
 * A stack of opened modal pages.
 */
const stack: {
  dappId: string;
  params: { [x: string]: any };
  scrollY: number;
}[] = [];

async function onBack() {
  // log("onBack() - current stack: ", JSON.stringify(stack, null, 2));
  if (stack.length < 2) {
    await onRoot();
    return;
  }
  stack.pop();
  const previous = stack[stack.length - 1];
  // log("onBack() - new stack: ", JSON.stringify(stack, null, 2));

  const previousContext: {
    runtimeDapp: RuntimeDapp<any>;
    routable: Page<any, any>;
    params: { [x: string]: any };
  } = {};

  const previousDapp = findDappById(previous.dappId);
  previousContext.runtimeDapp = previousDapp ? await RuntimeDapps.instance().getRuntimeDapp(previousDapp) : null;

  const routable = findRoutableByParams(previousContext.runtimeDapp, previous.params);
  if (!routable.found) {
    throw new Error(
      window.o.i18n("shared.molecules.dappFrame.errors.pageFromBackStackNotFound", {
        values: { error: JSON.stringify(previous) },
      })
    );
  }
  if (routable.routable.type != "page") {
    throw new Error(
      window.o.i18n("shared.molecules.dappFrame.errors.pageFromBackStackIsNoPage", {
        values: { error: JSON.stringify(previous) },
      })
    );
  }
  previousContext.routable = <Page<any, any>>routable;
  previousContext.params = previous.params;

  // console.log("onBack() - TODO: set the following context: ", previousContext);
  const path = Object.keys(previous.params)
    .filter((o) => parseInt(o) != Number.NaN && o >= 0 && o <= 6)
    .map((o) => previous.params[o])
    .filter((o) => !!o && o != "")
    .reduce((p, c) => p + "/" + c, "");

  //stack.pop();
  console.log("DappFrame.onBack() is pushing to:", `#/${previous.params.dappId}${path}`);
  await push(`#/${previous.params.dappId}${path}`);
  setTimeout(() => popScrollPosition());
}

async function onStay() {
  // log("onStay() - current stack: ", JSON.stringify(stack, null, 2));
  if (stack.length < 1) {
    await onRoot();
    return;
  }
  const previous = stack.pop();
  // log("onStay() - new stack: ", JSON.stringify(stack, null, 2));

  const previousContext: {
    runtimeDapp: RuntimeDapp<any>;
    routable: Page<any, any>;
    params: { [x: string]: any };
  } = {};

  const previousDapp = findDappById(previous.dappId);
  previousContext.runtimeDapp = previousDapp ? await RuntimeDapps.instance().getRuntimeDapp(previousDapp) : null;

  const routable = findRoutableByParams(previousContext.runtimeDapp, previous.params);
  if (!routable.found) {
    throw new Error(
      window.o.i18n("shared.molecules.dappFrame.errors.pageFromBackStackNotFound", {
        values: { error: JSON.stringify(previous) },
      })
    );
  }
  if (routable.routable.type != "page") {
    throw new Error(
      window.o.i18n("shared.molecules.dappFrame.errors.pageFromBackStackIsNoPage", {
        values: { error: JSON.stringify(previous) },
      })
    );
  }
  previousContext.routable = <Page<any, any>>routable;
  previousContext.params = previous.params;

  console.log("onStay() - TODO: set the following context: ", previousContext);
  const path = Object.keys(previous.params)
    .filter((o) => parseInt(o) != Number.NaN && o >= 0 && o <= 6)
    .map((o) => previous.params[o])
    .filter((o) => !!o && o != "")
    .reduce((p, c) => p + "/" + c, "");

  //await push(`#/${previous.params.dappId}${path}`);
  await handleUrlChanged();
  window.scrollTo(0, previous.scrollY);
}

async function onRoot() {
  // log("onRoot() - current stack: ", JSON.stringify(stack, null, 2));
  if (runningProcess) {
    const m = window.o.stateMachines.findById(runningProcess.processId);
    if (m) {
      m.sendEvent({
        type: "process.cancel",
      });
      return;
    } else {
      runningProcess = null;
    }
  }

  if (stack.length == 0) {
    await onCloseModal();
    return;
  }
  const root = stack[0];

  let nextRoute: FindRouteResult;
  let previousRuntimeDapp: RuntimeDapp<any>;
  let path: string | null = null;

  if (baseParams) {
    // Go back to the page that's specified by "baseParams"
    const previousDapp = findDappById(baseParams.dappId);
    previousRuntimeDapp = previousDapp ? await RuntimeDapps.instance().getRuntimeDapp(previousDapp) : null;

    nextRoute = findRoutableByParams(previousRuntimeDapp, baseParams);
    if (nextRoute && nextRoute.found) {
      const routePartsWithReplacedVariables = nextRoute.routable.routeParts.map((o, i) => {
        if (!o.startsWith(":")) return o;

        if (baseParams[(i + 1).toString()]) {
          return baseParams[(i + 1).toString()];
        }
      });
      path = routePartsWithReplacedVariables.map((o) => o.replace("=", "")).join("/");
    }
  } else {
    const previousDapp = findDappById(root.dappId);
    previousRuntimeDapp = previousDapp ? await RuntimeDapps.instance().getRuntimeDapp(previousDapp) : null;
    // no baseParams. Find the base page of the last route
    const lastRoute = findRoutableByParams(previousRuntimeDapp, root.params);
    if (lastRoute && lastRoute.found && (<Page<any, any>>lastRoute.routable).basePage) {
      path = (<Page<any, any>>lastRoute.routable).basePage.map((o) => o.replace("=", "")).join("/");
    }
    if (lastRoute && lastRoute.found && !path) {
      const defaultRoute = findRoutableByParams(previousRuntimeDapp, {
        ...previousRuntimeDapp.defaultRoute.reduce((p, c, i) => {
          p[(i + 1).toString()] = c;
          return p;
        }, <{ [x: string]: string }>{}),
        dappId: previousRuntimeDapp.dappId,
      });

      if (defaultRoute && defaultRoute.found) {
        path = (<Page<any, any>>defaultRoute.routable).routeParts.map((o) => o.replace("=", "")).join("/");
      }
    }
  }

  if (path == null) {
    console.error(`couldn't find the next route:`, currentParams, stack);
    return;
  }

  while (stack.length > 0) {
    stack.pop();
  }

  onCloseModal();

  const dc = previousRuntimeDapp.dappId.indexOf(":");
  const dappIdForRoute = previousRuntimeDapp.dappId.substr(0, dc > -1 ? dc : previousRuntimeDapp.dappId.length);
  console.log("DappFrame.onRoot() is pushing to:", `#/${dappIdForRoute}/${path}`);
  await push(`#/${dappIdForRoute}/${path}`);

  window.scrollTo(0, root.scrollY);
}

function findNextRoute(previousRuntimeDapp: RuntimeDapp<any>, root: { params: { [p: string]: any }; scrollY: number }) {
  let nextRoute: Routable | null = null;

  const findRouteResult = findRoutableByParams(
    previousRuntimeDapp,
    root.params /*stack[stack.length > 1 ? 1 : 0].params*/
  );
  const basePage =
    findRouteResult.found && findRouteResult.routable.type == "page"
      ? (<Page<any, any>>findRouteResult.routable).basePage
      : null;

  if (basePage) {
    const basePageParams = {
      "1": basePage.length > 0 ? basePage[0] : null,
      "2": basePage.length > 1 ? basePage[1] : null,
      "3": basePage.length > 2 ? basePage[2] : null,
      "4": basePage.length > 3 ? basePage[3] : null,
      "5": basePage.length > 4 ? basePage[4] : null,
      "6": basePage.length > 5 ? basePage[5] : null,
      dappId: root.params.dappId,
    };
    const basePageReslt = findRoutableByParams(previousRuntimeDapp, basePageParams);
    if (basePageReslt.found) {
      nextRoute = basePageReslt.routable;
    }
  }

  if (!nextRoute) {
    const defaultRoute = _findDefaultRoute(previousRuntimeDapp);
    if (!defaultRoute.found) {
      throw new Error(
        window.o.i18n("shared.molecules.dappFrame.errors.pageFromBackStackNotFound", {
          values: { error: JSON.stringify(root) },
        })
      );
    }
    if (defaultRoute.routable.type != "page") {
      throw new Error(
        window.o.i18n("shared.molecules.dappFrame.errors.pageFromBackStackIsNoPage", {
          values: { error: JSON.stringify(root) },
        })
      );
    }
    nextRoute = defaultRoute.routable;
  }

  if (!nextRoute) {
    throw new Error(
      window.o.i18n("shared.melocules.dappFrame.errors.couldNotFindRoot", {
        values: { item: JSON.stringify(root) },
      })
    );
  }
  return nextRoute;
}

function setNav(navArgs: GenerateNavManifestArgs) {
  // log(`setNav(navArgs: GenerateNavManifestArgs)`, navArgs);

  if (navArgs.centerIsOpen && !preModalNavArgs) {
    preModalNavArgs = currentNavArgs;
  }
  let args = {
    ...navArgs,
    showLogin: dapp.anonymous && !layout.dialogs.center,
  };
  navigation = generateNavManifest(args, null);
  if (dapp.dappId == "events:1") {
    navigation = null;
  }
  currentNavArgs = args;
}

/**
 * This function is called only one time after the first route.
 */

let shellEventSubscription: ZenObservable.Subscription;
const blblblbl = new Audio("blblblbl.mp3");
let sessionInfo: SessionInfo;
function initSession(session: SessionInfo) {
  sessionInfo = session;
  // console.log(`subscribeToApiEvents(). Session: `, session);
  capabilities = session.capabilities;
  if (session.isLoggedOn && session.hasProfile && !shellEventSubscription) {
    window.o.apiClient.client.subscribeToResult().then((apiClient) => {
      shellEventSubscription = apiClient
        .subscribe({
          query: EventsDocument,
        })
        .subscribe(async (next) => {
          const event: NotificationEvent = next.data.events;
          let playBlblblbl = false;

          if (event.type == "new_message") {
            const chatStore = myChats.with(event.from);
            const message = await chatStore.findSingleItemFallback([EventType.ChatMessage], event.itemId.toString());
            chatStore.refresh(true);
            await contacts.findBySafeAddress(event.from, true);
            playBlblblbl = true;
          } else if (
            event.type == EventType.CrcHubTransfer ||
            event.type == EventType.CrcMinting ||
            event.type == EventType.Erc20Transfer
          ) {
            const transaction = await myTransactions.findSingleItemFallback(
              myTransactions.eventTypes,
              event.transaction_hash
            );

            myTransactions.refresh(true);
            assetBalances.update();

            if (event.from == $me.circlesAddress) {
              await contacts.findBySafeAddress(event.to, true);
              const chatStore = myChats.with(event.to);
              const message = await chatStore.findSingleItemFallback(
                [EventType.CrcHubTransfer],
                event.transaction_hash
              );
              chatStore.refresh(true);
            } else if (event.type != EventType.CrcMinting) {
              await contacts.findBySafeAddress(event.from, true);
              const chatStore = myChats.with(event.from);
              const message = await chatStore.findSingleItemFallback(
                [EventType.CrcHubTransfer],
                event.transaction_hash
              );
              chatStore.refresh(true);
              playBlblblbl = true;
            }
          } else if (event.type == EventType.CrcTrust) {
            if (event.from == $me.circlesAddress) {
              const contact = await contacts.findBySafeAddress(event.to, true);
              console.log("CrcTrust update to:", contact);
            } else {
              const contact = await contacts.findBySafeAddress(event.from, true);
              console.log("CrcTrust update from:", contact);
              const chatStore = myChats.with(contact.contactAddress);
              const message = await chatStore.findSingleItemFallback([EventType.CrcTrust], event.transaction_hash);
              chatStore.refresh(true);
              playBlblblbl = true;
            }
          } else if (event.type == EventType.Purchased) {
            const purchase = await myPurchases.findSingleItemFallback([EventType.Purchased], event.itemId.toString());
            myPurchases.refresh();

            const invoices = (<Purchased>purchase.payload).purchase?.invoices ?? [];
            await Promise.all(
              invoices.map(async (o) => {
                const sale = await mySales.findSingleItemFallback([EventType.SaleEvent], o.id.toString());
              })
            );
            mySales.refresh();
          } else if (event.type == EventType.SaleEvent) {
            const sale = await mySales.findSingleItemFallback([EventType.SaleEvent], event.itemId.toString());
            mySales.refresh();
          }

          inbox.reload().then(() => {
            if (!playBlblblbl) return;

            blblblbl.play();
          });
        });
    });

    // Load the contacts so that they're ready when the user
    // enters the dashboard..
    contacts.subscribe((data) => {
      // console.log("loaded contacts: ", data);
    });
  }

  inbox.reload();
}

async function init() {
  // log(`init()`);
  const leftSlotOverride = routable?.type === "page" ? routable.navigation?.leftSlot : undefined;

  setNav({
    leftSlotOverride: leftSlotOverride,
    centerContainsProcess: false,
    centerIsOpen: false,
    rightIsOpen: false,
    leftIsOpen: false,
    notificationCount: $inbox ? $inbox.length : 0,
  });
  if (!identityChecked && !dapp.anonymous) {
    //window.o.runProcess(identify, {}, {});
    identityChecked = true;
  }
  const session = await me.getSessionInfo();
  if (!$me || !session.isLoggedOn || !sessionStorage.getItem("circlesKey")) {
    // TODO: Stash the current URL away and redirect the user to it after authentication
    if (!routable.anonymous) {
      const path = Object.keys(params)
        .filter((o) => parseInt(o) != Number.NaN && parseInt(o) >= 0 && parseInt(o) <= 6)
        .map((o) => params[o])
        .filter((o) => !!o && o != "")
        .reduce((p, c) => p + "/" + c, "");

      if (!(path == "" || path == "#" || path == "#/" || path == "/#/")) {
        sessionStorage.setItem("desiredRoute", JSON.stringify(params));
      }
      await push("/");
      return;
    } else {
      return;
    }
  }

  initSession(session);

  if (!$me || !session.isLoggedOn) {
    await push("/");
    return;
  }
}

function onOpenNavigation() {
  // log("onOpenNavigation()");
  layout = {
    ...layout,
    dialogs: {
      ...layout.dialogs,
      left: {
        isOpen: true,
        component: dapp.dappId == "events:1" ? null : NavigationList,
        routable: routable,
        runtimeDapp: runtimeDapp,
        params: {
          routable: routable,
          runtimeDapp: runtimeDapp,
          capabilities: capabilities,
        },
      },
    },
  };
  const leftSlotOverride = routable?.type === "page" ? routable.navigation?.leftSlot : undefined;
  setNav({
    leftSlotOverride: leftSlotOverride,
    leftIsOpen: true,
    rightIsOpen: false,
    notificationCount: $inbox ? $inbox.length : 0,
    centerIsOpen: false,
    centerContainsProcess: false,
  });
}

function onCloseNavigation() {
  // log("onCloseNavigation()");
  layout.dialogs.left = {
    ...layout.dialogs.left,
    isOpen: false,
  };
  const leftSlotOverride = routable?.type === "page" ? routable.navigation?.leftSlot : undefined;
  setNav({
    leftSlotOverride: leftSlotOverride,
    leftIsOpen: false,
    rightIsOpen: false,
    notificationCount: $inbox ? $inbox.length : 0,
    centerIsOpen: false,
    centerContainsProcess: false,
  });
}

function onOpenContacts() {
  push("#/contacts/chat");
}

function onOpenModal() {
  // log("onOpenModal()");
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
  push("#/home");
}

async function onCloseModal() {
  // log("onCloseModal()");
  runningProcess = null;
  await hideCenter();
  clearScrollPosition();
  lastModalPage = null;

  setNav({
    ...preModalNavArgs,
    notificationCount: $inbox ? $inbox.length : 0,
  });
  window.scrollTo(0, _scrollY);
}

function onRequestCloseModal() {
  // log("onRequestCloseModal()");
  if (!runningProcess) {
    onBack();
    return;
  }
  const process: Process = window.o.stateMachines.findById(runningProcess.processId);
  if (!process) {
    onBack();
    return;
  }
  onProcessContinued();
  process.sendEvent({ type: "process.cancelRequest" });
}

function onProcessCancelRequest() {
  // log("onProcessCancelRequest()");
  if (!runningProcess) {
    return;
  }
  const process: Process = window.o.stateMachines.findById(runningProcess.processId);
  if (!process) {
    return;
  }
  onProcessContinued();
  process.sendEvent({ type: "process.cancelRequest" });
}

async function onRunProcess(event: any) {
  // log("onRunProcess(event: any)", event);
  const runProcessEvent = <RunProcess<any>>event;
  const runningProcess = await window.o.stateMachines.run(runProcessEvent.definition, runProcessEvent.contextModifier);
  // If not, send an event with the process id.
  const startedEvent = new ProcessStarted(runningProcess.id);
  startedEvent.responseToId = runProcessEvent.id;
  window.o.publishEvent(startedEvent);
}

async function onProcessStopped(event: Stopped) {
  // TODO: Hack: If the returned data contains a 'redirectTo' go to this url instead
  if (event.result?.redirectTo) {
    while (stack.length) {
      stack.pop();
    }
    await push(event.result.redirectTo);
    return;
  }

  // log("onProcessStopped()");
  // TODO: How to handle onProcessStopped() vs. onRoot()? Exit to the root page when a process stopped or go back to the last card?
  //       Below is the "to last card" solution
  await onRoot();

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
  // log("onProcessContinued()");
  const leftSlotOverride = routable?.type === "page" ? routable.navigation?.leftSlot : undefined;
  setNav({
    leftSlotOverride: leftSlotOverride,
    notificationCount: $inbox ? $inbox.length : 0,
    centerIsOpen: true,
    centerContainsProcess: true,
    leftIsOpen: false,
    rightIsOpen: false,
  });
}

function onProcessCanGoBack() {
  // log("onProcessCanGoBack()");
  const leftSlotOverride = routable?.type === "page" ? routable.navigation?.leftSlot : undefined;
  setNav({
    leftSlotOverride: leftSlotOverride,
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
  // log("onProcessCanSkip()");
  const leftSlotOverride = routable?.type === "page" ? routable.navigation?.leftSlot : undefined;
  setNav({
    leftSlotOverride: leftSlotOverride,
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
  // log("onProcessBack()");
  if (!runningProcess) {
    return;
  }
  const process: Process = window.o.stateMachines.findById(runningProcess.processId);
  if (!process) {
    return;
  }
  onProcessContinued();
  process.sendAnswer({ type: "process.back" });
}

function onProcessSkip() {
  // log("onProcessSkip()");
  if (!runningProcess) {
    return;
  }
  const process: Process = window.o.stateMachines.findById(runningProcess.processId);
  if (!process) {
    return;
  }
  onProcessContinued();
  process.sendAnswer({ type: "process.skip" });
}

function onInputFocused() {
  // log("onInputFocused()");
  // if (isMobile()) {
  //   document.body.classList.add("keyboard-open");
  // }
  return;
}

function onInputBlurred() {
  // log("onInputBlurred()");
  // if (isMobile()) {
  //   document.body.classList.remove("keyboard-open");
  // }
  return;
}

function armOauthListener() {
  function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === "?" ? queryString.substr(1) : queryString).split("&");
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split("=");
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
    }
    return query;
  }

  if (location.search) {
    // Handle OAuth callbacks:
    // 1. Find out from where the oauth interaction was started (see state)
    // 2. Send the user back to its origin
    // 3. Re-open the flow to show a success- or cancelled-message
    const paramsMap: any = parseQuery(location.search);

    if (paramsMap && paramsMap.state) {
      const splittedState = paramsMap.state.split("-");
      if (splittedState.length != 2) {
        // invalid
        alert("Couldn't parse the 'state' from the oauth response");
      } else {
        // possibly valid
        // TODO: allow app-id + routeParts in the second part of the 'state'
        if (splittedState[1] == "dashboard") {
          setTimeout(() => {
            window.o.runProcess(performOauth, {
              origin: "dashboard",
              authorizationResponse: {
                error: paramsMap?.error,
                state: paramsMap?.state,
                code: paramsMap?.code,
              },
              successAction: () => {
                push("#/dashboard");
              },
            });
          }, 1000);
        } else if (splittedState[1] == "locations") {
          setTimeout(() => {
            window.o.runProcess(performOauth, {
              origin: "locations",
              authorizationResponse: {
                error: paramsMap?.error,
                state: paramsMap?.state,
                code: paramsMap?.code,
              },
              successAction: () => {
                push("#/dashboard");
              },
            });
          }, 1000);
        } else {
          alert("Couldn't parse the 'state' from the oauth response");
          // invalid
        }
      }
    }
  }
}

onMount(async () => {
  // log("onMount()");

  armOauthListener();

  await window.o.events.subscribe(<any>(async (event) => {
    // log("DappFrame event: ", event);
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
      case "shell.authenticated":
        const session = await me.getSessionInfo();
        initSession(session);
        break;
      case "shell.openModal":
        _scrollY = window.scrollY;
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
        await onProcessStopped(event);
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
    // log(
    //   `window.o.runProcess(processDefinition: ${processDefinition.name}) `,
    //   contextData
    // );
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
    const processStarted: ProcessStarted = await window.o.requestEvent<ProcessStarted>(requestEvent);
    showModalProcess(processStarted.processId);
  };
});

function showQuickActions() {
  // log(`showQuickActions()`);
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

$: {
  const paramsJson = JSON.stringify(params);
  if (lastParamsJson !== paramsJson) {
    handleUrlChanged();
    lastParamsJson = paramsJson;
  }
}

function _findDefaultRoute(runtimeDapp: RuntimeDapp<any>) {
  // log(`findDefaultRoute(runtimeDapp: ${runtimeDapp.dappId})`);

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
    const result = <FindRouteResult>{
      routable: defaultRoutable.routable,
      found: true,
      params: {
        ...defaultRoutable.params,
      },
    };
    // log(
    //   `findDefaultRoute(runtimeDapp: ${runtimeDapp.dappId}) - found: `,
    //   result
    // );
    return result;
  } else {
    return <FindRouteResult>{
      found: false,
    };
  }
}

let currentParams: {
  dappId: string;
  "1": string | null;
  "2": string | null;
  "3": string | null;
  "4": string | null;
  "5": string | null;
  "6": string | null;
} = null;

let baseParams: {
  dappId: string;
  "1": string | null;
  "2": string | null;
  "3": string | null;
  "4": string | null;
  "5": string | null;
  "6": string | null;
} = null;

let firstUrlChangedCall = true;

let i18nStrings: I18n;
let language = Environment.userLanguage;

async function handleUrlChanged() {
  // log(`handleUrlChanged()`);
  const navArgs = <GenerateNavManifestArgs>{};
  dapp = findDappById(params.dappId);
  runtimeDapp = dapp ? await RuntimeDapps.instance().getRuntimeDapp(dapp) : null;

  if (!runtimeDapp) {
    // throw new Error(`Couldn't find a dapp with the id: ${params.dappId}`);
    // log(
    //   `handleUrlChanged() - Couldn't find a dapp with the id: ${params.dappId} - going to /`
    // );
    sessionStorage.removeItem("desiredRoute");
    await push("/");
    return;
  }

  const findRouteResult = findRoutableByParams(runtimeDapp, params);
  if (!findRouteResult.found) {
    throw new Error(
      window.o.i18n("shared.molecules.dappFrame.errors.couldNotFindParams", {
        values: { params: JSON.stringify(params, null, 2) },
      })
    );
  }
  if (findRouteResult.routable.type == "trigger") {
    (<Trigger<any, any>>findRouteResult.routable).action(findRouteResult.params, runtimeDapp);
    return;
  }

  routable = findRouteResult.routable;

  if (routable.type == "page" && routable.navigation?.leftSlot) {
    navArgs.leftSlotOverride = routable.navigation.leftSlot;
  }
  // log(
  //   `handleUrlChanged() - Found routable: ${routable.title} (type: ${routable.type})`
  // );

  currentParams = JSON.parse(JSON.stringify(params));
  if (findRouteResult.routable.type === "page") {
    const page: Page<any, any> = <any>findRouteResult.routable;
    if (page.position === "modal") {
      if (!layout.main) {
        // Check if the modal page was called directly. In this case the default main
        // page of the corresponding dapp must be loaded as well.
        const defaultRoute = findNextRoute(runtimeDapp, {
          params: params,
          scrollY: 0,
        });
        if (defaultRoute && defaultRoute.type === "page") {
          showMainPage(runtimeDapp, <any>defaultRoute, findRouteResult.params);
        } else {
          // TODO: 404
        }
      }
      showModalPage(true, runtimeDapp, page, findRouteResult.params);
      navArgs.centerIsOpen = true;
    } else {
      await hideCenter();
      navArgs.centerIsOpen = false;
      baseParams = currentParams;
      showMainPage(runtimeDapp, page, findRouteResult.params);
    }
  }

  window.o.publishEvent({
    type: "shell.routeChanged",
    runtimeDapp: runtimeDapp,
    routable: findRouteResult.routable,
  });

  // Automatically open leftNav on desktop unless it's marketplace

  if ($media.large) {
    if (!layout.dialogs.center) {
      window.o.publishEvent({
        type: "shell.openNavigation",
      });
    }
  }

  if (!navigation && dapp.dappId != "events:1") {
    navigation = generateNavManifest(navArgs, null);
  }

  if (
    sessionInfo?.isLoggedOn &&
    sessionInfo?.hasProfile &&
    dapp?.dappId != "homepage:1" &&
    dapp?.dappId != "events:1" &&
    $me?.__typename == "Person" &&
    !$me?.askedForEmailAddress &&
    !sessionStorage.getItem("askedForEmailAddress") &&
    sessionStorage.getItem("circlesKey")
  ) {
    window.o.runProcess(
      upsertIdentity,
      {
        ...$me,
        successAction: () => {
          goToPreviouslyDesiredRouteIfExisting();
        },
      },
      { emailAddress: true },
      ["emailAddress", "newsletter"]
    );
    sessionStorage.setItem("askedForEmailAddress", "true");
  }

  if (firstUrlChangedCall) {
    firstUrlChangedCall = false;
    init();
  }
}

function showModalProcess(processId?: string) {
  // log(`showModalProcess(processId: ${processId ? processId : "undefined"})`);
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
  const leftSlotOverride = routable?.type === "page" ? routable.navigation?.leftSlot : undefined;
  setNav({
    leftSlotOverride: leftSlotOverride,
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
  // log(
  //   `showModalPage(pushToStack: ${pushToStack}) - current stack:`,
  //   JSON.stringify(stack, null, 2)
  // );
  if (stack.length > 0) {
    const last = stack[stack.length - 1];
    pushToStack = !(last.dappId == runtimeDapp.dappId && JSON.stringify(currentParams) == JSON.stringify(last.params));
  }
  if (pushToStack) {
    stack.push({
      dappId: runtimeDapp.dappId,
      params: currentParams,
      scrollY: window.scrollY,
    });
    pushScrollPosition();
  }
  // log(
  //   `showModalPage(pushToStack: ${pushToStack}) - new stack:`,
  //   JSON.stringify(stack, null, 2)
  // );

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
          capabilities: capabilities,
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

function showMainPage(runtimeDapp: RuntimeDapp<any>, routable: Page<any, any>, params: { [x: string]: any }) {
  // log(
  //   `showMainPage(runtimeDapp: ${runtimeDapp.dappId}, routable: ${routable.title} (type: ${routable.type}), params: object)`,
  //   params
  // );
  layout = {
    ...layout,
    main: {
      component: routable.component,
      params: {
        ...params,
        runtimeDapp: runtimeDapp,
        routable: routable,
        capabilities: capabilities,
      },
      isOpen: true,
      runtimeDapp: runtimeDapp,
      routable: routable,
    },
  };
  const leftSlotOverride = routable?.type === "page" ? routable.navigation?.leftSlot : undefined;
  setNav({
    leftSlotOverride: leftSlotOverride,
    ...currentNavArgs,
    centerIsOpen: false,
    centerContainsProcess: false,
  });
}

async function hideCenter() {
  // log(`hideCenter()`);

  clearScrollPosition();
  modalContent = "none";
  layout = {
    ...layout,
    dialogs: {
      ...layout.dialogs,
      center: null,
    },
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
  on:clickedOutside="{() => {
    onRoot();
  }}"
  sliderPages="{[]}" />
