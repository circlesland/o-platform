import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import ChoiceSelector from "@o-platform/o-editors/src/ChoiceSelector.svelte";
import { promptChoice } from "../../../o-passport/processes/identify/prompts/promptChoice";
import { UpsertProfileDocument } from "../../../../shared/api/data/types";

export type UpsertRegistrationContextData = {
  id?: number;
  emailAddress: string;
  askedForEmailAddress: string;
  firstName: string;
  avatarUrl: string;
  newsletter?: boolean;
  successAction?: (data: UpsertRegistrationContextData) => void;
  errorAction?: (data: UpsertRegistrationContextData) => void;
};

export type UpsertRegistrationContext = ProcessContext<UpsertRegistrationContextData>;

const editorContent: { [x: string]: EditorViewContext } = {
  newsletter: {
    title: window.o.i18n("dapps.o-onboarding.processes.registration.promptRegistration.editorContent.newsletter.title"),
    description: window.o.i18n(
      "dapps.o-onboarding.processes.registration.promptRegistration.editorContent.newsletter.description"
    ),
    placeholder: "",
    submitButtonText: "",
  },
};

const processDefinition = (processId: string) =>
  createMachine<UpsertRegistrationContext, any>({
    id: `${processId}:upsertRegistration`,
    initial: "upsertRegistration",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<UpsertRegistrationContext, any>("error"),

      newsletter: promptChoice<UpsertRegistrationContext, any>({
        id: "newsletter",
        component: ChoiceSelector,
        params: {
          view: (editorContent.newsletter = {
            title: window.o.i18n(
              "dapps.o-onboarding.processes.registration.promptRegistration.editorContent.newsletter.title"
            ),
            description: window.o.i18n(
              "dapps.o-onboarding.processes.registration.promptRegistration.editorContent.newsletter.description"
            ),
            placeholder: "",
            submitButtonText: "",
          }),
        },
        options: [
          {
            key: "dontSubscribe",
            label: window.o.i18n("dapps.o-onboarding.processes.registration.promptRegistration.noThanks"),
            target: "#upsertRegistration",
            action: (context) => {
              context.data.newsletter = false;
            },
          },
          {
            key: "subscribe",
            label: window.o.i18n("dapps.o-onboarding.processes.registration.promptRegistration.yesPlease"),
            target: "#upsertRegistration",
            action: (context) => {
              context.data.newsletter = true;
            },
          },
        ],
        navigation: {
          canGoBack: () => false,
        },
      }),
      upsertRegistration: {
        id: "upsertRegistration",
        entry: (context) => {
          console.log("upsertRegistration.entry:", context);
        },
        invoke: {
          src: async (context) => {
            const apiClient = await window.o.apiClient.client.subscribeToResult();

            const result = await apiClient.mutate({
              mutation: UpsertProfileDocument,
              variables: {
                id: context.data.id,
                emailAddress: context.data.emailAddress,
                askedForEmailAddress: false,
                firstName: context.data.firstName ?? "",
                avatarUrl: context.data.avatarUrl,
                newsletter: context.data.newsletter ?? false,
                status: "registered",
              },
            });
            return result.data.upsertProfile;
          },
          onDone: "#success",
          onError: "#error",
        },
      },
      success: {
        type: "final",
        id: "success",
        entry: (context) => {
          if (context.data.successAction) {
            context.data.successAction(context.data);
          }
        },
        data: () => true,
      },
    },
  });

export const upsertRegistration: ProcessDefinition<void, UpsertRegistrationContextData> = {
  name: "upsertRegistration",
  stateMachine: <any>processDefinition,
};

export const upsertRegistrationOnlyWhereDirty = {
  id: upsertRegistration.id,
  name: upsertRegistration.name,
  stateMachine: (processId?: string) => (<any>upsertRegistration).stateMachine(processId, true),
};
