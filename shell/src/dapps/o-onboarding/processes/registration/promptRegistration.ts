import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import ChoiceSelector from "@o-platform/o-editors/src/ChoiceSelector.svelte";
import {promptChoice} from "../../../o-passport/processes/identify/prompts/promptChoice";
import {UpsertProfileDocument} from "../../../../shared/api/data/types";

export type UpsertRegistrationContextData = {
  id?: number;
  newsletter?: boolean;
  successAction?: (data:UpsertRegistrationContextData) => void;
  errorAction?: (data:UpsertRegistrationContextData) => void;
};

export type UpsertRegistrationContext = ProcessContext<UpsertRegistrationContextData>;

const editorContent: { [x: string]: EditorViewContext } = {
  newsletter: {
    title: "Newsletter",
    description:
      "Do you want to subscribe to our monthly newsletter to stay up to date with the developments around the basic income economy?",
    placeholder: "",
    submitButtonText: "",
  },
};

const processDefinition = (processId: string, skipIfNotDirty?: boolean) =>
  createMachine<UpsertRegistrationContext, any>({
    id: `${processId}:upsertRegistration`,
    initial: "newsletter",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<UpsertRegistrationContext, any>("error"),

      newsletter: promptChoice<UpsertRegistrationContext, any>({
        id: "newsletter",
        component: ChoiceSelector,
        params: { view: editorContent.newsletter },
        onlyWhenDirty: skipIfNotDirty,
        options: [
          {
            key: "dontSubscribe",
            label: "No thanks",
            target: "#upsertRegistration",
            action: (context) => {
              context.data.newsletter = false;
            },
          },
          {
            key: "subscribe",
            label: "Yes please",
            target: "#upsertRegistration",
            action: (context) => {
              context.data.newsletter = true;
            },
          },
        ],
        navigation: {
          canGoBack: () => false
        },
      }),
      upsertRegistration: {
        id: "upsertRegistration",
        invoke: {
          src: async (context) => {
            const apiClient =
              await window.o.apiClient.client.subscribeToResult();

            const result = await apiClient.mutate({
              mutation: UpsertProfileDocument,
              variables: {
                id: context.data.id,
                firstName: "",
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
        }
      },
    },
  });

export const upsertRegistration: ProcessDefinition<
  void,
  UpsertRegistrationContextData
  > = {
  name: "upsertRegistration",
  stateMachine: <any>processDefinition,
};

export const upsertRegistrationOnlyWhereDirty = {
  id: upsertRegistration.id,
  name: upsertRegistration.name,
  stateMachine: (processId?: string) =>
    (<any>upsertRegistration).stateMachine(processId, true),
};
