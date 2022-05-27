import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {prompt} from "@o-platform/o-process/dist/states/prompt";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {assign, createMachine} from "xstate";
import HtmlViewer from "@o-platform/o-editors/src/HtmlViewer.svelte";
import {Generate} from "@o-platform/o-utils/dist/generate";
import {ApiClient} from "../../../shared/apiConnection";
import {
  ClientAssertionJwtDocument,
  ClientAssertionJwtQueryVariables,
  ProofUniquenessDocument,
  ProofUniquenessMutationVariables,
  ProofUniquenessResult
} from "../../../shared/api/data/types";
import {Environment} from "../../../shared/environment";
import {me} from "../../../shared/stores/me";

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
                clientId: Environment.humanodeClientId,
                redirectUri: Environment.humanodeRedirectUrl,
                scope: Environment.humanodeScope,
                responseType: "code",
                prompt: "consent",
                accessType: "offline",
              }
            }
          }
        }),
        always: [{
          cond: (context) => !context.data.authorizationResponse,
          target: "#getClientAssertion"
        }, {
          cond: (context) => !!context.data.authorizationResponse && !!context.data.authorizationResponse.error,
          target: "#cancelled"
        }, {
          cond: (context) => !!context.data.authorizationResponse.code && !context.data.authorizationResponse.error,
          target: "#callback"
        }]
      },
      getClientAssertion: {
        id: "getClientAssertion",
        invoke: {
          src: async context => {
            context.data.oauthRequest.clientAssertion =
              await ApiClient.query<string, ClientAssertionJwtQueryVariables>(ClientAssertionJwtDocument, {});
          },
          onDone: "#redirect"
        }
      },
      redirect: {
        id: "redirect",
        entry: (context) => {
          const state = Generate.randomHexString(8) + "-" + context.data.origin ?? "";
          const urlParams = new URLSearchParams({
            client_id: context.data.oauthRequest.clientId,
            redirect_uri: context.data.oauthRequest.redirectUri,
            scope: context.data.oauthRequest.scope,
            access_type: context.data.oauthRequest.accessType,
            client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
            client_assertion: `${context.data.oauthRequest.clientAssertion}`,
            response_type: `${context.data.oauthRequest.responseType}`,
            state: `${state}`,
            prompt: `${context.data.oauthRequest.prompt}`
          });

          window.location.href = `${Environment.humanodeAuthUrl}?${urlParams.toString()}`;
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
        invoke: {
          src: async context => {
            context.data.oauthRequest.clientAssertion =
              await ApiClient.query<string, ClientAssertionJwtQueryVariables>(ClientAssertionJwtDocument, {});

            const response = await fetch(Environment.humanodeTokenUrl,
            {
              method: "POST",
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
              },
              body: new URLSearchParams({
                client_id: Environment.humanodeClientId,
                grant_type: "authorization_code",
                code: context.data.authorizationResponse.code,
                redirect_uri: Environment.humanodeRedirectUrl,
                client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                client_assertion: `${context.data.oauthRequest.clientAssertion}`
              })
            });

            const responseData = await response.arrayBuffer();
            const responseString = Buffer.from(responseData).toString("utf-8");
            await ApiClient.mutate<ProofUniquenessResult, ProofUniquenessMutationVariables>(
              ProofUniquenessDocument,
              {
                humanodeToken: responseString
              }
            );
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
          me.reload().then(() => {
            if (context.data.authorizationResponse.state?.indexOf("dashboard") > -1) {
              window.location.href = window.location.href.split("?")[0] + "#/home";
            } else if (context.data.authorizationResponse.state?.indexOf("locations") > -1) {
              window.location.href = window.location.href.split("?")[0] + "#/marketplace/locations";
            } else {
              window.location.href = window.location.href.split("?")[0];
            }
          });
        }
      }
    }
  });

export const performOauth: ProcessDefinition<
  void,
  PerformOauthContext
> = {
  name: "performOauth",
  stateMachine: <any>processDefinition,
};
