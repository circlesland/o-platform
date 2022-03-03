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
  labelLoginEmail: window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.srtings.labelLoginEmail"),
  labelVerificationCode: (email: string) =>
  window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.srtings.labeVerificationCode"),
  placeholder: window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.srtings.placeholder"),
};

const editorContent = {
  email: {
    title: window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.editorContent.email.title"),
    description: window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.editorContent.email.description"),
    placeholder: window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.editorContent.email.placeholder"),
    submitButtonText: window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.editorContent.email.submitButtonText"),
  },
  terms_privacy: {
    title: window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.editorContent.terms_privacy.title"),
    description: window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.editorContent.terms_privacy.description"),
    submitButtonText: window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.editorContent.terms_privacy.submitButtonText"),
  },
  verification: {
    title: window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.editorContent.verification.title"),
    description: window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.editorContent.verification.description"),
    placeholder: window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.editorContent.verification.placeholder"),
    submitButtonText: window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.editorContent.verification.submitButtonText"),
  },
  code: {
    title: window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.editorContent.code.title"),
    description: window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.editorContent.code.description"),
    placeholder: window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.editorContent.code.placeholder"),
    submitButtonText: window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.editorContent.code.submitButtonText"),
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
            message: window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.acquireSession.message"),
          });
        },
        invoke: {
          src: async (context) => {
            if (!context.data.eoaAddress) {
              throw new Error(window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.acquireSession.errors.contextsPropertyNotSet"));
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
              throw new Error(window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.acquireSession.errors.privateKeyNotUnlocked"))
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
              throw new Error(window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.acquireSession.errors.couldNotGetSession"))
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
          context.data.errorRequestingChallenge = window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.errorRequestingChallenge.error");
        },
        component: HtmlViewer,
        isSensitive: true,
        params: {
          submitButtonText: window.i18n("dapps.o-passport.processes.identify.acquireSession.authenticate.authenticate2.errorRequestingChallenge.submitButtonText"),
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
