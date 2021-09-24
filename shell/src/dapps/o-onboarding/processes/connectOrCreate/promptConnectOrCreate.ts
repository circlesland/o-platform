import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { push } from "svelte-spa-router";
import * as yup from "yup";
import HtmlViewer from "../../../../../../packages/o-editors/src/HtmlViewer.svelte";
import {
  ClaimInvitationDocument, UpsertProfileDocument
} from "../../../../shared/api/data/types";
import {promptChoice} from "../../../o-passport/processes/identify/prompts/promptChoice";
import ChoiceSelector from "../../../../../../packages/o-editors/src/ChoiceSelector.svelte";
import {UpsertRegistrationContext} from "../registration/promptRegistration";
import {createSafe} from "../../../o-passport/processes/identify/createSafe/createSafe";
import {loadProfile} from "../../../o-passport/processes/identify/services/loadProfile";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";

export type LogoutContextData = {
  connectOrCreate: string;
};

export type PromptConnectOrCreateContext = ProcessContext<LogoutContextData>;

const editorContent = {
  info: {
    title: "Create a safe",
    description:
      "In the next steps you can create your account on the blockchain ..",
    submitButtonText: "Next",
  },
  connectOrCreate: {
    title: "Connect or create?",
    description:
      "Choose your scenario",
    placeholder: "",
    submitButtonText: "",
  },
  success: {
    title: "Success",
    description:
      "You can now proceed with the setup of your account.",
    submitButtonText: "Continue",
  },
};
const processDefinition = (processId: string) =>
  createMachine<PromptConnectOrCreateContext, any>({
    id: `${processId}:promptConnectOrCreate`,
    initial: "info",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<PromptConnectOrCreateContext, any>("error"),

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
          next: "#connectOrCreate",
        },
      }),
      connectOrCreate: promptChoice<UpsertRegistrationContext, any>({
        id: "connectOrCreate",
        component: ChoiceSelector,
        params: { view: editorContent.connectOrCreate },
        options: [
          {
            key: "newEoa",
            label: "I'm new, create everything for me",
            target: "#newEoa",
            action: (context) => {
            },
          },
          {
            key: "importEoa",
            label: "I already got a seedphrase",
            target: "#importEoa",
            action: (context) => {
            },
          },
          {
            key: "importCirclesGarden",
            label: "Import my circles.garden profile",
            target: "#importCirclesGarden",
            action: (context) => {
            },
          },
        ],
        navigation: {
          canGoBack: () => false
        },
      }),
      newEoa: {
        id: "newEoa",
        entry: (context) => {
          window.o.runProcess(createSafe, {
            successAction: async (data) => {
              const myProfile = await loadProfile();
              const apiClient = await window.o.apiClient.client.subscribeToResult();
              const privateKey = localStorage.getItem("circlesKey")
              const account = RpcGateway.get().eth.accounts.privateKeyToAccount(privateKey);
              const result = await apiClient.mutate({
                mutation: UpsertProfileDocument,
                variables: {
                  ...myProfile,
                  status: "eoa",
                  circlesSafeOwner: account.address
                },
              });

              if (result.errors) {
                throw new Error(`Couldn't update the profile with the generated eoa: ${JSON.stringify(result.errors)}`);
              }
              (<any>window).runInitMachine();
            }
          });
        }
      },
      importEoa: {
        id: "importEoa"
      },
      importCirclesGarden: {
        id: "importCirclesGarden"
      }
    },
  });

export const promptConnectOrCreate: ProcessDefinition<void, PromptConnectOrCreateContext> = {
  name: "promptConnectOrCreate",
  stateMachine: <any>processDefinition,
};
