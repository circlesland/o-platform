import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { ipc } from "@o-platform/o-process/dist/triggers/ipc";
import { Environment } from "../environment";
import { Generate } from "@o-platform/o-utils/dist/generate";

export type UploadFileContextData = {
  appId: string;
  fileName: string;
  mimeType: string;
  bytes: Uint8Array;
  hash?: string;
  url?: string;
};

export type UploadFileContext = ProcessContext<UploadFileContextData>;

const strings = {};

const processDefinition = (processId: string) =>
  createMachine<UploadFileContext, any>({
    id: `${processId}`,
    initial: "upload",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<UploadFileContext, any>("error"),
      upload: {
        id: "upload",
        // entry: () => console.log(`enter: uploadFile.upload`),
        on: {
          ...(<any>ipc(`upload`)),
        },
        invoke: {
          id: "upload",
          src: async (context, event) => {
            const response = await fetch(
              `${Environment.apiEndpointUrl}/upload`,
              {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Cache: "no-cache",
                },
                credentials: "include",
                method: "POST",
                body: JSON.stringify({
                  fileName: `${Generate.randomHexString(14)}.jpg`,
                  mimeType: "image/*",
                  bytes: context.data.bytes,
                }),
              }
            );

            const jsonResponse = await response.json();
            if (jsonResponse.status != "ok") {
              throw new Error(
                `Got a not-ok status from the file server: ${JSON.stringify(
                  jsonResponse,
                  null,
                  2
                )}`
              );
            }
            delete context.data.bytes;
            context.data.hash = jsonResponse.hash;
            context.data.url = jsonResponse.url;
          },
          onDone: "#success",
          onError: "#uploadError",
        },
      },
      uploadError: {
        id: "uploadError",
        // entry: () => console.log(`Enter: uploadFile.error`),
        type: "final",
        data: () => {
          return new Error("Couldn't upload the file");
        },
      },
      success: {
        id: "success",
        // entry: () => console.log(`Enter: uploadFile.success`),
        type: "final",
        data: (context) => {
          return context.data;
        },
      },
    },
  });

export const uploadFile: ProcessDefinition<void, UploadFileContextData> = {
  name: "uploadFile",
  stateMachine: <any>processDefinition,
};
