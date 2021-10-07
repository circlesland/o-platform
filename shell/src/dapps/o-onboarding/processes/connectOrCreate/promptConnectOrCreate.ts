import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import HtmlViewer from "../../../../../../packages/o-editors/src/HtmlViewer.svelte";
import { UpsertProfileDocument } from "../../../../shared/api/data/types";
import { promptChoice } from "../../../o-passport/processes/identify/prompts/promptChoice";
import ButtonStackSelector from "@o-platform/o-editors/src/ButtonStackSelector.svelte";
import { UpsertRegistrationContext } from "../registration/promptRegistration";
import { loadProfile } from "../../../o-passport/processes/identify/services/loadProfile";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { GnosisSafeProxyFactory } from "@o-platform/o-circles/dist/safe/gnosisSafeProxyFactory";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import {
  GNOSIS_SAFE_ADDRESS,
  PROXY_FACTORY_ADDRESS,
} from "@o-platform/o-circles/dist/consts";
import { connectSafe } from "../connectSafe";

export type PromptConnectOrCreateContextData = {
  connectOrCreate: string;
  successAction?: (data: PromptConnectOrCreateContextData) => void;
};

export type PromptConnectOrCreateContext =
  ProcessContext<PromptConnectOrCreateContextData>;

const editorContent = {
  info: {
    title: "Create a safe",
    description:
      "In the next steps you can create your account on the blockchain ..",
    submitButtonText: "Next",
  },
  connectOrCreate: {
    title: "Connect or create?",
    description: "Choose your scenario",
    placeholder: "",
    submitButtonText: "",
  },
};
const processDefinition = (processId: string) =>
  createMachine<PromptConnectOrCreateContext, any>({
    id: `${processId}:promptConnectOrCreate`,
    initial: "connectOrCreate",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<PromptConnectOrCreateContext, any>("error"),

      connectOrCreate: promptChoice<UpsertRegistrationContext, any>({
        id: "connectOrCreate",
        component: ButtonStackSelector,
        params: { view: editorContent.connectOrCreate },
        options: [
          {
            key: "newSafe",
            label: "I'm new, create everything for me",
            target: "#newSafe",
            class: "btn btn-outline",
            action: (context) => {},
          },
          {
            key: "importSafe",
            label: "I already have a safe",
            target: "#importSafe",
            class: "btn btn-outline",
            action: (context) => {},
          },
          // {
          //   key: "importCirclesGarden",
          //   label: "Import my circles.garden profile",
          //   target: "#importCirclesGarden",
          //   class: "btn btn-outline",
          //   action: (context) => {},
          // },
        ],
        navigation: {
          canGoBack: () => false,
        },
      }),
      newSafe: {
        id: "newSafe",
        entry: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: "Please wait while we create your Safe on the Blockchain.",
          });
        },
        invoke: {
          src: async (context) => {
            const myProfile = await loadProfile();

            const privateKey = sessionStorage.getItem("circlesKey");
            if (!privateKey) {
              throw new Error(`The private key is not unlocked.`);
            }

            const proxyFactory = new GnosisSafeProxyFactory(
              RpcGateway.get(),
              PROXY_FACTORY_ADDRESS,
              GNOSIS_SAFE_ADDRESS
            );
            const safeProxy = await proxyFactory.deployNewSafeProxy(privateKey);

            const apiClient =
              await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: UpsertProfileDocument,
              variables: {
                ...myProfile,
                status: "eoa",
                circlesAddress: safeProxy.address,
              },
            });

            if (result.errors) {
              throw new Error(
                `Couldn't update the profile with the generated eoa: ${JSON.stringify(
                  result.errors
                )}`
              );
            }
          },
          onDone: "success",
          onError: {
            actions: (context, event) => {
              console.error(`An error occurred while deploying your safe: ${JSON.stringify(event.data)}`);
              throw new Error(event.data);
            },
            target: "success"
          }
        },
      },
      importSafe: {
        id: "importSafe",
        invoke: {
          src: async (context) => {
//            const myProfile = await loadProfile();

            const privateKey = sessionStorage.getItem("circlesKey");
            if (!privateKey) {
              throw new Error(`The private key is not unlocked.`);
            }

            window.o.runProcess(connectSafe, {
              successAction: (data) => {
                (<any>window).runInitMachine();
              },
            });
          },
          onDone: "success",
        },
      },
      importCirclesGarden: {
        id: "importCirclesGarden",
      },
      success: {
        type: "final",
        entry: (context) => {
          if (context.data.successAction) {
            context.data.successAction(context.data);
          }
        },
      },
    },
  });

export const promptConnectOrCreate: ProcessDefinition<
  void,
  PromptConnectOrCreateContext
> = {
  name: "promptConnectOrCreate",
  stateMachine: <any>processDefinition,
};
