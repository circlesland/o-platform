import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { PageManifest } from "@o-platform/o-interfaces/dist/pageManifest";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { shellEvents } from "./shared/shellEvents";
import {EventBroker} from "@o-platform/o-utils/dist/eventBroker";
import {Generate} from "@o-platform/o-utils/dist/generate";

import LoadingIndicator from 'src/shared/atoms/LoadingIndicator.svelte'
import NotFound from 'src/shared/pages/NotFound.svelte'
import wrap from "svelte-spa-router/wrap";

import {passport} from "./dapps/o-passport.manifest";
import {banking} from "./dapps/o-banking.manifest";
import {dashboard} from "./dapps/o-dashboard.manifest";
import {homepage} from "./dapps/o-homepage.manifest";
import {miva} from "./dapps/o-miva.manifest";
import {marketplace} from "./dapps/o-marketplace.manifest";
import {trustnetwork} from "./dapps/o-trustnetwork.manifest";
import {stats} from "./dapps/o-stats.manifest";

const errorIndicator = Error;

export const dapps: DappManifest<any>[] = [
  homepage,
  passport,
  banking,
  dashboard,
  miva,
  marketplace,
  trustnetwork,
  stats
];

export const loadedDapps: RuntimeDapp<any>[] = [];

export function getLastLoadedDapp<TState extends {[x:string]:any}>() {
  return <RuntimeDapp<TState>>lastLoadedDapp;
}
let lastLoadedDapp: RuntimeDapp<any>;

export function getLastLoadedPage() {
  return lastLoadedPage;
}
let lastLoadedPage: PageManifest;

export function constructAppUrl(dappManifest: DappManifest<any>): { appBaseUrl: string, appDefaultRoute: string } {
  const appBaseUrl = dappManifest.routeParts.reduce((p, c) => p + "/" + c, "");
  const appDefaultPage = dappManifest.pages.find(o => o.isDefault) ?? dappManifest.pages[0];
  const appDefaultRoute = appDefaultPage?.routeParts.reduce((p, c) => p + "/" + c, appBaseUrl)
    ?? appBaseUrl;
  return { appBaseUrl, appDefaultRoute };
}

function constructPageUrl(appBaseUrl: string, pageManifest: PageManifest): string {
  let pageUrl = pageManifest.routeParts.reduce((p, c) => p + "/" + c, appBaseUrl);
  if (pageUrl == "")
    pageUrl = "/";

  return pageUrl;
}

async function getDappEntryPoint(dappManifest:DappManifest<any>, pageManifest:PageManifest) {
  try {
    lastLoadedPage = pageManifest;
    let runtimeDapp = loadedDapps.find(o => o.dappId == dappManifest.dappId);
    if (!runtimeDapp) {
      // The auth isn't yet loaded
      const freshRuntimeDapp = await loadDapp([], dappManifest);

      if (freshRuntimeDapp.cancelDependencyLoading) {
        console.log("A dependency requested the cancellation of the dependency loading process.")

        if (!freshRuntimeDapp.initialPage) {
          // TODO: Every auth needs a initial page for all conditions, else the generic loader error is displayed
          throw new Error("The dapp '" + freshRuntimeDapp.runtimeDapp.dappId  + "' has no 'initialPage' attribute or its value is null.");
        }

        lastLoadedPage = freshRuntimeDapp.initialPage;
        return  freshRuntimeDapp.initialPage.component;
      }
      else {
        if (freshRuntimeDapp.runtimeDapp) {
          console.log("lastLoadedDapp:", freshRuntimeDapp.runtimeDapp);
          lastLoadedDapp = freshRuntimeDapp.runtimeDapp;
        }
        loadedDapps.push(freshRuntimeDapp.runtimeDapp);
      }
    }
    if (runtimeDapp) {
      console.log("lastLoadedDapp:", runtimeDapp);
      lastLoadedDapp = runtimeDapp;
    }
    lastLoadedPage = pageManifest;
    return pageManifest.component;
  }
  catch (e) {
    window.o.lastError = e;
    return errorIndicator;
  }
}

function constructRoutes(dappManifests: DappManifest<any>[]) {
  const routes = {};

  dappManifests.forEach(dappManifest => {
    const appUrls = constructAppUrl(dappManifest);

    dappManifest.pages.forEach(pageManifest => {
      const pageUrl = constructPageUrl(appUrls.appBaseUrl, pageManifest);
      routes[pageUrl] = wrap({
        loadingComponent: LoadingIndicator,
        userData: pageManifest.userData,
        asyncComponent: async () => await getDappEntryPoint(dappManifest, pageManifest)
      });
    });
  });

  routes["*"] = wrap({
    component: NotFound
  });

  return routes;
}

export const dappEvents = new EventBroker();

function createDappTopics(runtimeDapp: RuntimeDapp<any>): RuntimeDapp<any> {
  const inTopic = dappEvents.createTopic<PlatformEvent>(runtimeDapp.dappId, "in");
  const outTopic = dappEvents.createTopic<PlatformEvent>(runtimeDapp.dappId, "in");
  return <RuntimeDapp<any>>{
    ...runtimeDapp,
    shellEvents: shellEvents,
    inEvents: inTopic,
    outEvents: outTopic
  };
}

async function initializeDapp(stack: RuntimeDapp<any>[], runtimeDapp: RuntimeDapp<any>): Promise<{
  runtimeDapp: RuntimeDapp<any>,
  initialPage: PageManifest,
  cancelDependencyLoading: boolean
}> {
  const logPrefix = "  ".repeat(stack.length) + "initializeDapp(" + runtimeDapp.dappId + "): ";

  let cancelled = false;
  let defaultPage = null;

  // first check if all dependencies are fulfilled
  if (runtimeDapp.dependencies) {
    console.log(logPrefix + "Initializing " + runtimeDapp.dependencies.length + " dependencies ...");
    const missingDependencies = runtimeDapp.dependencies.filter(dep => !loadedDapps.find(o => o.dappId == dep));
    if (missingDependencies.length == 0) {
      // All dependencies are already loaded
      console.log(logPrefix + "All dependencies are already loaded");
    } else {
      // Some or all dependencies need to be loaded
      console.log(logPrefix + "Some or all dependencies must be loaded before proceeding");

      const nextStack = [...stack, runtimeDapp];
      await Promise.all(missingDependencies.map(async dep => {
        if (cancelled) {
          return;
        }

        const dappManifest = dapps.find(o => o.dappId == dep);
        if (!dappManifest) {
          throw new Error(logPrefix + "Couldn't find the manifest for auth '" + dep + "' (Dependency of '" + runtimeDapp.dappId + "')");
        }
        const loadDappResult = await loadDapp(nextStack, dappManifest);
        if (loadDappResult.cancelDependencyLoading) {
          console.log(logPrefix + "Loading sequence was cancelled by " + dep + " in " + runtimeDapp.dappId);
          cancelled = true;
          if (loadDappResult.initialPage) {
            defaultPage = loadDappResult.initialPage;
          }
        }
      }));

      if (cancelled) {
        console.log(logPrefix + "Loading sequence was cancelled in " + runtimeDapp.dappId);
        if (window.o.depositedEvent) {
          window.o.depositedEvent = undefined;
        }
        return {
          runtimeDapp,
          cancelDependencyLoading: true,
          initialPage: defaultPage
        };
      } else {
        console.log(logPrefix + "Loaded all dependencies of " + runtimeDapp.dappId);
      }
    }
  }

  if (!cancelled) {
    defaultPage = runtimeDapp.pages.find(o => o.isDefault) ?? runtimeDapp.pages[0];
  }

  let initializationResult: {
    initialPage: PageManifest,
    cancelDependencyLoading: boolean,
  } = {
    initialPage: defaultPage,
    cancelDependencyLoading: cancelled
  };

  if (runtimeDapp.initialize) {
    initializationResult = await runtimeDapp.initialize(stack, runtimeDapp);
    console.log("initializedDappState", initializationResult);
  }

  // TODO: Hack (kind of). Is used to pass events to freshly loaded dapps.
  if (window.o.depositedEvent) {
    window.o.publishEvent(window.o.depositedEvent);
    window.o.depositedEvent = undefined;
  }

  return {
    runtimeDapp,
    cancelDependencyLoading: initializationResult.cancelDependencyLoading,
    initialPage: initializationResult.initialPage
  };
}

async function loadDapp(stack: RuntimeDapp<any>[], dappManifest: DappManifest<any>): Promise<{
  runtimeDapp: RuntimeDapp<any>,
  initialPage: PageManifest,
  cancelDependencyLoading: boolean
}> {
  const { appBaseUrl, appDefaultRoute } = constructAppUrl(dappManifest);

  let runtimeDapp = <RuntimeDapp<any>>{
    ...dappManifest,
    route: appDefaultRoute,
    dappId: dappManifest.isSingleton
      ? dappManifest.dappId
      : `${dappManifest.dappId}:${Generate.randomHexString()}`,

    // runtimePages: dappManifest.pages.map(pageManifest => {
      // const pageUrl = constructPageUrl(appBaseUrl, pageManifest);
      // return <RuntimePageManifest>{
      //   ...pageManifest,
      //   route: pageUrl
      // };
  }

  runtimeDapp = createDappTopics(runtimeDapp);
  return await initializeDapp(stack, runtimeDapp);
}

const routes = constructRoutes(dapps);
console.log("Registered the following routes: ", routes);

export default routes;
