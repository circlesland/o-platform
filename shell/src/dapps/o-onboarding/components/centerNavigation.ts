import {assign, createMachine, sendParent} from "xstate";
import {NavigationElement} from "@o-platform/o-interfaces/dist/navigationManifest";
import LinkComponent from "../../../shared/molecules/NextNav/Components/Link.svelte";

export type CenterNavigationContext = {
    isHidden?: boolean;
    element?: NavigationElement;
    position: string;
    icons: { on: string, off: string }
};

export type CenterNavigationEvent = {
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
};

export const navigationCenterNavigation = createMachine<CenterNavigationContext, CenterNavigationEvent>({
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
            entry: "sendVisible",
            initial: "off",
            states: {
                on: {
                    entry: ["setOnNavigationElement", "sendOn"],
                    on: {
                        TOGGLE: "off"
                    }
                },
                off: {
                    entry: ["setOnNavigationElement", "sendOff"],
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
            entry: "sendHidden",
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
                        icon: ctx.icons.on
                    }
                };
            }
        }),
        setOffNavigationElement: assign({
            element: (ctx, event) => {
                return {
                    component: LinkComponent,
                    props: {
                        icon: ctx.icons.off
                    }
                };
            }
        })
    }
});