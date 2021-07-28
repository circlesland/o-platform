import {actions, assign, createMachine, send, sendParent, spawn} from "xstate";
import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
import {Routable} from "@o-platform/o-interfaces/dist/routable";
import {Page} from "@o-platform/o-interfaces/dist/routables/page";
import {dialogBackStackMachine} from "./dialogBackStack";
import {Content, RuntimeContent} from "../layouts/layout";
import ProcessContainer from "../../../shared/molecules/ProcessContainer.svelte";

export type DialogStateContext = {
    _backStack: any,
    backStackSize: number;
    content?: Content,

    currentRoutable?: Routable
}

export type SHOW_PAGE = {
    type: "SHOW_PAGE",
    runtimeDapp: RuntimeDapp<any>,
    page: Page<any, any>,
    pageParams: { [x: string]: any },
    routable: Routable
};

export type DialogStateEvent = SHOW_PAGE | {
    type: "SHOW_PROCESS"
    processId: string
} | {
    type: "SHOW_JUMPLIST",
    runtimeDapp: RuntimeDapp<any>,
    params: {[x:string]: any},
    currentRoutable?: Routable
} | {
    type: "SHOW_NAVIGATION",
    runtimeDapp: RuntimeDapp<any>,
    currentRoutable?: Routable
} | {
    type: "CLOSE"
} | {
    type: "CLOSED"
} | {
    type: "OPENED"
} | {
    type: "ERROR",
    error: Error
} | {
    type: "PUSH",
    content: SHOW_PAGE
} | {
    type: "PUSHED",
    content: SHOW_PAGE,
    size: number
} | {
    type: "POP"
} | {
    type: "POPPED",
    content: SHOW_PAGE,
    size: number
} | {
    type: "CONTENT_CHANGED",
    content: RuntimeContent
}

export const dialogMachine = createMachine<DialogStateContext, DialogStateEvent>({
    initial: "closed",
    context: {
        _backStack: null,
        backStackSize: 0
    },
    on: {
        PUSHED: {
            actions: ["assignBackStackSizeToContext", "sendContentChanged"]
        },
    },
    states: {
        closed: {
            entry: send({type: "CLOSED"}),
            on: {
                SHOW_PAGE: {
                    actions: ["startBackStack", "showPage"],
                    target: "page"
                },
                SHOW_PROCESS: {
                    target: "process"
                },
                SHOW_JUMPLIST: {
                    target: "jumplist"
                },
                SHOW_NAVIGATION: {
                    target: "navigation"
                }
            }
        },
        page: {
            id: "page",
            entry: ["push",
                "sendOpened"],
            on: {
                SHOW_PAGE: {
                    actions: ["showPage"],
                    target: "page"
                },
                CLOSE: [{
                    cond: (ctx) => ctx.backStackSize > 0,
                    actions: "pop",
                    target: ".popped"
                }, {
                    cond: (ctx) => ctx.backStackSize == 0,
                    target: "closing"
                }]
            },
            states: {
                popped: {
                    entry: () => console.log("page.popped.entry"),
                    on: {
                        POPPED: {
                            actions: ["assignBackStackSizeToContext", "showPage"]
                        },
                        SHOW_PAGE: {
                            actions: ["showPage"],
                            target: "#page"
                        },
                        CLOSE: [{
                            cond: (ctx) => ctx.backStackSize > 0,
                            actions: "pop"
                        }, {
                            cond: (ctx) => ctx.backStackSize == 0,
                            target: "closing"
                        }]
                    }
                },
                closing: {
                    entry: () => console.log("page.closing.entry"),
                    type: "final"
                }
            },
            onDone: "closing"
        },
        process: {
            entry: [
                "showProcess",
                () => console.log("process.entry"),
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
        navigation: { },
        closing: {
            always: [{
                cond: (ctx) => !!ctx._backStack,
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
        assignBackStackSizeToContext: assign({
            backStackSize: (context, event) => {
                switch (event.type) {
                    case "PUSHED":
                    case "POPPED":
                        return event.size;
                }
                throw new Error(`Expected one of PUSHED, POPPED but got ${event.type}`);
            }
        }),
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
                    params: event.pageParams,
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
        sendContentChanged: send((ctx) => {
            return {type: "CONTENT_CHANGED", content: ctx.content}
        }),
        sendOpened: send((ctx) => {
            return {type: "OPENED"}
        }),
        push: send((ctx) => {return {type: "PUSH", content: ctx.content}},
            {to: (ctx) => ctx._backStack}),
        pop: send((ctx) => {return {type: "POP", content: ctx.content}},
            {to: (ctx) => ctx._backStack}),
    },
    services: { }
});