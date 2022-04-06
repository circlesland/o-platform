import { assign, createMachine, send, sendParent } from "xstate";
import { NavigationElement } from "@o-platform/o-interfaces/dist/navigationManifest";
import LinkComponent from "../../../shared/molecules/NextNav/Components/Link.svelte";

export type ToggleButtonContext = {
  isHidden?: boolean;
  element?: NavigationElement;
  button: any;
  position: string;
  icons: { on: string; off: string };
};

export type NAV_ELEMENT_CHANGED = {
  type: "NAV_ELEMENT_CHANGED";
  position: string;
  element: NavigationElement;
};

export type ToggleButtonEvent =
  | {
      type: "TOGGLE";
    }
  | {
      type: "OFF";
      position: string;
    }
  | {
      type: "ON";
      position: string;
    }
  | {
      type: "HIDE";
    }
  | {
      type: "HIDDEN";
    }
  | {
      type: "SHOW";
    }
  | {
      type: "VISIBLE";
    }
  | NAV_ELEMENT_CHANGED;

export const navigationToggleButton = createMachine<ToggleButtonContext, ToggleButtonEvent>(
  {
    context: {
      position: null,
      isHidden: null,
      button: LinkComponent,
      element: {
        component: LinkComponent,
        props: {
          icon: "menu",
        },
      },
      icons: {
        on: "buttonleftarrow",
        off: "menu",
      },
    },
    on: {
      HIDE: "hidden",
      SHOW: "visible",
    },
    initial: "visible",
    states: {
      visible: {
        entry: [
          (ctx) => console.log(`entry: navigationToggleButton.${ctx.position}.visible`),
          "setVisibleNavigationElement",
          "sendVisible",
        ],
        initial: "off",
        states: {
          on: {
            entry: ["setOnNavigationElement", "sendOn", "sendElementChanged"],
            on: {
              TOGGLE: "off",
            },
          },
          off: {
            entry: ["setOffNavigationElement", "sendOff", "sendElementChanged"],
            on: {
              TOGGLE: "on",
            },
          },
          hist: {
            type: "history",
            history: "shallow",
          },
        },
      },
      hidden: {
        entry: [
          (ctx) => console.log(`entry: navigationToggleButton.${ctx.position}.hidden`),
          "setHiddenNavigationElement",
          "sendElementChanged",
        ],
        on: {
          SHOW: "visible.hist",
        },
      },
    },
  },
  {
    actions: {
      sendOn: sendParent((ctx) => {
        console.log("SENDING ON");
        return { type: "ON", position: ctx.position };
      }),
      sendOff: sendParent((ctx) => {
        console.log("SENDING OFF");
        return { type: "OFF", position: ctx.position };
      }),
      sendHidden: sendParent({ type: "HIDDEN" }),
      sendVisible: sendParent({ type: "VISIBLE" }),
      setOnNavigationElement: assign({
        element: (ctx, event) => {
          return {
            component: ctx.button,
            props: {
              icon: ctx.icons.on,
              action: () =>
                window.o.publishEvent(<any>{
                  type: `shell.navigation.${ctx.position}.click`,
                }),
            },
          };
        },
      }),
      setOffNavigationElement: assign({
        element: (ctx, event) => {
          return {
            component: ctx.button,
            props: {
              icon: ctx.icons.off,
              action: () =>
                window.o.publishEvent(<any>{
                  type: `shell.navigation.${ctx.position}.click`,
                }),
            },
          };
        },
      }),
      sendElementChanged: sendParent((ctx) => {
        return {
          type: "NAV_ELEMENT_CHANGED",
          element: ctx.element,
          position: ctx.position,
        };
      }),
      setVisibleNavigationElement: assign({
        element: (ctx) => ctx.element,
      }),
      setHiddenNavigationElement: assign({
        element: (ctx) => ctx.element,
      }),
    },
  }
);
