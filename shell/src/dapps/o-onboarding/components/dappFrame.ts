import {assign, createMachine, send, spawn} from "xstate";
import {CONTENT_CHANGED, dialogMachine, SHOW_NAVIGATION, SHOW_PAGE, SHOW_PROCESS} from "./dialog";
import {isMobile} from "../../../shared/functions/isMobile";
import NotFound from "../../../shared/pages/NotFound.svelte";
import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
import {findDappById} from "../../../shared/functions/findDappById";
import {RuntimeDapps} from "../../../runtimeDapps";
import {Page} from "@o-platform/o-interfaces/dist/routables/page";
import {findRoutableByParams, FindRouteResult} from "../../../shared/functions/findRoutableByParams";
import {RuntimeLayout} from "../layouts/layout";

export type DappFrameStateContext = {
    _mainDialog: any;
    _leftDialog: any;
    _centerDialog: any;
    _rightDialog: any;

    runtimeDapp: RuntimeDapp<any>;
    routable: FindRouteResult;

    layout: any;
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
} | CONTENT_CHANGED | {
    type: "LAYOUT_CHANGED",
    layout: RuntimeLayout
} | SHOW_PROCESS | {
    type: "PROCESS_STOPPED"
} | {
    type: "CLOSED",
    position: string
} | {
    type: "OPENED",
    position: string
};

export const dappFrame = createMachine<DappFrameStateContext, DappFrameStateEvent>({
    initial: "empty",
    context: {
        _mainDialog: null,
        _leftDialog: null,
        _centerDialog: null,
        _rightDialog: null,

        runtimeDapp: null,
        routable: null,

        layout: {
            main: undefined,
            dialogs:{
                left: undefined,
                center: undefined,
                right: undefined
            }
        }
    },
    on: {
        CONTENT_CHANGED: [{
            cond: (ctx, event) => event.position === "main",
            actions: ["setMainContent", "sendLayoutChanged"]
        }, {
            cond: (ctx, event) => event.position === "center",
            actions: ["setModalContent", "sendLayoutChanged"]
        }],
        CLOSED: {
            cond: (ctx, event) => event.position === "center",
            actions: ["setModalIsOpen", "sendLayoutChanged"]
        },
        OPENED: {
            cond: (ctx, event) => event.position === "center",
            actions: ["setModalIsOpen", "sendLayoutChanged"]
        }
    },
    states: {
        empty: {
            entry: [
                () => console.log("Spawning dialog actors .."),
                assign({
                    _mainDialog: () => spawn(dialogMachine.withContext({position: "main", _backStack: null})) ,
                    _leftDialog: () => spawn(dialogMachine.withContext({position: "left", _backStack: null})) ,
                    _centerDialog: () => spawn(dialogMachine.withContext({position: "center", _backStack: null})) ,
                    _rightDialog: () => spawn(dialogMachine.withContext({position: "right", _backStack: null}))
                })
            ],
            on: {
                URL_CHANGED: {
                    target: "loadRuntimeDapp"
                }
            }
        },
        loadRuntimeDapp: {
            entry: () => console.log("loadRuntimeDapp"),
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
                    actions:[
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
            entry: [() => console.log("loadRoutable"), "findAndSetRoutable"],
            always: [{
                cond: "hasRoutable",
                target: "showPage"
            }, {
                cond: "noRoutable",
                target: "notFound"
            }]
        },
        showPage: {
            entry: () => console.log("showPage"),
            always: [{
                cond: "routableIsMainContent",
                actions: ["showRoutableAsMainContent", send({type: "CLOSE"}, {to: (ctx) => ctx._centerDialog})],
                target: "ready"
            }, {
                cond: "routableIsModalContent",
                actions: "showRoutableAsModalContent",
                target: "ready"
            }]
        },
        showProcess: {
            entry: send((ctx, event) => {
                return event;
            }, {to: (ctx) => ctx._centerDialog}),
            always: "ready"
        },
        notFound: {
            entry: ["showNotFound"],
            always: "ready"
        },
        ready: {
            on: {
                "URL_CHANGED": {
                    target: "loadRuntimeDapp"
                },
                "SHOW_PROCESS": {
                    target: "showProcess"
                },
                "PROCESS_STOPPED": {
                    actions: send({
                        type: "CLOSE"
                    }, {
                        to: (ctx) => ctx._centerDialog
                    })
                }
            }
        },
        error: {
            type: "final"
        }
    }
}, {
    guards: {
        isMobile: () => isMobile(),
        isDesktop: () => !isMobile(),
        routableIsMainContent: (ctx) => {
            if (!ctx.routable || !ctx.routable.routable)
                throw new Error(`The "routable" is not set on the context.`);
            if (ctx.routable.routable.type !== "page")
                throw new Error(`The "routable" is not of type "page" its a "${ctx.routable.routable.type}".`);

            return (<Page<any,any>>ctx.routable.routable).position !== "modal";
        },
        routableIsModalContent: (ctx) => {
            if (!ctx.routable || !ctx.routable.routable)
                throw new Error(`The "routable" is not set on the context.`);
            if (ctx.routable.routable.type !== "page")
                throw new Error(`The "routable" is not of type "page" its a "${ctx.routable.routable.type}".`);

            return (<Page<any,any>>ctx.routable.routable).position === "modal";
        },
        hasRuntimeDapp: (ctx) => !!ctx.runtimeDapp,
        noRuntimeDapp: (ctx) => !ctx.runtimeDapp,
        hasRoutable: (ctx) => {
            console.log("hasRoutable:", !!ctx.routable)
            return !!ctx.routable
        },
        noRoutable: (ctx) => !ctx.routable
    },
    services: {
        findAndSetRuntimeDapp: async (ctx, event) => {
            console.log("findAndSetRuntimeDapp:", event)
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
                console.log("findAndSetRoutable:", event)
                if (event.type != "URL_CHANGED")
                    throw new Error(`Expected a URL_CHANGED event but got ${event.type}.`);

                const findRouteResult = findRoutableByParams(ctx.runtimeDapp, event);
                if (!findRouteResult.found && ctx.runtimeDapp.defaultRoute) {
                    // If no routable could be found then look for a default in the dapp
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
        showNotFound: send(<SHOW_PAGE>{
            type: "SHOW_PAGE",
            page: {
                component: NotFound
            }
        }, {
            to: ctx => ctx._mainDialog
        }),
        openNavigation: send((ctx) => {
            console.log("openNavigation")
            if (!ctx.runtimeDapp)
                throw new Error(`The "runtimeDapp" is not set on the context.`);
            if (!ctx.routable)
                throw new Error(`The "routable" is not set on the context.`);

            return <SHOW_NAVIGATION>{
                type: "SHOW_NAVIGATION",
                runtimeDapp: ctx.runtimeDapp,
                currentRoutable: ctx.routable.routable
            }
        }, {
            to: (ctx) => ctx._leftDialog
        }),
        closeNavigation: send({
            type: "CLOSE"
        }, {
            to: (ctx) => ctx._leftDialog
        }),
        setMainContent:assign({
            layout: (ctx, event) => {
                console.log("setMainContent")
                if (event.type != "CONTENT_CHANGED")
                    throw new Error(`Expected a CONTENT_CHANGED event but got ${event.type}.`);
                if (event.position !== "main")
                    throw new Error(`Expected a CONTENT_CHANGED event with position "main" but got ${event.position}.`);

                return <RuntimeLayout>{
                    ...ctx.layout,
                    main: {
                        ...event.content,
                        runtimeDapp: ctx.runtimeDapp,
                        routable: ctx.routable.routable,
                        params: event.content.params
                    }
                };
            }
        }),
        setModalIsOpen: assign({
            layout: (ctx, event) => {
                console.log("setModalIsOpen", event)
                if (event.type != "OPENED" && event.type != "CLOSED")
                    throw new Error(`Expected one of OPENED, CLOSED events but got ${event.type}.`);
                if (event.position !== "center")
                    throw new Error(`Expected one of OPENED, CLOSED events with position "center" but got ${event.position}.`);

                console.log("setModalIsOpen->currentLayout:", ctx.layout);

                const newLayut = <RuntimeLayout>{
                    ...ctx.layout,
                    dialogs: {
                        ...ctx.layout.dialogs,
                        center:{
                            ...ctx.layout.dialogs.center,
                            isOpen: event.type === "OPENED"
                        }
                    }
                };

                console.log("setModalIsOpen->newLayout:", newLayut);

                return newLayut;
            }
        }),
        setModalContent:assign({
            layout: (ctx, event) => {
                console.log("setModalContent", event)

                if (event.type != "CONTENT_CHANGED")
                    throw new Error(`Expected a CONTENT_CHANGED event but got ${event.type}.`);
                if (event.position !== "center")
                    throw new Error(`Expected a CONTENT_CHANGED event with position "center" but got ${event.position}.`);

                console.log("setModalContent->currentLayout:", ctx.layout);
                const newLayout = <RuntimeLayout>{
                    ...ctx.layout,
                    dialogs: {
                        ...ctx.layout.dialogs,
                        center:{
                            ...ctx.layout.dialogs.center,
                            ...event.content
                        }
                    }
                };
                console.log("setModalContent->newLayout:", newLayout);
                return newLayout;
            }
        }),
        showRoutableAsMainContent: (ctx) => {
            console.log("showRoutableAsMainContent")
            if (!ctx.runtimeDapp)
                throw new Error(`The "runtimeDapp" is not set on the context.`);
            if (!ctx.routable)
                throw new Error(`The "routable" is not set on the context.`);

            ctx._mainDialog.send(<SHOW_PAGE>{
                type: "SHOW_PAGE",
                runtimeDapp: ctx.runtimeDapp,
                routable: ctx.routable.routable,
                page: <Page<any, any>>ctx.routable.routable,
                params: ctx.routable.params
            });
        } ,
        showRoutableAsModalContent: send((ctx) => {
            console.log("showRoutableAsModalContent")
            if (!ctx.runtimeDapp)
                throw new Error(`The "runtimeDapp" is not set on the context.`);
            if (!ctx.routable)
                throw new Error(`The "routable" is not set on the context.`);

            return <SHOW_PAGE>{
                type: "SHOW_PAGE",
                runtimeDapp: ctx.runtimeDapp,
                routable: ctx.routable.routable,
                page: <Page<any, any>>ctx.routable.routable,
                params: ctx.routable.params
            }
        }, {
            to: (ctx) => ctx._centerDialog
        }),
        sendLayoutChanged: send((ctx) => {
            console.log("sendLayoutChanged")
            return {
                type: "LAYOUT_CHANGED",
                layout: ctx.layout
            }
        })
    }
});