import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {GnosisSafeProxy} from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import {CirclesAccount} from "@o-platform/o-circles/dist/model/circlesAccount";
import {emptySafe} from "../data/emptySafe";
import {mySafe} from "../stores/safe";
import {getUBIService} from "./getUBIService";

export type GetUbiContextData = {
  safeAddress:string;
  privateKey:string;
};

/**
 * This is the context on which the process will work.
 * The actual fields are defined above in the 'AuthenticateContextData' type.
 * The 'AuthenticateContextData' type is also the return value of the process (see bottom for the signature).
 */
export type GetUbiContext = ProcessContext<GetUbiContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
};

const processDefinition = (processId: string) =>
createMachine<GetUbiContext, any>({
  id: `${processId}:getUbi`,
  initial: "getUbi",
  states: {
    // Include a default 'error' state that propagates the error by re-throwing it in an action.
    // TODO: Check if this works as intended
    ...fatalError<GetUbiContext, any>("error"),

    // The code was either manually entered or pre-configured at launch.
    // Exchange it for the actual token and redirect the user to the application.
    getUbi: {
      id: "getUbi",
      invoke: {
        src: getUBIService,
        onDone: "#success",
        onError: "#error",
      },
    },
    success: {
      id: 'success',
      type: 'final',
      data: (context, event: PlatformEvent & {data:any}) => {
        return true;
      }
    }
  },
});

export const getUbi: ProcessDefinition<void, GetUbiContextData> = {
  name: "getUbi",
  stateMachine: <any>processDefinition,
};
