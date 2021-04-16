import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import {prompt} from "@o-platform/o-process/dist/states/prompt";
import TextEditor from "../../../../../packages/o-editors/src/TextEditor.svelte";
import {SetTrustContext} from "./setTrust";
import {CloseModal} from "@o-platform/o-events/dist/shell/closeModal";
import {Cancel} from "@o-platform/o-process/dist/events/cancel";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";

export type TransferCirclesContextData = {
  safeAddress:string;
  recipientAddress:string;
  amount:string;
  pathToRecipient?: {
    tokenOwners: string[];
    sources: string[];
    destinations: string[],
    values: string[]
  };
};

/**
 * This is the context on which the process will work.
 * The actual fields are defined above in the 'AuthenticateContextData' type.
 * The 'AuthenticateContextData' type is also the return value of the process (see bottom for the signature).
 */
export type TransferCirclesContext = ProcessContext<TransferCirclesContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
  labelRecipientAddress: "",
  labelAmount: ""
};

const processDefinition = (processId: string) =>
createMachine<TransferCirclesContext, any>({
  id: `${processId}:transferCircles`,
  initial: "requestPathToRecipient",
  states: {
    // Include a default 'error' state that propagates the error by re-throwing it in an action.
    // TODO: Check if this works as intended
    ...fatalError<TransferCirclesContext, any>("error"),

    requestPathToRecipient: {
      id: "requestPathToRecipient",
      invoke: {
        src: async () => {},
        onDone: "#transferCircles",
        onError: "#error"
      }
    },
    transferCircles: {
      id: "transferCircles",
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

export const transferCircles: ProcessDefinition<void, TransferCirclesContextData> = {
  name: "transferCircles",
  stateMachine: <any>processDefinition,
};
