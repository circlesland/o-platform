import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import NotificationViewer from "./../NotificationViewer.svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { inbox } from "../stores/inbox";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import { EventType, ProfileEvent } from "../api/data/types";
import { push } from "svelte-spa-router";

export type ShowNotificationsContextData = {
  events: ProfileEvent[];
  currentEventIndex: number;
  currentEvent: ProfileEvent;
};

let strings = {};
export type ShowNotificationsContext = ProcessContext<ShowNotificationsContextData>;

const editorContent: { [x: string]: EditorViewContext } = {
  showNotifications: {
    title: window.i18n("shared.processes.showNotifications.editorContent.title"),
    description: "",
    placeholder: "",
    submitButtonText: window.i18n("shared.processes.showNotifications.editorContent.submitButtonText"),
  },
};

const processDefinition = (processId: string) =>
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
          strings = {
            CrcHubTransfer: window.i18n("shared.processes.showNotifications.strings.crcHubTransfer"),
            CrcTrust: window.i18n("shared.processes.showNotifications.strings.crcTrust"),
            CrcUntrust: window.i18n("shared.processes.showNotifications.strings.crc_untrust"),
            ChatMessage: window.i18n("shared.processes.showNotifications.strings.chatMessage"),
            CrcMinting: window.i18n("shared.processes.showNotifications.strings.crcMinting"),
            MembershipOffer: window.i18n("shared.processes.showNotifications.strings.membershipOffer"),
            InvitationCreated: "",
            MembershipAccepted: window.i18n("shared.processes.showNotifications.strings.membershipAccepted"),
          };
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
            context.data.currentEvent = context.data.events[context.data.currentEventIndex];
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
            context.data.currentEvent = context.data.events[context.data.currentEventIndex];
          },
          onDone: [
            {
              cond: (context) => context.data.currentEvent !== undefined,
              target: "#show",
            },
            {
              cond: (context) => context.data.currentEvent === undefined,
              target: "#success",
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
          let title =
            context.data.currentEvent.type == EventType.CrcTrust && context.data.currentEvent.payload.limit == 0
              ? "CrcUntrust"
              : context.data.currentEvent.type;
          return {
            view: {
              title: strings[title],
              titleClass: "",
              description: "",
              placeholder: "",
              submitButtonText: window.i18n("shared.processes.showNotifications.submitButtonText"),
            },
            push: (target) => push(target),
          };
        },
        navigation: {
          canGoBack: (context: any) => context.data.currentEventIndex > 0,
          canSkip: () => false,
          next: [
            {
              target: "#acknowledge",
            },
          ],
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
          onDone: {
            actions: (context) => {
              context.dirtyFlags = {
                ...context.dirtyFlags,
                events: false,
                currentEvent: false,
                currentEventIndex: false,
              };
            },
            target: "#fetchNext",
          },
          onError: "#error",
        },
      },
      error: {
        type: "final",
        id: "error",
        entry: (context) => console.error(`error entry`, context.data),
      },
      success: {
        type: "final",
        id: "success",
        data: (context, event: PlatformEvent) => {
          return window.i18n("shared.processes.showNotifications.yeah");
        },
      },
    },
  });

export const showNotifications: ProcessDefinition<void, ShowNotificationsContext> = {
  name: "showNotifications",
  stateMachine: <any>processDefinition,
};
