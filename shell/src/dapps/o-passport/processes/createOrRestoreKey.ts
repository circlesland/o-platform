import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { userIsRegistered } from "./conditions/userIsRegistered";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import TextViewer from "@o-platform/o-editors/src/TextViewer.svelte";
import ChoiceSelector from "../../../../../packages/o-editors/src/ChoiceSelector.svelte";
import { CloseModal } from "@o-platform/o-events/dist/shell/closeModal";
import {Cancel} from "@o-platform/o-process/dist/events/cancel";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";

export type CreateOrRestoreKeyContextData = {
  loginEmail?: string;
  connectOrCreate?: {
    key: string,
    label: string
  };
  seedPhrase?: string;
  safeOwner?: string;
};

export type CreateOrRestoreKeyContext = ProcessContext<CreateOrRestoreKeyContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
  choiceLabel: "Do you want to create a new private key or connect an existing Circles Seedphrase?",
  choiceConnect: "Connect",
  choiceCreate: "Create",
  labelEditSeedphrase: "Please enter your seedphrase below:",
  labelExportSeedphrase: "Please make a backup of your seedphrase:",
};

const processDefinition = (processId: string) =>
  createMachine<CreateOrRestoreKeyContext, any>({
    id: `${processId}:createOrRestoreKey`,
    initial: "findEntryPoint",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<CreateOrRestoreKeyContext, any>("error"),

      findEntryPoint: {
        id: "findEntryPoint",
        always: [
          {
            cond: userIsRegistered,
            target: "connect",
          },
          {
            target: "connectOrCreate",
          },
        ],
      },
      connectOrCreate: prompt<CreateOrRestoreKeyContext, any>({
        fieldName: "connectOrCreate",
        component: ChoiceSelector,
        params: {
          label: strings.choiceLabel,
          choices: [{
            key: "connect",
            label: strings.choiceConnect
          }, {
            key: "create",
            label: strings.choiceCreate
          }]
        },
        navigation: {
          next: "#checkChoice",
        },
      }),
      checkChoice: {
        id: "checkChoice",
        always: [
          {
            cond: (context) => {
              return context.data.connectOrCreate.key == "connect"
            },
            target: "connect",
          },
          {
            cond: (context) => {
              return context.data.connectOrCreate.key == "create"
            },
            target: "generateSeedPhrase",
          },
        ],
      },
      connect: prompt<CreateOrRestoreKeyContext, any>({
        fieldName: "seedPhrase",
        component: TextEditor,
        params: {
          label: strings.labelEditSeedphrase,
        },
        navigation: {
          next: "#checkSeedPhrase",
          previous: "#findEntryPoint",
          canGoBack: () => true
        },
      }),
      checkSeedPhrase: {
        id: "checkSeedPhrase",
        always: [
          {
            cond: (context) => !context.data.seedPhrase, //TODO: Check if seedphrase is valid
            target: "connect",
          },
          {
            target: "#storeSeedPhrase",
          },
        ],
      },
      generateSeedPhrase: {
        id: "generateSeedPhrase",
        invoke: {
          src: async (context) => {
            context.data.seedPhrase = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            // TODO: Generate seed phrase
          },
          onDone: "exportSeedphrase",
          onError: "#error"
        }
      },
      exportSeedphrase: prompt<CreateOrRestoreKeyContext, any>({
        fieldName: "seedPhrase",
        component: TextViewer,
        params: {
          label: strings.labelExportSeedphrase,
        },
        navigation: {
          previous: "#findEntryPoint",
          next: "#storeSeedPhrase",
        },
      }),
      storeSeedPhrase: {
        id: "storeSeedPhrase",
        entry: (context, event) => {
          // TODO: Store the seedphrase in the localStorage
          localStorage.setItem("hasKey", "true");
        },
        always: "#success"
      },
      success: {
        id: "success",
        type: 'final',
        entry: (context, event) => {
          window.location = <any>"http://localhost:5000/#/passport/profile";
        },
        data: (context, event: PlatformEvent) => {
          return "yeah!";
        }
      }
    },
  });

// A ProcessDefinition always has a input and an output value (the generic parameters).
// Depending on how 'void' is placed, it can mimic either a function or procedure.
// Here it simply returns all the data that was collected in the process (AuthenticateContextData)
// if no error occurs in the promise.
export const createOrRestoreKey: ProcessDefinition<void, CreateOrRestoreKeyContext> = {
  name: "createOrRestoreKey",
  stateMachine: <any>processDefinition,
};
