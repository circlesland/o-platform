import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import HtmlViewer from "@o-platform/o-editors/src/HtmlViewer.svelte";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import {ipc} from "@o-platform/o-process/dist/triggers/ipc";
import {loginWithTorus} from "../../../../../o-onboarding/processes/loginWithTorus";
import {RequestSessionChallengeDocument, VerifySessionChallengeDocument} from "../../../../../../shared/api/data/types";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";

export type AuthenticateContextData = {
  eoaAddress?: string;
  errorRequestingChallenge?: string;
  errorExchangingCode?: string;
};

/**
 * This is the context on which the process will work.
 * The actual fields are defined above in the 'AuthenticateContextData' type.
 * The 'AuthenticateContextData' type is also the return value of the process (see bottom for the signature).
 */
export type AuthenticateContext = ProcessContext<AuthenticateContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
  labelLoginEmail:
    "Welcome to CirclesLand. <br/><span class='text-base text-light-dark font-normal block mt-3'>A pleasure you found your way here. Please provide your email address to Sign-In</span>",
  labelVerificationCode: (email: string) =>
    `Please enter pin<br/><span class='text-base text-light-dark font-normal block mt-3'>We have send you a 6 digit login pin to your mail ${email}.</span><br/><span class='text-light-dark text-xs font-normal'> It may take a moment. Also check your spam folder</span>`,
  placeholder: "email",
};

const editorContent = {
  email: {
    title: "Welcome to CirclesLand",
    description:
      "A pleasure you found your way here. Please provide your email address to Sign-In.",
    placeholder: "Email address",
    submitButtonText: "Let me in",
  },
  terms_privacy: {
    title: "Terms & Privacy",
    description:
      "CirclesLand is built on a blockchain, which by design is a transparent and permanent decentralized database. With your signup you agree that your profile, transactions and friend connections will be irrevocably public.<br/><br/><span class='text-xs'>For details read our <a href='https://blog.circles.land/terms-of-service' class='text-primary' target='_blank' alt='privacy policy & terms of service'>privacy policy & terms of service</a></span>",
    submitButtonText: "I read and accept them",
  },
  verification: {
    title: "Welcome to CirclesLand",
    description:
      "A pleasure you found your way here. Please provide your email address to Sign-In",
    placeholder: "Email address",
    submitButtonText: "Let me in",
  },
  code: {
    title: "Please enter encryptingPin",
    description:
      "We have send you a 6 digit login encryptingPin to your mail.<br/><br/><span class='text-xs'>It may take a moment. Also check your spam folder.</span>",
    placeholder: "Enter Pin",
    submitButtonText: "Login",
  }
};

const processDefinition = (processId: string) =>
  createMachine<AuthenticateContext, any>({
    id: `${processId}`,
    initial: "loginWithTorus",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<AuthenticateContext, any>("error"),

      loginWithTorus: {
        on: {
          ...<any>ipc(`loginWithTorus`)
        },
        invoke: {
          id: "loginWithTorus",
          src: loginWithTorus.stateMachine(`loginWithTorus`),
          data: {
            data: {},
            dirtyFlags:{},
            messages:{},
          },
          onDone: {
            actions:(context, event) => {
              context.data.eoaAddress = event.data;
            },
            target:"#acquireSession"
          },
          onError: "#error"
        }
      },
      acquireSession: {
        id: "acquireSession",
        entry: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: `Requesting the challenge`,
          });
        },
        invoke: {
          src: async (context) => {
            if (!context.data.eoaAddress) {
              throw new Error(`The context's 'eoaAddress' property is not set but required by this step`);
            }
            const apiClient =
              await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: RequestSessionChallengeDocument,
              variables: {
                address: context.data.eoaAddress
              }
            });

            if (result.errors && result.errors.length) {
              console.error(result.errors);
              throw new Error(JSON.stringify(result.errors));
            }

            const challenge = result.data.requestSessionChallenge;
            const pk = sessionStorage.getItem("circlesKey");
            if (!pk) {
              throw new Error(`The private key is not unlocked`)
            }
            const acc = RpcGateway.get().eth.accounts.privateKeyToAccount(pk);
            const {message, signature} = acc.sign(challenge);

            const sessionResult = await apiClient.mutate({
              mutation: VerifySessionChallengeDocument,
              variables: {
                challenge: message,
                signature: signature
              },
            });

            if (sessionResult.data.errors && sessionResult.data.errors.length) {
              console.error(sessionResult.data.errors);
              throw new Error(JSON.stringify(sessionResult.data.errors));
            }
            if (!sessionResult.data.verifySessionChallenge?.success) {
              throw new Error(`Couldn't get a session using a signed challenge.`)
            }
          },
          onDone: "#success",
          onError: "#errorRequestingChallenge",
        },
      },
      // Wait for the user to enter the code he received in the login-email
      errorRequestingChallenge: prompt<AuthenticateContext, any>({
        field: "errorRequestingChallenge",
        entry: (context) => {
          context.data.errorRequestingChallenge = `An error occurred while requesting an auth-challenge.`;
        },
        component: HtmlViewer,
        isSensitive: true,
        params: {
          submitButtonText: "Try again",
          html: (context) => context.data.errorSendingAuthMail,
        },
        navigation: {
          next: "#acquireSession",
        },
      }),
      success: {
        id: "success",
        type: "final",
        data: (context, event) => {
          return event.data;
        },
      },
    },
  });

// A ProcessDefinition always has a input and an output value (the generic parameters).
// Depending on how 'void' is placed, it can mimic either a function or procedure.
// Here it simply returns all the data that was collected in the process (AuthenticateContextData)
// if no error occurs in the promise.
export const authenticate: ProcessDefinition<void, AuthenticateContextData> = {
  name: "authenticate",
  stateMachine: <any>processDefinition,
};
