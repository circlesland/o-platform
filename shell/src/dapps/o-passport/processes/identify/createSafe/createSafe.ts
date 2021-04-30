import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {prompt, PromptSpec} from "@o-platform/o-process/dist/states/prompt";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {createMachine} from "xstate";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import * as bip39 from "bip39";

export type CreateSafeContextData = {
  privateKey?: string
  seedPhrase?: string;
  checkSeedPhrase?: string;
  checkWordIndex?: number;
};

export type CreateSafeContext = ProcessContext<CreateSafeContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
  choiceLabel: "Do you want to create a new private key or connect an existing Circles Seedphrase?",
  choiceConnect: "Connect",
  choiceCreate: "Create",
  labelEditSeedphrase: "Please enter your seedphrase below:",
  labelExportSeedphrase: "Please make a backup of your seedphrase:",
  // labelCheckSeedphrase: (context: CreateSafeContext) => `Please enter the ${context.data.checkWordIndex == 0 ? (context.data.checkWordIndex + 1).toString() + "st" : (context.data.checkWordIndex + 1).toString() + "nd"} word of your seedphrase:`,
  labelCheckSeedphrase: (context: CreateSafeContext) => `Please enter the ${context.data.checkWordIndex == 0 ? (context.data.checkWordIndex + 1).toString() + "st" : (context.data.checkWordIndex + 1).toString() + "nd"} word of your seedphrase:`,
};

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const processDefinition = (processId: string) =>
  createMachine<CreateSafeContext, any>({
    id: `${processId}:createOrRestoreKey`,
    initial: "generateSeedPhrase",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<CreateSafeContext, any>("error"),

      generateSeedPhrase: {
        id: "generateSeedPhrase",
        invoke: {
          src: async (context) => {
            context.data.privateKey = RpcGateway.get().eth.accounts.create().privateKey;
            context.data.seedPhrase = bip39.entropyToMnemonic(context.data.privateKey.replace("0x", ""));
            const wordCount = context.data.seedPhrase.split(" ").length;
            context.data.checkWordIndex = randomIntFromInterval(0, wordCount - 1);
          },
          onDone: "backupSeedphrase",
          onError: "#error"
        }
      },
      backupSeedphrase: prompt<CreateSafeContext, any>({
        id: "backupSeedphrase",
        fieldName: "seedPhrase",
        component: TextareaEditor,
        params: {
          label: strings.labelExportSeedphrase,
          isReadonly: true
        },
        navigation: {
          next: "#askForBackup",
          canGoBack: () => true
        },
      }),
      askForBackup: prompt<CreateSafeContext, any>({
        id: "askForBackup",
        fieldName: "checkSeedPhrase",
        component: TextEditor,
        params: {
          label: strings.labelCheckSeedphrase,
        },
        navigation: {
          next: "#verifyCheckSeedPhrase",
          canGoBack: () => true
        }
      }),
      verifyCheckSeedPhrase: {
        id: "verifyCheckSeedPhrase",
        always: [{
          cond: (context) => {
            const checkWord = context.data.seedPhrase.split(" ")[context.data.checkWordIndex];
            return context.data.checkSeedPhrase.trim() === checkWord;
          },
          target: "#storeSeedPhrase"
        }, {
          target: "#askForBackup"
        }]
      },
      storeSeedPhrase: {
        id: "storeSeedPhrase",
        entry: (context) => {
          localStorage.setItem("circlesKey", context.data.privateKey);
          localStorage.setItem("isCreatingSafe", "true");
        },
        always: "#success"
      },
      success: {
        id: "success",
        type: 'final'
      }
    },
  });

export const createSafe: ProcessDefinition<void, CreateSafeContext> = {
  name: "createSafe",
  stateMachine: <any>processDefinition,
};
