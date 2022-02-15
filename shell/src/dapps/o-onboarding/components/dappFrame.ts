import {createMachine} from "xstate";
import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
import {FindRouteResult} from "../../../shared/functions/findRoutableByParams";
import {NavigationManifest} from "@o-platform/o-interfaces/dist/navigationManifest";
import {RuntimeLayout} from "../../../shared/layouts/layout";

export type DappFrameStateContext = {
    runtimeDapp?: RuntimeDapp<any>;
    routable?: FindRouteResult;
    layout?: RuntimeLayout;
    navigation?: NavigationManifest;
}

export type DappFrameStateEvent = {
    type: "URL_CHANGED",
    dappId: string;
    "1": string | null;
    "2": string | null;
    "3": string | null;
    "4": string | null;
    "5": string | null;
    "6": string | null;
}

export const dappFrame = createMachine<DappFrameStateContext, DappFrameStateEvent>({
    initial: "empty",
    context: {},
    states: {}
}, {
    services: {},
    actions: {}
});