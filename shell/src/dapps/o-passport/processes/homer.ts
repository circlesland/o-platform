import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";

import SingleButtonEditor from "@o-platform/o-editors/src/SingleButtonEditor.svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { push } from "svelte-spa-router";
import * as bip39 from "bip39";
import * as yup from "yup";
import {LogoutDocument} from "../../../shared/api/data/types";

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

const editorContent = {
  requestInvite: {
    title: "WAIT FOR Invitation",
    description:
      "To finally become a citizen of Circlesland an receive your very first universal basic income, you need to get invited by an existing citizen. ",
    submitButtonText: "Ask for invitation in our chat",
  },
};
const processDefinition = (processId: string) =>
  createMachine<LogoutContext, any>({
    id: `${processId}:logout`,
    initial: "requestInvite",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<LogoutContext, any>("error"),

      requestInvite: prompt<LogoutContext, any>({
        field: "checkSeedPhrase",
        component: SingleButtonEditor,
        params: {
          view: editorContent.requestInvite,
        },

        navigation: {
          next: "#success",
        },
      }),

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
        data: (context, event: PlatformEvent) => {
          window.open("https://discord.gg/CS6xq7jECR");
          return "yeah!";
        },
      },
    },
  });

// A ProcessDefinition always has a input and an output value (the generic parameters).
// Depending on how 'void' is placed, it can mimic either a function or procedure.
// Here it simply returns all the data that was collected in the process (AuthenticateContextData)
// if no error occurs in the promise.
export const homer: ProcessDefinition<void, LogoutContext> = {
  name: "logout",
  stateMachine: <any>processDefinition,
};
