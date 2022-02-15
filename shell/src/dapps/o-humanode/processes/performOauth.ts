import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import HtmlViewer from "@o-platform/o-editors/src/HtmlViewer.svelte";
import {Generate} from "@o-platform/o-utils/dist/generate";

export type PerformOauthContextData = {
  nonce: string, // A random string
  origin: string, // The source page from which this flow was started.
  // nonce + origin will be packed together in the 'state' field
  oauthRequest: {
    clientId: string,
    redirectUri: string,
    scope: string,
    accessType: "offline",
    responseType: "code",
    prompt: "consent"
  },
  oauthResponse: {
    state?: string,
    code?: string,
    scope?: string
    error?: string
  }
  successAction?: (data: PerformOauthContextData) => void;
};

export type PerformOauthContext = ProcessContext<PerformOauthContextData>;

const processDefinition = (processId: string) =>
  createMachine<PerformOauthContext, any>({
    id: `${processId}:performOauth`,
    initial: "init",
    states: {
      ...fatalError<PerformOauthContext, any>("error"),

      init: {
        always: [{
          cond: (context) => !context.data.oauthResponse,
          target: "#info"
        }, {
          cond: (context) => !!context.data.oauthResponse && !!context.data.oauthResponse.error,
          target: "#cancelled"
        }, {
          cond: (context) => !!context.data.oauthResponse && !context.data.oauthResponse.error,
          target: "#callback"
        }]
      },
      info: prompt({
        id: "info",
        field: "__",
        component: HtmlViewer,
        params: {
          view: {
            title: "Verify your uniqueness",
            description: "We need to check if you already got an account with us. Please proceed to Humanode to verify your uniqueness",
            submitButtonText: "Verify me",
          },
          html: () => "",
          hideNav: false,
        },
        navigation: {
          next: "#redirect",
        },
      }),
      redirect: {
        id: "redirect",
        entry: (context) => {
          const state = Generate.randomHexString(8) + "-" + context.data.origin ?? "";

          let url = `https://accounts.google.com/o/oauth2/v2/auth`
              url += `?client_id=${context.data.oauthRequest.clientId}`
              url += `&redirect_uri=${context.data.oauthRequest.redirectUri}`
              url += `&scope=${context.data.oauthRequest.scope}`
              url += `&access_type=${context.data.oauthRequest.accessType}`
              url += `&response_type=${context.data.oauthRequest.responseType}`
              url += `&state=${state}`
              url += `&prompt=${context.data.oauthRequest.prompt}`;

          window.location.href = url;
        }
      },
      cancelled: prompt({
        id: "cancelled",
        field: "__",
        component: HtmlViewer,
        params: {
          view: {
            title: "Couldn't complete the verification",
            description: "The process was cancelled or an error occurred. Please try again.",
            submitButtonText: "Try again",
          },
          html: () => "",
          hideNav: false,
        },
        navigation: {
          next: "#redirect",
        },
      }),
      callback: {
        id: "callback",
        entry: () => {
          // find out where the user wants to be redirected (from state)
        }
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
            type: "shell.authenticated",
            profile: event.data,
          });
          return event.data;
        },
      },
    }
  });

export const performOauth: ProcessDefinition<
  void,
  PerformOauthContext
> = {
  name: "performOauth",
  stateMachine: <any>processDefinition,
};
