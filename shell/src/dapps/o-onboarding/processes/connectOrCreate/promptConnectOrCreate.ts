import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext"
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import {DisplayCurrency, UpsertProfileDocument} from "../../../../shared/api/data/types";
import { promptChoice } from "../../../o-passport/processes/identify/prompts/promptChoice";
import ButtonStackSelector from "@o-platform/o-editors/src/ButtonStackSelector.svelte";
import { UpsertRegistrationContext } from "../registration/promptRegistration";
import { loadProfile } from "../../../o-passport/processes/identify/services/loadProfile";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { GnosisSafeProxyFactory } from "@o-platform/o-circles/dist/safe/gnosisSafeProxyFactory";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { connectSafe } from "../connectSafe";
import {Environment} from "../../../../shared/environment";

export type PromptConnectOrCreateContextData = {
  forceCreate?: boolean;
  connectOrCreate: string;
  successAction?: (data: PromptConnectOrCreateContextData) => void;
};

export type PromptConnectOrCreateContext =
  ProcessContext<PromptConnectOrCreateContextData>;

const editorContent = {
  info: {
    title: window.i18n("dapps.o-onboarding.processes.connectOrCreate.promptConnectOrCreate.editorContent.info.title"),
    description: window.i18n("dapps.o-onboarding.processes.connectOrCreate.promptConnectOrCreate.editorContent.info.description"),
    submitButtonText: window.i18n("dapps.o-onboarding.processes.connectOrCreate.promptConnectOrCreate.editorContent.info.submitButtonText"),
  },
  connectOrCreate: {
    title: window.i18n("dapps.o-onboarding.processes.connectOrCreate.promptConnectOrCreate.editorContent.connectOrCreate.title"),
    description: window.i18n("dapps.o-onboarding.processes.connectOrCreate.promptConnectOrCreate.editorContent.connectOrCreate.description"),
    placeholder: "",
    submitButtonText: "",
  },
};
const processDefinition = (processId: string) =>
  createMachine<PromptConnectOrCreateContext, any>({
    id: `${processId}:promptConnectOrCreate`,
    initial: "init",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<PromptConnectOrCreateContext, any>("error"),

      init: {
        always:[{
          cond: context => context.data.forceCreate,
          target: "#newSafe"
        }, {
          target: "#connectOrCreate"
        }]
      },

      connectOrCreate: promptChoice<UpsertRegistrationContext, any>({
        id: "connectOrCreate",
        component: ButtonStackSelector,
        params: { view: editorContent.connectOrCreate },
        options: [
          {
            key: "newSafe",
            label: window.i18n("dapps.o-onboarding.processes.connectOrCreate.promptConnectOrCreate.processDefinition.connectOrCreate.options.newSafe"),
            target: "#newSafe",
            class: "btn btn-outline",
            action: (context) => {},
          },
          {
            key: "importSafe",
            label: window.i18n("dapps.o-onboarding.processes.connectOrCreate.promptConnectOrCreate.processDefinition.connectOrCreate.options.importSafe"),
            target: "#importSafe",
            class: "btn btn-outline",
            action: (context) => {},
          }
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
            message: window.i18n("dapps.o-onboarding.processes.connectOrCreate.promptConnectOrCreate.processDefenition.newSafe.message"),
          });
        },
        invoke: {
          src: async (context) => {
            const myProfile = await loadProfile();

            const privateKey = sessionStorage.getItem("circlesKey");
            if (!privateKey) {
              throw new Error(window.i18n("dapps.o-onboarding.processes.connectOrCreate.promptConnectOrCreate.processDefinition.privatKeyNotUnlocked"));
            }

            const proxyFactory = new GnosisSafeProxyFactory(
              RpcGateway.get(),
              Environment.safeProxyFactoryAddress,
              Environment.masterSafeAddress
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
                displayCurrency: DisplayCurrency.Eurs
              },
            });

            if (result.errors) {
              throw new Error(
                window.i18n("dapps.o-onboarding.processes.connectOrCreate.promptConnectOrCreate.processDefinition.couldNotUpdate", {values: {result: JSON.stringify(result.errors)}})
              );
            }
          },
          onDone: "success",
          onError: {
            actions: (context, event) => {
              console.error(window.i18n("dapps.o-onboarding.processes.connectOrCreate.promptConnectOrCreate.processDefinition.errorWhileDeploying"), event);
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
              throw new Error(window.i18n("dapps.o-onboarding.processes.connectOrCreate.promptConnectOrCreate.processDefinitionprivateKeyNotUnlocked"));
            }

            const innerSuccessAction = context.data.successAction;
            context.data.successAction = null;
            window.o.runProcess(connectSafe, {
              successAction: innerSuccessAction,
            });
          },
          onDone: "success",
        },
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
