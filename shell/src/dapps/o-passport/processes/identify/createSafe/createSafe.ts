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
};

export type CreateSafeContext = ProcessContext<CreateSafeContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
  choiceConnect: "Connect",
  choiceCreate: "Create",
  labelExportSeedphrase: `Your Secret Recovery Code is the
<span class="text-alert-dark">only key</span>
which can access your safe. It is your
<span class="text-alert-dark">full responsibility</span>
to
<span class="text-alert-dark">protect</span>
this code like a
<span class="text-alert-dark">password</span>
.
<br />
<br />
<span class="text-xs">
  If you loose it or forget it, all your
  <span class="text-alert-dark">money is lost forever</span>
  .
</span>`,
  buttonExportSeedphrase: "I stored it securely",
  // labelCheckSeedphrase: (context: CreateSafeContext) => `Please enter the ${context.data.checkWordIndex == 0 ? (context.data.checkWordIndex + 1).toString() + "st" : (context.data.checkWordIndex + 1).toString() + "nd"} word of your seedphrase:`,
  labelCheckSeedphrase: `Keep in mind, everyone who knows your Secret Recovery Code can access all your funds! Did you store your Secret Recovery Code in a password manager or have you written it down on a paper, that you put into a secret place? <strong class='text-primary block mt-3'>Repeat your Secret Recovery Code</strong>`,
  buttonCheckSeedphrase: "Really, I did it!",
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
        field: "seedPhrase",
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
        field: "checkSeedPhrase",
        component: TextareaEditor,
        params: {
          label: strings.labelCheckSeedphrase,
          hideCharacterCount: true,
          submitButtonText: strings.buttonCheckSeedphrase,
        },
        dataSchema: yup
          .string()
          .required("Please enter your Secret Recovery Code."),
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
