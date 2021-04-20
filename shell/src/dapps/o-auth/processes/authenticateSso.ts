import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import gql from "graphql-tag";

export type AuthenticateSsoContextData = {
  appId:string,
  delegateAuthCode?:string,
  delegateAuthCodeValidTo?:string,
  challenge?:string,
  jwt?:string
};

export type AuthenticateSsoContext = ProcessContext<AuthenticateSsoContextData>;

const strings = {
};

const processDefinition = (processId: string) =>
  createMachine<AuthenticateSsoContext, any>({
    id: `${processId}`,
    initial: "requestDelegateAuthCode",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<AuthenticateSsoContext, any>("error"),

      requestDelegateAuthCode: {
        id: "requestDelegateAuthCode",
        invoke: {
          src: async (context) => {
            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: gql`
                mutation authenticateAt(
                  $appId: String!
                ) {
                  authenticateAt(appId: $appId) {
                    appId
                    success
                    errorMessage
                    challengeType
                    delegateAuthCode
                    validTo
                  }
                }
              `,
              variables: {
                appId: context.data.appId
              },
            });
            if (result.errors && result.errors.length > 0){
              throw new Error(`Couldn't request a delegate authentication code from the api: ${JSON.stringify(result.errors, null, 2)}`);
            }
            context.data.delegateAuthCode = result.data.authenticateAt.delegateAuthCode;
            context.data.delegateAuthCodeValidTo = result.data.authenticateAt.validTo;
          },
          onDone: "#requestChallenge",
          onError: "#error"
        }
      },
      requestChallenge: {
        id: "requestChallenge",
        invoke: {
          src: async (context) => {
            const authClient = await window.o.authClient.client.subscribeToResult();
            const result = await authClient.mutate({
              mutation: gql`
                mutation challenge(
                  $byAppId: String!
                  $forAppId: String!
                  $subject: String!
                ) {
                  challenge(byAppId: $byAppId, forAppId: $forAppId challengeType: "delegated" subject:$subject) {
                    success
                    errorMessage
                  }
                }
              `,
              variables: {
                byAppId: "__APP_ID__",
                forAppId: context.data.appId,
                subject: context.data.delegateAuthCode
              }
            });
            if (result.errors && result.errors.length > 0 || !result.data?.challenge?.success){
              throw new Error(`Couldn't request a challenge from the auth-server: ${JSON.stringify(result.errors ?? [], null, 2)}`);
            }
          },
          onDone: "consumeChallenge",
          onError: "#error"
        }
      },
      consumeChallenge: {
        id: "consumeChallenge",
        invoke: {
          src: async (context) => {
            if(new Date(context.data.delegateAuthCodeValidTo) < new Date()){
              throw new Error(`The context.data.delegateAuthCode is already expired.`);
            }

            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: gql`
                mutation consumeDepositedChallenge(
                  $delegateAuthCode: String!
                ) {
                  consumeDepositedChallenge(delegateAuthCode: $delegateAuthCode) {
                    success
                    challenge
                  }
                }
              `,
              variables: {
                delegateAuthCode: context.data.delegateAuthCode
              }
            });
            if (result.errors && result.errors.length > 0 || !result.data?.consumeDepositedChallenge?.success){
              throw new Error(`Couldn't request a challenge from the auth-server: ${JSON.stringify(result.errors ?? [], null, 2)}`);
            }
            context.data.challenge = result.data.consumeDepositedChallenge.challenge;
          },
          onDone: "exchangeCodeForToken",
          onError: "#error"
        }
      },
      // The code was either manually entered or pre-configured at launch.
      // Exchange it for the actual token and redirect the user to the application.
      exchangeCodeForToken: {
        id: "exchangeCodeForToken",
        invoke: {
          src: async (context) => {
            const authClient = await window.o.authClient.client.subscribeToResult();
            const result = await authClient.mutate({
              mutation: gql`
                mutation verify($oneTimeToken: String!) {
                  verify(oneTimeToken: $oneTimeToken) {
                    success
                    errorMessage
                    jwt
                    exchangeTokenUrl
                  }
                }
              `,
              variables: {
                oneTimeToken: context.data.challenge
              }
            });

            if (!result.data.verify.success) {
              console.error(
                `Couldn't request a challenge:`,
                result.data.verify.errorMessage
              );
              throw new Error(result.data.verify.errorMessage);
            }

            return result.data.verify.jwt;
          },
          onDone: "#success",
          onError: "#error",
        },
      },
      success: {
        id: "success",
        type: "final",
        data: (context, event) => {
          return event.data;
        }
      },
    },
  });

// A ProcessDefinition always has a input and an output value (the generic parameters).
// Depending on how 'void' is placed, it can mimic either a function or procedure.
// Here it simply returns all the data that was collected in the process (AuthenticateContextData)
// if no error occurs in the promise.
export const authenticate: ProcessDefinition<void, AuthenticateSsoContext> = {
  name: "authenticate",
  stateMachine: <any>processDefinition,
};
