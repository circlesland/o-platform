import {assign, createMachine, send, sendParent} from "xstate";
import {NavigationElement} from "@o-platform/o-interfaces/dist/navigationManifest";
import LinkComponent from "../../../shared/molecules/NextNav/Components/Link.svelte";

export type ToggleButtonContext = {
    isHidden?: boolean;
    element?: NavigationElement;
    position: string;
    icons: { on: string, off: string }
};

export type ELEMENT_CHANGED = {
    type: "ELEMENT_CHANGED",
    position: string;
    element: NavigationElement
}

export type ToggleButtonEvent = {
    type: "TOGGLE"
} | {
    type: "OFF"
} | {
    type: "ON"
} | {
    type: "HIDE"
} | {
    type: "HIDDEN"
} | {
    type: "SHOW"
} | {
    type: "VISIBLE"
} | ELEMENT_CHANGED;

export const navigationToggleButton = createMachine<ToggleButtonContext, ToggleButtonEvent>({
    context: {
        position: null,
        isHidden: null,
        element: {
            component: LinkComponent,
            props: {
                icon: "list"
            }
        },
        icons: {
            on: "buttonleftarrow",
            off: "list"
        }
    },
    on: {
        HIDE: "hidden",
        SHOW: "visible"
    },
    initial: "visible",
    states: {
        visible: {
            entry: [(ctx) => console.log(`entry: navigationToggleButton.${ctx.position}.visible`), "setVisibleNavigationElement", "sendVisible"],
            initial: "off",
            states: {
                on: {
                    entry: ["setOnNavigationElement", "sendOn", "sendElementChanged"],
                    on: {
                        TOGGLE: "off"
                    }
                },
                off: {
                    entry: ["setOffNavigationElement", "sendOff", "sendElementChanged"],
                    on: {
                        TOGGLE: "on"
                    }
                },
                hist: {
                    type: 'history',
                    history: 'shallow'
                },
            }
        },
        hidden: {
            entry: [(ctx) => console.log(`entry: navigationToggleButton.${ctx.position}.hidden`), "setHiddenNavigationElement", "sendElementChanged"],
            on: {
                SHOW: "visible.hist"
            }
        }
    }
}, {
    actions: {
        sendOn: sendParent({type: "ON"}),
        sendOff: sendParent({type: "OFF"}),
        sendHidden: sendParent({type: "HIDDEN"}),
        sendVisible: sendParent({type: "VISIBLE"}),
        setOnNavigationElement: assign({
            element: (ctx, event) => {
                return {
                    component: LinkComponent,
                    props: {
                        icon: ctx.icons.on,
                        action: () => window.o.publishEvent(<any>{
                            type: `shell.navigation.${ctx.position}.click`
                        })
                    }
                };
            }
        }),
        setOffNavigationElement: assign({
            element: (ctx, event) => {
                return {
                    component: LinkComponent,
                    props: {
                        icon: ctx.icons.off,
                        action: () => window.o.publishEvent(<any>{
                            type: `shell.navigation.${ctx.position}.click`
                        })
                    }
                };
            }
        }),
        sendElementChanged: sendParent((ctx) => {
            return {
                type: "ELEMENT_CHANGED",
                element: ctx.element,
                position: ctx.position
            }
        }),
        setVisibleNavigationElement: assign({
            element: (ctx) => ctx.element
        }),
        setHiddenNavigationElement: assign({
            element: (ctx) => ctx.element
        })
    }
});