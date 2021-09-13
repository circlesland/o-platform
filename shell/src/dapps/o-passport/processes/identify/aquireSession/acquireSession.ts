import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import {ipc} from "@o-platform/o-process/dist/triggers/ipc";
import {authenticate} from "./authenticate/authenticate";
import {ExchangeTokenDocument} from "../../../../../shared/api/data/types";

export type AcquireSessionContextData = {
  appId?: string;
  code?: string;
};

export type AcquireSessionContext = ProcessContext<AcquireSessionContextData>;

const processDefinition = (processId: string) =>
  createMachine<AcquireSessionContext, any>({
    id: `${processId}`,
    initial: "authenticate",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<AcquireSessionContext, any>("error"),

      // If a 'code' was supplied, we skip right to the 'exchangeCodeForToken' step,
      // else we ask the user for the e-mail address and send a challenge.
      authenticate: {
        entry: (ctx) => {
          // console.log(`enter: acquireSession.authenticate`, ctx.data);
          localStorage.removeItem("me");
        },
        on: {
          ...<any>ipc(`authenticate`)
        },
        invoke: {
          id: "authenticate",
          src: authenticate.stateMachine(`authenticate`),
          data: {
            data: (context, event) => {
              return {
                appId: "__APP_ID__",
                code: context.data.code
              }
            },
            dirtyFlags:{},
            messages:{},
          },
          onDone: "#exchangeTokenForSession",
          onError: "#error"
        }
      },
      exchangeTokenForSession: {
        id: "exchangeTokenForSession",
        // entry: (ctx) => console.log(`enter: acquireSession.exchangeTokenForSession`, ctx.data),
        on: {
          ...<any>ipc(`exchangeTokenForSession`)
        },
        invoke: {
          id: "exchangeTokenForSession",
          src: async (context, event) => {
            const client = await window.o.apiClient.client.subscribeToResult();
            const exchangeResult = await client.mutate({
              mutation: ExchangeTokenDocument,
              context: {
                headers: {
                  "Authorization": event.data
                }
              }
            });
            if (exchangeResult.errors && exchangeResult.errors.length > 0) {
              exchangeResult.errors.forEach(o => console.error(o));
            }
            if (!exchangeResult.data?.exchangeToken?.success) {
              throw new Error(`Couldn't exchange the jwt for a session.`);
            }
          },
          onDone: "#success",
          onError: "#error"
        }
      },
      success: {
        id: "success",
        type: "final"
      },
    },
  });


export const acquireSession: ProcessDefinition<void, void> = {
  name: "acquireSession",
  stateMachine: <any>processDefinition,
};
