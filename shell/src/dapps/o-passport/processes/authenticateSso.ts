import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import {AuthenticateAtDocument, ConsumeDepositedChallengeDocument} from "../../../shared/api/data/types";
import {ChallengeDocument, VerifyDocument} from "../data/auth/types";

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
      // entry: () => console.log(`Enter: authenticateSso.requestDelegateAuthCode`),
      invoke: {
        src: async (context) => {
          const apiClient = await window.o.apiClient.client.subscribeToResult();
          const result = await apiClient.mutate({
            mutation: AuthenticateAtDocument,
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
      // entry: () => console.log(`Enter: authenticateSso.requestChallenge`),
      invoke: {
        src: async (context) => {
          const authClient = await window.o.authClient.client.subscribeToResult();
          const result = await authClient.mutate({
            mutation: ChallengeDocument,
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
      // entry: () => console.log(`Enter: authenticateSso.consumeChallenge`),
      invoke: {
        src: async (context) => {
          if(new Date(context.data.delegateAuthCodeValidTo) < new Date()){
            throw new Error(`The context.data.delegateAuthCode is already expired.`);
          }

          const apiClient = await window.o.apiClient.client.subscribeToResult();
          const result = await apiClient.mutate({
            mutation: ConsumeDepositedChallengeDocument,
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
      // entry: () => console.log(`Enter: authenticateSso.exchangeCodeForToken`),
      invoke: {
        src: async (context) => {
          const authClient = await window.o.authClient.client.subscribeToResult();
          const result = await authClient.mutate({
            mutation: VerifyDocument,
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

          context.data.jwt = result.data.verify.jwt;
        },
        onDone: "#success",
        onError: "#error",
      },
    },
    success: {
      id: "success",
      // entry: () => console.log(`Enter: authenticateSso.success`),
      type: "final",
      data: (context) => {
        return context.data;
      }
    },
  },
});

export const authenticateSso: ProcessDefinition<void, AuthenticateSsoContextData> = {
  name: "authenticateSso",
  stateMachine: <any>processDefinition,
};
