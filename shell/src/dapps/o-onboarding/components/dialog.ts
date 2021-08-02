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

export type SHOW_PAGE = {
  type: "SHOW_PAGE";
  runtimeDapp: RuntimeDapp<any>;
  page: Page<any, any>;
  params: { [x: string]: any };
  routable: Routable;
};

export type SHOW_PROCESS = {
  type: "SHOW_PROCESS";
  processId: string;
};

export type CONTENT_CHANGED = {
  type: "CONTENT_CHANGED";
  position: string;
  content: RuntimeContent;
};

export type DialogStateEvent =
  | SHOW_PAGE
  | SHOW_PROCESS
  | {
      type: "CLOSE";
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
  | CONTENT_CHANGED;

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
        entry: [
          // (ctx) => console.log(`Dialog '${ctx.position}' started.`),
          "sendClosed",
        ],
        on: {
          SHOW_PAGE: {
            actions: ["showPage"],
            target: "page",
          },
          SHOW_PROCESS: {
            target: "process",
          }
        },
      },
      page: {
        id: "page",
        entry: ["sendOpened", "sendContentChanged"],
        on: {
          SHOW_PAGE: {
            actions: ["showPage"],
            target: "page",
          },
          CLOSE: [
            {
              target: "closing",
            },
          ],
        },
      },
      process: {
        entry: ["showProcess", "sendContentChanged", "sendOpened"],
        on: {
          CLOSE: {
            target: "closing",
          },
        },
      },
      closing: {
        always: [{
            actions: "reset",
            target: "closed",
          },
        ],
      },
      error: {
        type: "final",
      },
    },
  },
  {
    actions: {
      reset: assign({
        content: (ctx) => undefined,
        currentRoutable: (ctx) => undefined,
        backStackSize: (ctx) => 0,
      }),
      showPage: assign({
        content: (ctx, event) => {
          if (event.type !== "SHOW_PAGE")
            throw new Error(
              `Expected a SHOW_PAGE event but got ${event.type}.`
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
      showProcess: assign({
        content: (ctx, event) => {
          if (event.type !== "SHOW_PROCESS")
            throw new Error(
              `Expected a SHOW_PROCESS event but got ${event.type}.`
            );

          const runningProcess = window.o.stateMachines.findById(
            event.processId
          );
          return <RuntimeContent>{
            component: <any>ProcessContainer,
            params: {
              process: runningProcess,
            },
          };
        },
      }),
      sendContentChanged: sendParent((ctx) => {
        return {
          type: "CONTENT_CHANGED",
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
