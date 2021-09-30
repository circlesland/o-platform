import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import NotificationViewer from "@o-platform/o-editors/src/NotificationViewer.svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import HtmlViewer from "../../../../packages/o-editors/src/HtmlViewer.svelte";
import { inbox } from "../stores/inbox";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import { ProfileEvent } from "../api/data/types";
import { push } from "svelte-spa-router";

export type ShowNotificationsContextData = {
  events: ProfileEvent[];
  currentEventIndex: number;
  currentEvent: ProfileEvent;
};

const strings = {
  crc_hub_transfer: "Received",
  crc_trust: "New incoming trust",
  chat_message: "New incoming Chat Message",
  crc_minting: "Received new Basic Income",
};
export type ShowNotificationsContext =
  ProcessContext<ShowNotificationsContextData>;

const editorContent: { [x: string]: EditorViewContext } = {
  showNotifications: {
    title: "What is your first name?",
    description: "",
    placeholder: "",
    submitButtonText: "OK",
  },
};

const processDefinition = (processId: string, skipIfNotDirty?: boolean) =>
  createMachine<ShowNotificationsContext, any>({
    id: `${processId}:showNotifications`,
    initial: "init",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<ShowNotificationsContext, any>("error"),
      init: {
        entry: (context) => {
          context.data.currentEventIndex = -1;
          context.data.currentEvent = undefined;
        },
        always: "#fetchNext",
      },
      fetchPrevious: {
        id: "fetchPrevious",
        invoke: {
          src: async (context) => {
            if (context.data.currentEventIndex < 1) {
              return;
            }
            context.data.currentEventIndex--;
            context.data.currentEvent =
              context.data.events[context.data.currentEventIndex];
          },
          onDone: "#show",
        },
      },
      fetchNext: {
        id: "fetchNext",
        invoke: {
          src: async (context) => {
            if (context.data.currentEventIndex >= context.data.events.length) {
              return;
            }
            context.data.currentEventIndex++;
            context.data.currentEvent =
              context.data.events[context.data.currentEventIndex];
          },
          onDone: [
            {
              cond: (context) => context.data.currentEvent !== undefined,
              target: "#show",
            },
            {
              cond: (context) => context.data.currentEvent === undefined,
              target: "#showSuccess",
            },
          ],
        },
      },
      show: prompt({
        id: "show",
        entry: () => console.log("show entry"),
        component: NotificationViewer,
        field: "currentEvent",
        params: (context: any) => {
          return {
            view: {
              title: strings[context.data.currentEvent.type],
              description: "",
              placeholder: "",
              submitButtonText: "OK",
            },
            push: (target) => push(target),
          };
        },
        navigation: {
          canGoBack: (context: any) => context.data.currentEventIndex > 0,
          canSkip: () => false,
          next: "#acknowledge",
          previous: "#fetchPrevious",
        },
      }),
      acknowledge: {
        id: "acknowledge",
        entry: () => console.log("acknowledge entry"),
        invoke: {
          src: async (context) => {
            await inbox.acknowledge(context.data.currentEvent);
          },
          onDone: "#fetchNext",
          onError: "#error",
        },
      },
      error: {
        type: "final",
        id: "error",
        entry: (context) => console.error(`error entry`, context.data),
      },
      showSuccess: prompt({
        id: "showSuccess",
        field: "__",
        component: HtmlViewer,
        params: {
          html: () => `<p>All done.</p>`,
          submitButtonText: "Close",
          hideNav: false,
        },
        navigation: {
          canGoBack: (context: any) => context.data.currentEventIndex > 0,
          canSkip: () => false,
          next: "#success",
          previous: "#fetchPrevious",
        },
      }),
      success: {
        type: "final",
        id: "success",
        data: (context, event: PlatformEvent) => {
          return "yeah!";
        },
      },
    },
  });

export const showNotifications: ProcessDefinition<
  void,
  ShowNotificationsContext
> = {
  name: "showNotifications",
  stateMachine: <any>processDefinition,
};
