import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import NotificationViewer from "@o-platform/o-editors/src/NotificationViewer.svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { ProfileEvent } from "../../dapps/o-banking/data/api/types";
import { AcknowledgeDocument } from "../../dapps/o-chat/data/api/types";
import HtmlViewer from "../../../../packages/o-editors/src/HtmlViewer.svelte";
import { inbox } from "../stores/inbox";
import EditorView from "../../../../packages/o-editors/src/shared/EditorView.svelte";

export type ShowNotificationsContextData = {
  events: ProfileEvent[];
  currentEventIndex: number;
  currentEvent: ProfileEvent;
};

const strings = {
  PROFILE_OUTGOING_TRUST_REVOKED: "Trust revoked",
  PROFILE_OUTGOING_TRUST: "Trusted",
  PROFILE_INCOMING_UBI: "Received new income",
};
export type ShowNotificationsContext =
  ProcessContext<ShowNotificationsContextData>;

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
        component: EditorView,
        field: "currentEvent",
        params: (context: any) => {
          return {
            view: {
              title: strings[context.data.currentEvent.type],
              description: "",
              mainComponent: NotificationViewer,
            },
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
            await inbox.acknowledge(context.data.currentEvent.id);
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
