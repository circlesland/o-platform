import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {prompt} from "@o-platform/o-process/dist/states/prompt";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {assign, createMachine} from "xstate";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import HtmlViewer from "@o-platform/o-editors/src/HtmlViewer.svelte";
import {Generate} from "@o-platform/o-utils/dist/generate";
import {ApiClient} from "../../../shared/apiConnection";
import {ClientAssertionJwtDocument, ClientAssertionJwtQueryVariables} from "../../../shared/api/data/types";

export type PerformOauthContextData = {
  nonce: string, // A random string
  origin: string, // The source page from which this flow was started.
  // nonce + origin will be packed together in the 'state' field
  oauthRequest: {
    clientAssertion: string;
    clientId: string,
    redirectUri: string,
    scope: string,
    accessType: "offline",
    responseType: "code",
    prompt: "consent"
  },
  authorizationResponse: {
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
        entry: assign({
          data: (context) => {
            return {
              ...context.data,
              oauthRequest: {
                ...context.data.oauthRequest,
                clientId: "circles-ubi-jwks",
                redirectUri: "http://localhost:5000/",
                scope: "openid",
                responseType: "code",
                prompt: "consent",
                accessType: "offline",
              },
              authorizationResponse: {
                ...context.data.authorizationResponse,
              }
            }
          }
        }),
        always: [{
          cond: (context) => !context.data.authorizationResponse,
          target: "#info"
        }, {
          cond: (context) => !!context.data.authorizationResponse && !!context.data.authorizationResponse.error,
          target: "#cancelled"
        }, {
          cond: (context) => !!context.data.authorizationResponse && !context.data.authorizationResponse.error,
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
      getClientAssertion: {
        invoke: {
          src: async context => {
            context.data.oauthRequest.clientAssertion =
              await ApiClient.query<string, ClientAssertionJwtQueryVariables>(ClientAssertionJwtDocument, {});
          },
          onDone: "redirect"
        }
      },
      redirect: {
        id: "redirect",
        entry: (context) => {
          const state = Generate.randomHexString(8) + "-" + context.data.origin ?? "";
          let url = `https://auth.staging.oauth2.humanode.io/oauth2/auth`
              url += `?client_id=${context.data.oauthRequest.clientId}`
              url += `&redirect_uri=${context.data.oauthRequest.redirectUri}`
              url += `&scope=${context.data.oauthRequest.scope}`
              url += `&access_type=${context.data.oauthRequest.accessType}`
              url += `&client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer`
              url += `&client_assertion=${context.data.oauthRequest.clientAssertion}`
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
        entry: (context) => {
          console.log("Callback:", context.data);
          // find out where the user wants to be redirected (from state)
        },
        invoke: {
          src: async context => {
            console.log("Exchange token:", context.data);
            const response = await fetch("https://auth.staging.oauth2.humanode.io/oauth2/token",
            {
              method: "POST",
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
              },
              body: new URLSearchParams({
                client_id: context.data.oauthRequest.clientId,
                grant_type: "authorization_code",
                code: context.data.authorizationResponse.code,
                redirect_uri: "http://localhost:5000/"
              })
            });
            console.log("Code exchange response:", await response.json());
          },
          onDone: "success"
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
