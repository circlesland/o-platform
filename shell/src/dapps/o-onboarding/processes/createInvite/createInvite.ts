import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import * as yup from "yup";
import HtmlViewer from "../../../../../../packages/o-editors/src/HtmlViewer.svelte";
import {
  CreateInvitationsDocument
} from "../../../../shared/api/data/types";
import TextEditor from "../../../../../../packages/o-editors/src/TextEditor.svelte";
import {UpsertIdentityContext} from "../../../o-passport/processes/upsertIdentity";

export type PromptCreateInvitationContextData = {
  name: string;
  address: string;
  successAction?: (data:PromptCreateInvitationContextData) => void;
};

export type PromptCreateInvitationContext = ProcessContext<PromptCreateInvitationContextData>;

const editorContent = {
  info: {
    title: "Create an invitation",
    description:
      "An invitation is a code which you can give to your friends so that they can also join circles.",
    submitButtonText: "Next",
  },
  name: {
    title: "Who do you want to invite?",
    description:
      "Give your invitation a name to easier keep track of it.",
    placeholder: "",
    submitButtonText: "",
  },
};
const processDefinition = (processId: string) =>
  createMachine<PromptCreateInvitationContext, any>({
    id: `${processId}:promptCreateInvitation`,
    initial: "info",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<PromptCreateInvitationContext, any>("error"),

      info: prompt({
        id: "info",
        field: "__",
        component: HtmlViewer,
        params: {
          view: editorContent.info,
          html: () => "",
          hideNav: false,
        },
        navigation: {
          next: "#name",
        },
      }),
      name: prompt<UpsertIdentityContext, any>({
        field: "name",
        component: TextEditor,
        params: {
          view: editorContent.name,
        },
        dataSchema: yup.string().required("Please enter a name."),
        navigation: {
          next: "#createInvitation",
          previous: "#info",
          canSkip: () => true,
        },
      }),
      createInvitation: {
        id: "createInvitation",
        entry: async (context) => {
          const apiClient = await window.o.apiClient.client.subscribeToResult();
          const result = await apiClient.mutate({
            mutation: CreateInvitationsDocument,
            variables: {
              for: [context.data.name ?? `Invitation from ${new Date().toJSON()}`]
            },
          });

          if (result.errors) {
            throw new Error(`Couldn't create an invitation for the following reason: ${JSON.stringify(result.errors)}`);
          }
        },
        always: "#success"
      },
      success: {
        type: "final",
        id: "success",
        entry: (context) => {
          if (context.data.successAction) {
            context.data.successAction(context.data);
          }
        }}
    }
  });

export const createInvite: ProcessDefinition<void, PromptCreateInvitationContext> = {
  name: "promptCreateInvitation",
  stateMachine: <any>processDefinition,
};
