import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";

import { push } from "svelte-spa-router";
import { LogoutDocument } from "../../../shared/api/data/types";
import { getOpenLogin } from "../../../shared/openLogin";

export type LogoutContextData = {
  successAction: (data: LogoutContextData) => void;
  loginEmail: string;
  checkSeedPhrase?: string;
  lastName?: string;
  reLogin?: boolean;
  avatar?: {
    bytes: Buffer;
    mimeType: string;
  };
};

export type LogoutContext = ProcessContext<LogoutContextData>;

const editorContent = {
  logout: {
    title: window.i18n("dapps.o-passport.processes.logout.editorContent.title"),
    description: window.i18n("dapps.o-passport.processes.logout.editorContent.description"),
    submitButtonText: window.i18n("dapps.o-passport.processes.logout.editorContent.submitButtonText"),
  },
};
const processDefinition = (processId: string) =>
  createMachine<LogoutContext, any>({
    id: `${processId}:logout`,
    initial: "logout",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<LogoutContext, any>("error"),
      logout: {
        id: "logout",
        invoke: {
          src: async (context) => {
            const openLogin = await getOpenLogin();

            sessionStorage.removeItem("circlesKey");
            sessionStorage.removeItem("keyCache");
            localStorage.removeItem("circlesKeys");

            localStorage.setItem(
              "me",
              JSON.stringify({
                id: 0,
                circlesAddress: "",
                displayCurrency: "",
                circlesSafeOwner: "",
                successorOfCirclesAddress: null,
                displayName: "",
                firstName: "",
                lastName: "",
                emailAddress: "",
                askedForEmailAddress: true,
                dream: null,
                country: null,
                avatarUrl: "",
                avatarCid: null,
                avatarMimeType: "image/jpeg",
                newsletter: true,
                displayTimeCircles: true,
                cityGeonameid: null,
                city: null,
                memberships: [],
                verifications: [],
                circlesTokenAddress: "",
                __typename: "Profile",
              })
            );

            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: LogoutDocument,
            });
            await openLogin.logout({});

            return result.data.logout.success;
          },
          onDone: "#success",
          onError: "#error",
        },
      },
      success: {
        type: "final",
        id: "success",
        entry: (context) => {
          if (context.data.successAction) {
            context.data.successAction(context.data);
          }
        },
        data: (context, event: any) => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.loggedOut",
          });
          // push("/");
          document.location.href = "/";
          return "yeah";
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
