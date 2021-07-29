import {actions, assign, createMachine, send, sendParent, spawn} from "xstate";
import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
import {Routable} from "@o-platform/o-interfaces/dist/routable";
import {Page} from "@o-platform/o-interfaces/dist/routables/page";
import {dialogBackStackMachine} from "./dialogBackStack";
import {Content, RuntimeContent} from "../layouts/layout";
import NavigationList from "../views/NavigationList.svelte";
import ProcessContainer from "../../../shared/molecules/ProcessContainer.svelte";
import {getRouteList} from "../../../shared/functions/getRouteList";

export type DialogStateContext = {
    _backStack: any;
    backStackSize?: number;
    position: string;
    content?: Content;

    currentRoutable?: Routable;
}

export type SHOW_PAGE = {
    type: "SHOW_PAGE",
    runtimeDapp: RuntimeDapp<any>,
    page: Page<any, any>,
    params: { [x: string]: any },
    routable: Routable
};

export type SHOW_NAVIGATION = {
    type: "SHOW_NAVIGATION",
    runtimeDapp: RuntimeDapp<any>,
    currentRoutable?: Routable
}

export type SHOW_JUMPLIST = {
    type: "SHOW_JUMPLIST",
    runtimeDapp: RuntimeDapp<any>,
    params: {[x:string]: any},
    currentRoutable?: Routable
}

export type SHOW_PROCESS = {
    type: "SHOW_PROCESS"
    processId: string
}

export type CONTENT_CHANGED = {
    type: "CONTENT_CHANGED",
    position: string,
    content: RuntimeContent
};

export type DialogStateEvent = SHOW_PAGE |
    SHOW_PROCESS |
    SHOW_NAVIGATION |
    SHOW_JUMPLIST | {
    type: "CLOSE"
} | {
    type: "CLOSED"
} | {
    type: "OPENED"
} | {
    type: "ERROR",
    error: Error
} | CONTENT_CHANGED;

export const dialogMachine = createMachine<DialogStateContext, DialogStateEvent>({
    initial: "closed",
    context: {
        _backStack: null,
        backStackSize: 0,
        position: null
    },
    states: {
        closed: {
            entry: [(ctx) => console.log(`Dialog '${ctx.position}' started.`), "sendClosed"],
            on: {
                SHOW_PAGE: {
                    actions: ["showPage"],
                    target: "page"
                },
                SHOW_PROCESS: {
                    target: "process"
                },
                SHOW_JUMPLIST: {
                    target: "jumplist"
                },
                SHOW_NAVIGATION: [{
                    target: "navigation"
                }]
            }
        },
        page: {
            id: "page",
            entry: ["sendOpened", "sendContentChanged"],
            on: {
                SHOW_PAGE: {
                    actions: ["showPage"],
                    target: "page"
                },
                CLOSE: [{
                    target: "closing"
                }]
            }
        },
        process: {
            entry: [
                "showProcess",
                "sendContentChanged",
                "sendOpened"
            ],
            on: {
                CLOSE: {
                    target: "closing"
                }
            }
        },
        jumplist: { },
        navigation: {
            entry: [
                "showNavigation",
                "sendContentChanged",
                "sendOpened"
            ],
            on: {
                SHOW_NAVIGATION: [{
                    target: "navigation"
                }],
                CLOSE: {
                    target: "closing"
                }
            }
        },
        closing: {
            always: [{
                cond: "hasBackStack",
                actions: ["stopBackStack"]
            }, {
                actions: "reset",
                target: "closed"
            }]
        },
        error: {
            type: "final"
        }
    }
}, {
    guards: {
        hasBackStack: (ctx) => !!ctx._backStack
    },
    actions: {
        startBackStack: assign({
            _backStack: () => spawn(dialogBackStackMachine)
        }),
        reset: assign({
            content: (ctx) => undefined,
            currentRoutable: (ctx) => undefined,
            backStackSize: (ctx) => 0,
            _backStack: (ctx) => undefined
        }),
        stopBackStack: actions.stop((ctx) => ctx._backStack),
        assignCurrentRoutableToContext: assign({
            currentRoutable: (context, event) => {
                switch (event.type) {
                    case "SHOW_JUMPLIST":
                    case "SHOW_NAVIGATION":
                        return event.currentRoutable;
                }
                throw new Error(`Expected one of SHOW_JUMPLIST, SHOW_NAVIGATION but got ${event.type}`);
            }
        }),
        showPage: assign({
            content: (ctx, event) => {
                if (event.type !== "SHOW_PAGE")
                    throw new Error(`Expected a SHOW_PAGE event but got ${event.type}.`);

                // All other properties of the "Page" in the event must
                // have been handled by now. The dialog only cares about the component and params.
                return <RuntimeContent>{
                    component:  event.page.component,
                    params: event.params,
                    routable: event.routable,
                    runtimeDapp: event.runtimeDapp
                };
            }
        }),
        showProcess: assign({
            content: (ctx, event) => {
                if (event.type !== "SHOW_PROCESS")
                    throw new Error(`Expected a SHOW_PROCESS event but got ${event.type}.`)

                const runningProcess = window.o.stateMachines.findById(event.processId);
                return <RuntimeContent>{
                    component: <any>ProcessContainer,
                    params: {
                        process: runningProcess
                    }
                };
            }
        }),
        showNavigation: assign({
            content: (ctx, event) => {
                if (event.type !== "SHOW_NAVIGATION")
                    throw new Error(`Expected a SHOW_PROCESS event but got ${event.type}.`)

                var routeList = getRouteList(event.runtimeDapp, event.runtimeDapp, event.currentRoutable);
                return <RuntimeContent>{
                    component: <any>NavigationList,
                    params: {
                        navigation: routeList
                    }
                };
            }
        }),
        sendContentChanged: sendParent((ctx) => {
            return {type: "CONTENT_CHANGED", content: ctx.content, position: ctx.position}
        }),
        sendOpened: sendParent((ctx) => {
            return {type: "OPENED", position: ctx.position }
        }),
        sendClosed: sendParent((ctx) => {
            return {type: "CLOSED", position: ctx.position }
        })
    }
});