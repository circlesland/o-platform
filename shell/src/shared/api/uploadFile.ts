import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import gql from "graphql-tag";
import {ipc} from "@o-platform/o-process/dist/triggers/ipc";
import {authenticateSso} from "../../dapps/o-auth/processes/authenticateSso";

export type UploadFileContextData = {
  appId:string,
  fileName: string,
  mimeType:string,
  bytes: Uint8Array,
};

export type UploadFileContext = ProcessContext<UploadFileContextData>;

const strings = {
};

const processDefinition = (processId: string) =>
createMachine<UploadFileContext, any>({
  id: `${processId}`,
  initial: "authenticateSso",
  states: {
    // Include a default 'error' state that propagates the error by re-throwing it in an action.
    // TODO: Check if this works as intended
    ...fatalError<UploadFileContext, any>("error"),

    authenticateSso: {
      id: "authenticateSso",
      entry: (ctx) => console.log(`enter: uploadFile.authenticateSso`),
      on: {
        ...<any>ipc(`authenticateSso`)
      },
      invoke: {
        id: "authenticateSso",
        src: authenticateSso.stateMachine(`authenticateSso`),
        data: {
          data: (context, event) => {
            return {
              appId: context.data.appId
            }
          },
          dirtyFlags: {}
        },
        onDone: "#success",
        onError: "#error"
      }
    },
    success: {
      id: "success",
      entry: () => console.log(`Enter: uploadFile.success`),
      type: "final",
      data: (context) => {
        console.log(context.data);
        return context.data;
      }
    },
  },
});

export const uploadFile: ProcessDefinition<void, UploadFileContextData> = {
  name: "uploadFile",
  stateMachine: <any>processDefinition,
};
