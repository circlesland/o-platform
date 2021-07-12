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
export function setLastLoadedDapp(dapp:RuntimeDapp<any>) {
    lastLoadedDapp = dapp;
}

let lastLoadedDapp: RuntimeDapp<any>;
export function getLastLoadedPage() {
    return lastLoadedPage;
}

let lastLoadedPage: Page<any, any>;
export function getLastLoadedRoutable() {
    return lastLoadedRoutable;
}
export function setLastLoadedRoutable(routable:Routable) {
    lastLoadedRoutable = routable;
    if (routable && routable.type == "page") {
        lastLoadedPage = <Page<any, any>>routable;
    }
}

let lastLoadedRoutable: Routable;
