import {actions, assign, createMachine, send, sendParent, spawn} from "xstate";
import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
import {Routable} from "@o-platform/o-interfaces/dist/routable";
import {Page} from "@o-platform/o-interfaces/dist/routables/page";
import {dialogBackStackMachine} from "./dialogBackStack";
import {Content, RuntimeContent} from "../layouts/layout";
import ProcessContainer from "../../../shared/molecules/ProcessContainer.svelte";
import {NavigationElement} from "@o-platform/o-interfaces/dist/navigationManifest";
import {isMobile} from "../../../shared/functions/isMobile";
import ListComponent from "../../../shared/molecules/NextNav/Components/List.svelte";

export type NavigationStateContext = {
    navigationElement: NavigationElement
}

export type NavigationStateEvent = {
    type: "shell.navigation.leftButton.click"
} | {
    type: "NAVIGATION_CHANGED"
    element: NavigationElement
}

export const leftNav = createMachine<NavigationStateContext, NavigationStateEvent>({
    initial: "initial",
    context: {
        navigationElement: null
    },
    states: {
        initial: {
            always: [{
                // On mobile (small devices): closed
                cond: "isMobile",
                target: "closed"
            },{
                // On desktop (large devices): open
                cond: "isDesktop",
                target: "open"
            }]
        },
        open: {
            entry: ["setOpenElement", "sendNavigationChanged"],
            on: {
                "shell.navigation.leftButton.click": {
                    target: "closed"
                }
            }
        },
        closed: {
            entry: ["setClosedElement", "sendNavigationChanged"],
            on: {
                "shell.navigation.leftButton.click": {
                    target: "open"
                }
            }
        }
    }
}, {
    guards: {
        isMobile: () => isMobile(),
        isDesktop: () => !isMobile()
    },
    actions: {
        setOpenElement: assign({
            navigationElement: () => {
                return {
                    component: ListComponent,
                    props: {
                        icon: "back",
                        action: () => {
                            window.o.publishEvent({type: "shell.navigation.leftButton.click"})
                        }
                    }
                }
            }
        }),
        setClosedElement: assign({
            navigationElement: () => {
                return {
                    component: ListComponent,
                    props: {
                        icon: "list",
                        action: () => {
                            window.o.publishEvent({type: "shell.navigation.leftButton.click"})
                        },
                    }
                }
            }
        }),
        sendNavigationChanged: send(ctx => {
            return {
                type: "NAVIGATION_CHANGED",
                element: ctx.navigationElement
            }
        })
    }
});
export const rightNav = createMachine<NavigationStateContext, NavigationStateEvent>({
    initial: "initial",
    context: {
        navigationElement: null
    },
    states: {
        initial: {}
    }
});
export const centerNav = createMachine<NavigationStateContext, NavigationStateEvent>({
    initial: "initial",
    context: {
        navigationElement: null
    },
    states: {
        initial: {}
    }
});

export const navigationMachine = createMachine<NavigationStateContext, NavigationStateEvent>({
    initial: "closed",
    context: {
        navigationElement: null
    },
    states: {
        closed: {
        }
    }
});