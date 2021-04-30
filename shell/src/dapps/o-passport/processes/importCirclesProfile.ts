import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { GnosisSafeProxy } from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import Web3 from "web3";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import * as bip39 from "bip39";
import { Observable } from "rxjs";

export type ImportCirclesProfileContextData = {
  safeAddress?: string;
  circlesGardenProfile?: {
    username:string;
    avatarUrl?:string;
  };
};

export type ImportCirclesProfileContext = ProcessContext<ImportCirclesProfileContextData>;

const processDefinition = (processId: string) =>
  createMachine<ImportCirclesProfileContext, any>({
    id: `${processId}`,
    initial: "checkCirclesGarden",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<ImportCirclesProfileContext, any>("error"),

      checkCirclesGarden: {
        id: "checkCirclesGarden",
        invoke: {
          src: async (context) => {
            const checksumAddress = Web3.utils.toChecksumAddress(
              context.data.safeAddress
            );
            const queryUrl = `https://api.circles.garden/api/users/?address[]=${checksumAddress}`;
            const result = await fetch(queryUrl);

            if (result.status != 200) {
              return;
            }

            const resultJson = await result.json();
            if (
              !Array.isArray(resultJson.data) ||
              resultJson.data.length == 0
            ) {
              return;
            }

            context.data.circlesGardenProfile = {
              username: resultJson.data[0].username,
              avatarUrl: resultJson.data[0].avatarUrl,
            };
          },
          onDone: "#success",
          onError: "#error",
        },
      },
      success: {
        id: "success",
        type: "final",
        data: (context) => {
          return context.data;
        },
      },
    },
  });

export const importCirclesProfile: ProcessDefinition<
  void,
  ImportCirclesProfileContextData
> = {
  name: "importCirclesProfile",
  stateMachine: <any>processDefinition,
};
