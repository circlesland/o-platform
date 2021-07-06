import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {shellEvents} from "./shared/shellEvents";
import {EventBroker} from "@o-platform/o-utils/dist/eventBroker";
import {Generate} from "@o-platform/o-utils/dist/generate";

import LoadingIndicator from 'src/shared/atoms/LoadingIndicator.svelte'
import NotFound from 'src/shared/pages/NotFound.svelte'
import DappFrame from 'src/shared/molecules/DappFrame.svelte'
import wrap from "svelte-spa-router/wrap";

import {passport} from "./dapps/o-passport.manifest";
import {banking} from "./dapps/o-banking.manifest";
import {dashboard} from "./dapps/o-dashboard.manifest";
import {homepage} from "./dapps/o-homepage.manifest";
import {miva} from "./dapps/o-miva.manifest";
import {marketplace} from "./dapps/o-marketplace.manifest";
import {trustnetwork} from "./dapps/o-trustnetwork.manifest";
import {stats} from "./dapps/o-stats.manifest";
import {Page} from "@o-platform/o-interfaces/dist/routables/page";
import {Routable} from "@o-platform/o-interfaces/dist/routable";
import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";
import {arraysEqual} from "./shared/functions/arraysEqual";

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

export function getLastLoadedDapp<TState extends { [x: string]: any }>() {
    return <RuntimeDapp<TState>>lastLoadedDapp;
}

let lastLoadedDapp: RuntimeDapp<any>;

export function getLastLoadedPage() {
    return lastLoadedPage;
}

let lastLoadedPage: Page<any, any>;

export function getLastLoadedRoutable() {
    return lastLoadedRoutable;
}

let lastLoadedRoutable: Routable;

export function constructAppUrl(dappManifest: DappManifest<any>): { appBaseUrl: string, appDefaultRoute: string } {
    const appBaseUrl = dappManifest.routeParts.reduce((p, c) => p + "/" + c, "");
    const appDefaultPage = dappManifest.defaultRoute
        ? dappManifest.routables.find(o => arraysEqual(o.routeParts, dappManifest.defaultRoute))
        : dappManifest.routables[0];


    const appDefaultRoute = appDefaultPage?.routeParts.reduce((p, c) => p + "/" + c, appBaseUrl)
        ?? appBaseUrl;
    return {appBaseUrl, appDefaultRoute};
}

function constructPageUrl(appBaseUrl: string, routable: Routable): string {
    let pageUrl = routable.routeParts.reduce((p, c) => p + "/" + c, appBaseUrl);
    if (pageUrl == "")
        pageUrl = "/";

    return pageUrl;
}

async function getDappEntryPoint(dappManifest: DappManifest<any>, routable: Routable): Promise<Routable> {
    try {
        lastLoadedRoutable = routable;
        if (routable.type == "page") {
            lastLoadedPage = <Page<any, any>>routable;
        }
        let runtimeDapp = loadedDapps.find(o => o.dappId == dappManifest.dappId);
        if (!runtimeDapp) {
            // The auth isn't yet loaded
            const freshRuntimeDapp = await loadDapp([], dappManifest);

            if (freshRuntimeDapp.cancelDependencyLoading) {
                console.log("A dependency requested the cancellation of the dependency loading process.")

                if (!freshRuntimeDapp.initialRoutable) {
                    // TODO: Every auth needs a initial page for all conditions, else the generic loader error is displayed
                    throw new Error("The dapp '" + freshRuntimeDapp.runtimeDapp.dappId + "' has no 'initialRoutable' attribute or its value is null.");
                }

                lastLoadedRoutable = freshRuntimeDapp.initialRoutable;
                if (freshRuntimeDapp.initialRoutable.type == "page") {
                    lastLoadedPage = <Page<any, any>>freshRuntimeDapp.initialRoutable;
                }

                return freshRuntimeDapp.initialRoutable;
            } else {
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

        lastLoadedRoutable = routable;
        if (routable.type == "page") {
            lastLoadedPage = <Page<any, any>>routable;
        }
        return routable;
    } catch (e) {
        window.o.lastError = e;
        return <Page<any, any>>{
            type: "page",
            routeParts: [],
            title: "Error",
            isSystem: true,
            component: errorIndicator
        }
    }
}

async function constructRoutes(dappManifests: DappManifest<any>[]) {
    const routes = {};

    for (let dappManifest of dappManifests) {
        const appUrls = constructAppUrl(dappManifest);

        for (let routable of dappManifest.routables) {
            const pageUrl = constructPageUrl(appUrls.appBaseUrl, routable);
            routes[pageUrl] = wrap({
                loadingComponent: LoadingIndicator,
                component: DappFrame,
                conditions: detail => {
                    console.log("Router condition: ", detail);
                    return true;
                },
                userData: {
                    dappManifest,
                    routable
                },
                props: {
                    dappManifest,
                    getDappEntryPoint: async () => await getDappEntryPoint(dappManifest, routable)
                }
            });
        }
    }

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
    initialRoutable: Routable,
    cancelDependencyLoading: boolean
}> {
    let cancelled = false;
    let defaultPage = null;

    if (!cancelled) {
        defaultPage = runtimeDapp.defaultRoute
            ? runtimeDapp.routables.find(o => arraysEqual(o.routeParts, runtimeDapp.defaultRoute))
            : runtimeDapp.routables[0];
    }

    let initializationResult: {
        initialRoutable: Routable,
        cancelDependencyLoading: boolean,
    } = {
        initialRoutable: defaultPage,
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
        initialRoutable: initializationResult.initialRoutable
    };
}

async function loadDapp(stack: RuntimeDapp<any>[], dappManifest: DappManifest<any>): Promise<{
    runtimeDapp: RuntimeDapp<any>,
    initialRoutable: Routable,
    cancelDependencyLoading: boolean
}> {
    const {appBaseUrl, appDefaultRoute} = constructAppUrl(dappManifest);

    let runtimeDapp = <RuntimeDapp<any>>{
        ...dappManifest,
        route: appDefaultRoute,
        dappId: dappManifest.isSingleton
            ? dappManifest.dappId
            : `${dappManifest.dappId}:${Generate.randomHexString()}`,
        state: {}
    }

    runtimeDapp = createDappTopics(runtimeDapp);
    return await initializeDapp(stack, runtimeDapp);
}

const routes = async () => await constructRoutes(dapps);
console.log("Registered the following routes: ", routes);

export default routes;
