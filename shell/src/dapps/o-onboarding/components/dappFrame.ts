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
import {NavigationManifest} from "@o-platform/o-interfaces/dist/navigationManifest";
import {ELEMENT_CHANGED, navigationToggleButton} from "./navigationToggleButton";
import NavigationList from "../views/NavigationList.svelte";
import FilterList from "../views/FilterList.svelte";
import QuickActions from "../views/QuickActions.svelte";
import LinkComponent from "../../../shared/molecules/NextNav/Components/Link.svelte";
import ActionButton from "../../../shared/molecules/NextNav/Components/ActionButton.svelte";

export type DappFrameStateContext = {
    _mainDialog: any;
    _leftDialog: any;
    _centerDialog: any;
    _rightDialog: any;

    _leftNavButton: any;
    _centerNav: any;
    _rightNavButton: any;

    runtimeDapp: RuntimeDapp<any>;
    routable: FindRouteResult;

    layout: any;
    navigation: NavigationManifest;
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
} | {
    type: "NAVIGATION_CHANGED",
    position: "left" | "center" | "right",
    navigation: NavigationManifest
} | SHOW_PROCESS | {
    type: "PROCESS_STOPPED"
} | {
    type: "CLOSED",
    position: string
} | {
    type: "OPENED",
    position: string
} | ELEMENT_CHANGED | {
    type: "NAVIGATION_CLICK",
    position: "left" | "center" | "right"
}

export const dappFrame = createMachine<DappFrameStateContext, DappFrameStateEvent>({
    initial: "empty",
    context: {
        _mainDialog: null,
        _leftDialog: null,
        _centerDialog: null,
        _rightDialog: null,

        _leftNavButton: null,
        _centerNav: null,
        _rightNavButton: null,

        runtimeDapp: null,
        routable: null,

        layout: {
            main: undefined,
            dialogs: {
                left: undefined,
                center: undefined,
                right: undefined
            }
        },
        navigation: null
    },
    on: {
        CONTENT_CHANGED: [{
            cond: (ctx, event) => event.position === "main",
            actions: ["setMainContent", "sendLayoutChanged"]
        }, {
            cond: (ctx, event) => event.position === "center",
            actions: ["setCenterContent", "sendLayoutChanged"]
        }, {
            cond: (ctx, event) => event.position === "left",
            actions: ["setLeftContent", "sendLayoutChanged"]
        }],
        ELEMENT_CHANGED: [{
            cond: (ctx, event) => event.position === "left",
            actions: ["setLeftNav", "sendNavigationChanged"]
        },{
            cond: (ctx, event) => event.position === "right",
            actions: ["setRightNav", "sendNavigationChanged"]
        },{
            cond: (ctx, event) => event.position === "center",
            actions: ["setCenterNav", "sendNavigationChanged"]
        }],
        CLOSED: {
            cond: (ctx, event) => event.position === "center",
            actions: ["setModalIsOpen", "sendLayoutChanged"]
        },
        OPENED: {
            cond: (ctx, event) => event.position === "center",
            actions: ["setModalIsOpen", "sendLayoutChanged"]
        },
        NAVIGATION_CLICK: [{
            cond: (ctx, event) => {
                return event.position === "left"
            },
            actions: [send({type: "TOGGLE"}, {to: (ctx) => ctx._leftNavButton})]
        }, {
            cond: (ctx, event) => {
                return event.position === "center"
            },
            actions: [send({type: "TOGGLE"}, {to: (ctx) => ctx._centerNav})]
        }, {
            cond: (ctx, event) => {
                return event.position === "right"
            },
            actions: [send({type: "TOGGLE"}, {to: (ctx) => ctx._rightNavButton})]
        }],
        NAVIGATION_CHANGED: [{
            cond: (ctx, event) => {
                return event.position === "left"
            },
            actions: [send((ctx) => {
                return {
                    type: "SHOW_PAGE",
                    page: {
                        component: NavigationList
                    },
                    params: {},
                    routable: ctx.routable,
                    runtimeDapp: ctx.runtimeDapp
                }
            }, {
                to: (ctx) => ctx._leftDialog
            })]
        },{
            cond: (ctx, event) => {
                return event.position === "center"
            },
            actions: [send((ctx) => {
                return {
                    type: "SHOW_PAGE",
                    page: {
                        component: QuickActions
                    },
                    params: {},
                    routable: ctx.routable,
                    runtimeDapp: ctx.runtimeDapp
                }
            }, {
                to: (ctx) => ctx._centerDialog
            })]
        },{
            cond: (ctx, event) => {
                return event.position === "right"
            },
            actions: [send((ctx) => {
                return {
                    type: "SHOW_PAGE",
                    page: {
                        component: FilterList
                    },
                    params: {},
                    routable: ctx.routable,
                    runtimeDapp: ctx.runtimeDapp
                }
            }, {
                to: (ctx) => ctx._rightDialog
            })]
        },]
    },
    states: {
        empty: {
            entry: [
                () => console.log("Spawning dialog actors .."),
                assign({
                    _mainDialog: () => spawn(dialogMachine.withContext({position: "main", _backStack: null})),
                    _leftDialog: () => spawn(dialogMachine.withContext({position: "left", _backStack: null})),
                    _centerDialog: () => spawn(dialogMachine.withContext({position: "center", _backStack: null})),
                    _rightDialog: () => spawn(dialogMachine.withContext({position: "right", _backStack: null})),
                    _leftNavButton: () => spawn(navigationToggleButton.withContext({
                        position: "left",
                        icons: {off: "list", on: "buttonleftarrow"},
                        button: LinkComponent
                    }), {
                        sync: true
                    }),
                    _centerNav: () => spawn(navigationToggleButton.withContext({
                        position: "center",
                        icons: {off: "actionButton", on: "close"},
                        button: ActionButton
                    }), {
                        sync: true
                    }),
                    _rightNavButton: () => spawn(navigationToggleButton.withContext({
                        position: "right",
                        icons: {off: "list", on: "buttonrightarrow"},
                        button: LinkComponent
                    }), {
                        sync: true
                    })
                })
            ],
            on: {
                URL_CHANGED: {
                    target: "loadRuntimeDapp"
                }
            }
        },
        loadRuntimeDapp: {
            entry: [() => console.log("loadRuntimeDapp"),/*
                ctx => {
                    if (!isMobile()) {
                        send({
                            type: "TOGGLE"
                        }, {
                            to: ctx._leftNavButton
                        })
                    }
                }*/],
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

            return (<Page<any, any>>ctx.routable.routable).position !== "modal";
        },
        routableIsModalContent: (ctx) => {
            if (!ctx.routable || !ctx.routable.routable)
                throw new Error(`The "routable" is not set on the context.`);
            if (ctx.routable.routable.type !== "page")
                throw new Error(`The "routable" is not of type "page" its a "${ctx.routable.routable.type}".`);

            return (<Page<any, any>>ctx.routable.routable).position === "modal";
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
        setMainContent: assign({
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

                const newLayout = <RuntimeLayout>{
                    ...ctx.layout,
                    dialogs: {
                        ...ctx.layout.dialogs,
                        center: {
                            ...ctx.layout.dialogs.center,
                            isOpen: event.type === "OPENED"
                        }
                    }
                };

                console.log("setModalIsOpen->newLayout:", newLayout);

                return newLayout;
            }
        }),
        setCenterContent: assign({
            layout: (ctx, event) => {
                console.log("setCenterContent", event)

                if (event.type != "CONTENT_CHANGED")
                    throw new Error(`Expected a CONTENT_CHANGED event but got ${event.type}.`);
                if (event.position !== "center")
                    throw new Error(`Expected a CONTENT_CHANGED event with position "center" but got ${event.position}.`);

                console.log("setCenterContent->currentLayout:", ctx.layout);
                const newLayout = <RuntimeLayout>{
                    ...ctx.layout,
                    dialogs: {
                        ...ctx.layout.dialogs,
                        center: {
                            ...ctx.layout.dialogs.center,
                            ...event.content,
                            isOpen: ctx._centerNav.state.value && ctx._centerNav.state.value.visible === "on"
                        }
                    }
                };
                console.log("setCenterContent->newLayout:", newLayout);
                return newLayout;
            }
        }),
        setLeftContent: assign({
            layout: (ctx, event) => {
                console.log("setLeftContent", event)

                if (event.type != "CONTENT_CHANGED")
                    throw new Error(`Expected a CONTENT_CHANGED event but got ${event.type}.`);
                if (event.position !== "left")
                    throw new Error(`Expected a CONTENT_CHANGED event with position "left" but got ${event.position}.`);

                console.log("setLeftContent->currentLayout:", ctx.layout);
                const newLayout = <RuntimeLayout>{
                    ...ctx.layout,
                    dialogs: {
                        ...ctx.layout.dialogs,
                        left: {
                            ...ctx.layout.dialogs.left,
                            ...event.content,
                            isOpen: ctx._leftNavButton.state.value && ctx._leftNavButton.state.value.visible === "on"
                        }
                    }
                };
                console.log("setLeftContent->newLayout:", newLayout);
                return newLayout;
            }
        }),
        setRightContent: assign({
            layout: (ctx, event) => {
                console.log("setRightContent", event)

                if (event.type != "CONTENT_CHANGED")
                    throw new Error(`Expected a CONTENT_CHANGED event but got ${event.type}.`);
                if (event.position !== "right")
                    throw new Error(`Expected a CONTENT_CHANGED event with position "right" but got ${event.position}.`);

                console.log("setRightContent->currentLayout:", ctx.layout);
                const newLayout = <RuntimeLayout>{
                    ...ctx.layout,
                    dialogs: {
                        ...ctx.layout.dialogs,
                        right: {
                            ...ctx.layout.dialogs.right,
                            ...event.content,
                            isOpen: ctx._rightNavButton.state.value && ctx._rightNavButton.state.value.visible === "on"
                        }
                    }
                };
                console.log("setRightContent->newLayout:", newLayout);
                return newLayout;
            }
        }),
        setLeftNav: assign({
            navigation: (ctx, event) => {
                if (event.type != "ELEMENT_CHANGED")
                    throw new Error(`Expected a ELEMENT_CHANGED event but got ${event.type}.`);
                if (event.position !== "left")
                    throw new Error(`Expected a ELEMENT_CHANGED event with position "left" but got ${event.position}.`);

                const newNav:NavigationManifest = {
                    ...ctx.navigation,
                    leftSlot: event.element
                };

                return newNav;
            }
        }),
        setRightNav: assign({
            navigation: (ctx, event) => {
                if (event.type != "ELEMENT_CHANGED")
                    throw new Error(`Expected a ELEMENT_CHANGED event but got ${event.type}.`);
                if (event.position !== "right")
                    throw new Error(`Expected a ELEMENT_CHANGED event with position "right" but got ${event.position}.`);

                const newNav:NavigationManifest = {
                    ...ctx.navigation,
                    rightSlot: event.element
                };
                return newNav;
            }
        }),
        setCenterNav: assign({
            navigation: (ctx, event) => {
                if (event.type != "ELEMENT_CHANGED")
                    throw new Error(`Expected a ELEMENT_CHANGED event but got ${event.type}.`);
                if (event.position !== "center")
                    throw new Error(`Expected a ELEMENT_CHANGED event with position "center" but got ${event.position}.`);

                const newNav:NavigationManifest = {
                    ...ctx.navigation,
                    navPill: {
                        center: event.element
                    }
                };
                return newNav;
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
        },
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
        }),
        sendNavigationChanged: send((ctx, event:any) => {
            console.log("sendNavigationChanged")
            return {
                type: "NAVIGATION_CHANGED",
                navigation: ctx.navigation,
                position: event.position
            }
        })
    }
});