import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { LogoutDocument } from "../data/api/types";
import { push } from "svelte-spa-router";
import * as bip39 from "bip39";

export type LogoutContextData = {
  loginEmail: string;
  checkSeedPhrase?: string;
  lastName?: string;
  avatar?: {
    bytes: Buffer;
    mimeType: string;
  };
};

export type LogoutContext = ProcessContext<LogoutContextData>;

const strings = {
  labelCheckSeedPhrase:
    "Please enter your seedphrase to logout. If you haven't stored your seedphrase at a safe place yet, do it now and come back again later to log-out.",
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
        field: "checkSeedPhrase",
        component: TextareaEditor,
        params: {
          label: strings.labelCheckSeedPhrase,
        },
        navigation: {
          next: "#compareSeedPhrase",
        },
      }),
      compareSeedPhrase: {
        id: "compareSeedPhrase",
        always: [
          {
            cond: (context) => {
              let seedPhrase =
                localStorage.getItem("circlesKey") &&
                localStorage.getItem("circlesKey") != "0x123"
                  ? bip39.entropyToMnemonic(
                      localStorage
                        .getItem("circlesKey")
                        .substr(
                          2,
                          localStorage.getItem("circlesKey").length - 2
                        )
                    )
                  : "<no private key>";
              const match = context.data.checkSeedPhrase.trim() == seedPhrase;
              if (!match) {
                context.messages["checkSeedPhrase"] =
                  "The seedphrases don't match";
              }
              return match;
            },
            target: "#logout",
          },
          {
            target: "#checkSeedPhrase",
          },
        ],
      },
      logout: {
        id: "logout",
        invoke: {
          src: async (context) => {
            const apiClient =
              await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: LogoutDocument,
            });
            return result.data.logout.success;
          },
          onDone: "#success",
          onError: "#error",
        },
      },
      success: {
        type: "final",
        id: "success",
        data: (context, event: any) => {
          localStorage.removeItem("safe");
          localStorage.removeItem("circlesAccount");
          localStorage.removeItem("circlesKey");
          localStorage.removeItem("isCreatingSafe");
          localStorage.removeItem("me");
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.loggedOut",
          });
          push("/");
          return event.data; // TODO: fix any
        },
      },
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
