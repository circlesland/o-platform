import {
  actions,
  assign,
  createMachine,
  send,
  sendParent,
  spawn,
} from "xstate";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { dialogBackStackMachine } from "./dialogBackStack";
import { Content, RuntimeContent } from "../layouts/layout";
import NavigationList from "../views/NavigationList.svelte";
import ProcessContainer from "../../../shared/molecules/ProcessContainer.svelte";
import { getRouteList } from "../../../shared/functions/getRouteList";

export type DialogStateContext = {
  backStackSize?: number;
  position: string;
  content?: Content;

  currentRoutable?: Routable;
};

export type SET_CONTENT = {
  type: "SET_CONTENT";
  runtimeDapp: RuntimeDapp<any>;
  page: Page<any, any>;
  params: { [x: string]: any };
  routable: Routable;
};

export type CONTENT_ELEMENT_CHANGED = {
  type: "CONTENT_ELEMENT_CHANGED";
  position: string;
  content: RuntimeContent;
};

export type DialogStateEvent =
  | SET_CONTENT
  | {
      type: "CLOSE";
    }
    | {
    type: "OPEN";
  }
    | {
    type: "CLOSED";
  }
  | {
      type: "OPENED";
    }
  | {
      type: "ERROR";
      error: Error;
    }
  | CONTENT_ELEMENT_CHANGED;

export const dialogMachine = createMachine<
  DialogStateContext,
  DialogStateEvent
>(
  {
    initial: "closed",
    context: {
      backStackSize: 0,
      position: null,
    },
    states: {
      closed: {
        entry: ["sendClosed"],
        on: {
          SET_CONTENT: {
            actions: ["setContent", "sendContentChanged"]
          },
          OPEN: {
            target: "open"
          }
        },
      },
      open: {
        entry: ["sendOpened"],
        on: {
          SET_CONTENT: {
            actions: ["setContent", "sendContentChanged"],
            target: "open",
          },
          CLOSE: {
            target: "closed",
          },
        },
      },
      error: {
        type: "final",
      },
    },
  },
  {
    actions: {
      setContent: assign({
        content: (ctx, event) => {
          if (event.type !== "SET_CONTENT")
            throw new Error(
              `Expected a SET_CONTENT event but got ${event.type}.`
            );

          // All other properties of the "Page" in the event must
          // have been handled by now. The dialog only cares about the component and params.
          return <RuntimeContent>{
            component: event.page.component,
            params: event.params,
            routable: event.routable,
            runtimeDapp: event.runtimeDapp,
          };
        },
      }),
      sendContentChanged: sendParent((ctx) => {
        return {
          type: "CONTENT_ELEMENT_CHANGED",
          content: ctx.content,
          position: ctx.position,
        };
      }),
      sendOpened: sendParent((ctx) => {
        return { type: "OPENED", position: ctx.position };
      }),
      sendClosed: sendParent((ctx) => {
        return { type: "CLOSED", position: ctx.position };
      }),
    },
  }
);
