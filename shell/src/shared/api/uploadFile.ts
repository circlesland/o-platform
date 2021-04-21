import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import {ipc} from "@o-platform/o-process/dist/triggers/ipc";
import {authenticateSso} from "../../dapps/o-passport/processes/authenticateSso";

export type UploadFileContextData = {
  appId:string,
  fileName: string,
  mimeType:string,
  bytes: Uint8Array,
  hash?: string
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
        onDone: "#upload",
        onError: "#error"
      }
    },
    upload: {
      id: "upload",
      entry: (ctx) => console.log(`enter: uploadFile.upload`),
      on: {
        ...<any>ipc(`upload`)
      },
      invoke: {
        id: "upload",
        src: async (context, event) => {

          const response = await fetch("__FILES_ENDPOINT__/upload", {
            "headers": {
              "accept": "*/*",
              "content-type": "application/json",
              "authorization": event.data.jwt
            },
            "method": "POST",
            "mode": "cors",
            "credentials": "omit",
            "body": JSON.stringify({
              fileName: "",
              mimeType: "image/*",
              bytes: Buffer.from(context.data.bytes).toString("base64")
            })
          });

          const jsonResponse = await response.json();
          if (jsonResponse.status != "ok") {
            throw new Error(`Got a not-ok status from the file server: ${JSON.stringify(jsonResponse, null, 2)}`);
          }
          context.data.hash = jsonResponse.hash;
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
        return context.data;
      }
    },
  },
});

export const uploadFile: ProcessDefinition<void, UploadFileContextData> = {
  name: "uploadFile",
  stateMachine: <any>processDefinition,
};
