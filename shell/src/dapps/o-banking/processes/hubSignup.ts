import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import {CloseModal} from "@o-platform/o-events/dist/shell/closeModal";
import {Cancel} from "@o-platform/o-process/dist/events/cancel";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";

export type HubSignupContextData = {
  safeAddress:string;
};

/**
 * This is the context on which the process will work.
 * The actual fields are defined above in the 'AuthenticateContextData' type.
 * The 'AuthenticateContextData' type is also the return value of the process (see bottom for the signature).
 */
export type HubSignupContext = ProcessContext<HubSignupContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
};

const processDefinition = (processId: string) =>
createMachine<HubSignupContext, any>({
  id: `${processId}:hubSignup`,
  initial: "hubSignup",
  states: {
    // Include a default 'error' state that propagates the error by re-throwing it in an action.
    // TODO: Check if this works as intended
    ...fatalError<HubSignupContext, any>("error"),

    // The code was either manually entered or pre-configured at launch.
    // Exchange it for the actual token and redirect the user to the application.
    hubSignup: {
      id: "hubSignup",
      invoke: {
        src: async (context) => {
          return {
            data: "yeah!"
          }
        },
        onDone: "#success",
        onError: "#error",
      },
    },
    success: {
      id: 'success',
      type: 'final',
      data: (context, event: PlatformEvent) => {
        return "yeah!";
      }
    }
  },
});

export const hubSignup: ProcessDefinition<void, HubSignupContextData> = {
  name: "hubSignup",
  stateMachine: <any>processDefinition,
};
