import {assign, createMachine, send, spawn} from "xstate";
import {CONTENT_ELEMENT_CHANGED, dialogMachine, SET_CONTENT} from "./dialog";
import {isMobile} from "../../../shared/functions/isMobile";
import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
import {findDappById} from "../../../shared/functions/findDappById";
import {Page} from "@o-platform/o-interfaces/dist/routables/page";
import {findRoutableByParams, FindRouteResult} from "../../../shared/functions/findRoutableByParams";
import {RuntimeLayout} from "../layouts/layout";
import {NavigationManifest} from "@o-platform/o-interfaces/dist/navigationManifest";
import {NAV_ELEMENT_CHANGED, navigationToggleButton} from "./navigationToggleButton";
import {Routable} from "@o-platform/o-interfaces/dist/routable";
import {RuntimeDapps} from "../../../runtimeDapps";

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
    context: {
    },
    states: {
        empty: {
            on: {
                URL_CHANGED: {
                    target: "loadRuntimeDapp"
                }
            }
        },
        loadRuntimeDapp: {
            entry: [],
            invoke: {
                src: "findAndSetRuntimeDapp",
                onDone: [{
                    cond: (ctx, event) => !!event.data.runtimeDapp,
                    actions: [
                        assign({
                            runtimeDapp: (ctx, event) => event.data.runtimeDapp
                        }),
                        send((ctx, event) => event.data.originalEvent)
                    ]
                }, {
                    cond: (ctx, event) => !event.data.runtimeDapp,
                    actions: [
                        assign({
                            runtimeDapp: () => null
                        }),
                        send((ctx, event) => event.data.originalEvent)]
                }]
            },
            on: {
                URL_CHANGED: {
                    target: "loadRoutable"
                }
            }
        },
        loadRoutable: {
            entry: ["findAndSetRoutable"],
            always: [{
                target: "ready"
            }]
        },
        ready: {},
        notFound: {}
    }
}, {
    services: {
        findAndSetRuntimeDapp: async (ctx, event) => {
            // console.log("findAndSetRuntimeDapp:", event)
            if (event.type !== "URL_CHANGED")
                throw new Error(`Expected a URL_CHANGED event but got ${event.type}.`);

            const dapp = findDappById(event.dappId);
            return {
                originalEvent: event,
                runtimeDapp: dapp ? await RuntimeDapps.instance().getRuntimeDapp(dapp) : null
            };
        }
    },
    actions: {
        findAndSetRoutable: assign({
            routable: (ctx, event) => {
                // console.log("findAndSetRoutable:", event)
                if (event.type != "URL_CHANGED")
                    throw new Error(`Expected a URL_CHANGED event but got ${event.type}.`);

                const findRouteResult = findRoutableByParams(ctx.runtimeDapp, event);
                if (!findRouteResult.found && ctx.runtimeDapp.defaultRoute) {
                    // If no nextRoutable could be found then look for a default in the dapp
                    const defaultRoutable = findRoutableByParams(ctx.runtimeDapp, {
                        dappId: ctx.runtimeDapp.dappId,
                        "1": ctx.runtimeDapp.defaultRoute.length > 0 ? ctx.runtimeDapp.defaultRoute[0] : null,
                        "2": ctx.runtimeDapp.defaultRoute.length > 1 ? ctx.runtimeDapp.defaultRoute[1] : null,
                        "3": ctx.runtimeDapp.defaultRoute.length > 2 ? ctx.runtimeDapp.defaultRoute[2] : null,
                        "4": ctx.runtimeDapp.defaultRoute.length > 3 ? ctx.runtimeDapp.defaultRoute[3] : null,
                        "5": ctx.runtimeDapp.defaultRoute.length > 4 ? ctx.runtimeDapp.defaultRoute[4] : null,
                        "6": ctx.runtimeDapp.defaultRoute.length > 5 ? ctx.runtimeDapp.defaultRoute[5] : null,
                    });
                    findRouteResult.routable = defaultRoutable.routable;
                    findRouteResult.found = true;
                    findRouteResult.params = defaultRoutable.params;
                }
                return findRouteResult;
            }
        }),
    }
});