import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt, PromptSpec } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import TextViewer from "@o-platform/o-editors/src/TextViewer.svelte";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import * as bip39 from "bip39";

export type CreateSafeContextData = {
  privateKey?: string;
  seedPhrase?: string;
  checkSeedPhrase?: string;
  checkWordIndex?: number;
};

export type CreateSafeContext = ProcessContext<CreateSafeContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
  choiceLabel:
    "Do you want to create a new private key or connect an existing Circles Seedphrase?",
  choiceConnect: "Connect",
  choiceCreate: "Create",
  labelEditSeedphrase: "Please enter your seedphrase below:",
  labelExportSeedphrase:
    "The following 24 word sentence is your seedphrase, which is like a non-changeable password. It is your full responsibility to save and protect your seedphrase. If you loose or forget it, all your funds are lost forever.<br/><strong class='text-primary block mt-3'>Make a backup now</strong>",
  buttonExportSeedphrase: "I made a backup",
  // labelCheckSeedphrase: (context: CreateSafeContext) => `Please enter the ${context.data.checkWordIndex == 0 ? (context.data.checkWordIndex + 1).toString() + "st" : (context.data.checkWordIndex + 1).toString() + "nd"} word of your seedphrase:`,
  labelCheckSeedphrase: `Keep in mind, everyone who knows your seedphrase can access all your funds! Did you store your seedphrase in a password manager or have you written it down on a paper, that you put into a secret place? <strong class='text-primary block mt-3'>Repeat your seedphrase password</strong>`,
  buttonCheckSeedphrase: "It is stored safely",
};

function randomIntFromInterval(min, max) {
  // min and max included
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
            context.data.privateKey =
              RpcGateway.get().eth.accounts.create().privateKey;
            context.data.seedPhrase = bip39.entropyToMnemonic(
              context.data.privateKey.replace("0x", "")
            );
            const wordCount = context.data.seedPhrase.split(" ").length;
            context.data.checkWordIndex = randomIntFromInterval(
              0,
              wordCount - 1
            );
          },
          onDone: "backupSeedphrase",
          onError: "#error",
        },
      },
      backupSeedphrase: prompt<CreateSafeContext, any>({
        id: "backupSeedphrase",
        fieldName: "seedPhrase",
        component: TextViewer,
        params: {
          label: strings.labelExportSeedphrase,
          isReadonly: true,
          submitButtonText: strings.buttonExportSeedphrase,
          hideCharacterCount: true,
          canCopy: true,
        },
        navigation: {
          next: "#askForBackup",
          previous: "#generateSeedPhrase",
          canGoBack: () => false,
        },
      }),
      askForBackup: prompt<CreateSafeContext, any>({
        id: "askForBackup",
        fieldName: "checkSeedPhrase",
        component: TextareaEditor,
        params: {
          label: strings.labelCheckSeedphrase,
          hideCharacterCount: true,
          submitButtonText: strings.buttonCheckSeedphrase,
        },
        navigation: {
          next: "#verifyCheckSeedPhrase",
          previous: "#backupSeedphrase",
          canGoBack: () => true,
        },
      }),
      verifyCheckSeedPhrase: {
        id: "verifyCheckSeedPhrase",
        always: [
          {
            cond: (context) => {
              //const checkWord = context.data.seedPhrase.split(" ")[context.data.checkWordIndex];
              return (
                context.data.checkSeedPhrase.trim() === context.data.seedPhrase
              );
            },
            target: "#storeSeedPhrase",
          },
          {
            target: "#askForBackup",
          },
        ],
      },
      storeSeedPhrase: {
        id: "storeSeedPhrase",
        entry: (context) => {
          localStorage.setItem("isCreatingSafe", "true");
          localStorage.setItem("circlesKey", context.data.privateKey);
        },
        always: "#success",
      },
      success: {
        id: "success",
        type: "final",
      },
    },
  });

export const createSafe: ProcessDefinition<void, CreateSafeContext> = {
  name: "createSafe",
  stateMachine: <any>processDefinition,
};
