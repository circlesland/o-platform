import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import PictureEditor from "@o-platform/o-editors/src/PictureEditor.svelte";
import {CloseModal} from "@o-platform/o-events/dist/shell/closeModal";
import {AuthenticateContext} from "../../o-auth/processes/authenticate";
import {Cancel} from "@o-platform/o-process/dist/events/cancel";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";

export type LogoutContextData = {
  loginEmail: string;
  checkSeedPhrase?: string;
  lastName?: string;
  avatar?: {
    bytes: Buffer,
    mimeType: string
  }
};

export type LogoutContext = ProcessContext<LogoutContextData>;

const strings = {
  labelCheckSeedPhrase: "Please enter your seedphrase to logout. If you haven't stored your seedphrase at a safe place yet, do it now and come back again later to log-out."
};

const processDefinition = (processId: string) =>
  createMachine<LogoutContext, any>({
    id: `${processId}:logout`,
    initial: "checkSeedPhrase",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<LogoutContext, any>("error"),

      checkSeedPhrase: prompt<LogoutContext, any>({
        fieldName: "checkSeedPhrase",
        component: TextEditor,
        params: {
          label: strings.labelCheckSeedPhrase,
        },
        navigation: {
          next: "#compareSeedPhrase",
        },
      }),
      compareSeedPhrase: {
        id: "compareSeedPhrase",
        always: [{
          cond: (context) => !!context.data.checkSeedPhrase,
          target: "#logout"
        }, {
          target: "#checkSeedPhrase"
        }]
      },
      logout: {
        id: "logout",
        invoke: {
          src: async (context) => {
          },
          onDone: "#success",
          onError: "#error"
        }
      },
      success: {
        type: 'final',
        id: "success",
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
export const logout: ProcessDefinition<void, LogoutContext> = {
  name: "logout",
  stateMachine: <any>processDefinition,
};
