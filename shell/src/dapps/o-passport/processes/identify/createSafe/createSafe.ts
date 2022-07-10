import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import TextViewer from "@o-platform/o-editors/src/TextViewer.svelte";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import * as yup from "yup";
import * as bip39 from "bip39";

export type CreateSafeContextData = {
  privateKey?: string;
  seedPhrase?: string;
  checkSeedPhrase?: string;
  checkWordIndex?: number;
  successAction: (data: CreateSafeContextData) => void;
};

export type CreateSafeContext = ProcessContext<CreateSafeContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
  choiceConnect: window.i18n("dapps.o-passport.processes.identify.createSafe.createSafe.strings.choiceConnect"),
  choiceCreate: window.i18n("dapps.o-passport.processes.identify.createSafe.createSafe.strings.choiceCreate"),
  labelExportSeedphrase: window.i18n(
    "dapps.o-passport.processes.identify.createSafe.createSafe.strings.labelExportSeedphrase"
  ),
  buttonExportSeedphrase: window.i18n(
    "dapps.o-passport.processes.identify.createSafe.createSafe.strings.buttonExportSeedphrase"
  ),
  // labelCheckSeedphrase: (context: CreateSafeContext) => `Please enter the ${context.data.checkWordIndex == 0 ? (context.data.checkWordIndex + 1).toString() + "st" : (context.data.checkWordIndex + 1).toString() + "nd"} word of your seedphrase:`,
  labelCheckSeedphrase: window.i18n(
    "dapps.o-passport.processes.identify.createSafe.createSafe.strings.labelCheckSeedphrase"
  ),
  buttonCheckSeedphrase: window.i18n(
    "dapps.o-passport.processes.identify.createSafe.createSafe.strings.buttonCheckSeedphrase"
  ),
};

const editorContent = {
  seedphrase: {
    title: window.i18n("dapps.o-passport.processes.identify.createSafe.createSafe.editorContent.seedphrase.title"),
    titleClass: "text-alert",
    description: window.i18n(
      "dapps.o-passport.processes.identify.createSafe.createSafe.editorContent.seedphrase.description"
    ),
    submitButtonText: window.i18n(
      "dapps.o-passport.processes.identify.createSafe.createSafe.editorContent.seedphrase.submitButtonText"
    ),
  },
  seedphraseCheck: {
    title: window.i18n("dapps.o-passport.processes.identify.createSafe.createSafe.editorContent.seedphraseCheck.title"),
    titleClass: "text-alert",
    description: window.i18n(
      "dapps.o-passport.processes.identify.createSafe.createSafe.editorContent.seedphraseCheck.description"
    ),
    submitButtonText: window.i18n(
      "dapps.o-passport.processes.identify.createSafe.createSafe.editorContent.seedphraseCheck.submitButtonText"
    ),
  },
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
            context.data.privateKey = RpcGateway.get().eth.accounts.create().privateKey;
            context.data.seedPhrase = bip39.entropyToMnemonic(context.data.privateKey.replace("0x", ""));
            const wordCount = context.data.seedPhrase.split(" ").length;
            context.data.checkWordIndex = randomIntFromInterval(0, wordCount - 1);
          },
          onDone: "backupSeedphrase",
          onError: "#error",
        },
      },
      backupSeedphrase: prompt<CreateSafeContext, any>({
        id: "backupSeedphrase",
        field: "seedPhrase",
        component: TextViewer,
        params: {
          view: editorContent.seedphrase,
          isReadonly: true,
          submitButtonText: editorContent.seedphrase.submitButtonText,
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
        field: "checkSeedPhrase",
        component: TextareaEditor,
        params: {
          view: (editorContent.seedphraseCheck = {
            title: window.i18n(
              "dapps.o-passport.processes.identify.createSafe.createSafe.editorContent.seedphrase.title"
            ),
            titleClass: "text-alert",
            description: window.i18n(
              "dapps.o-passport.processes.identify.createSafe.createSafe.editorContent.seedphrase.description"
            ),
            submitButtonText: window.i18n(
              "dapps.o-passport.processes.identify.createSafe.createSafe.editorContent.seedphrase.submitButtonText"
            ),
          }),
          hideCharacterCount: true,
          submitButtonText: (editorContent.seedphraseCheck.submitButtonText = window.i18n(
            "dapps.o-passport.processes.identify.createSafe.createSafe.editorContent.seedphrase.submitButtonText"
          )),
        },
        dataSchema: yup
          .string()
          .required(window.i18n("dapps.o-passport.processes.identify.createSafe.createSafe.pleaseEnterSecretCode")),
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
              return context.data.checkSeedPhrase.trim() === context.data.seedPhrase;
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
        entry: (context) => {
          if (context.data.successAction) {
            context.data.successAction(context.data);
          }
        },
        data: () => true,
      },
    },
  });

export const createSafe: ProcessDefinition<void, CreateSafeContext> = {
  name: "createSafe",
  stateMachine: <any>processDefinition,
};
