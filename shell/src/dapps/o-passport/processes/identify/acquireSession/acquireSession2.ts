import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { ipc } from "@o-platform/o-process/dist/triggers/ipc";
import { AuthenticateContext } from "./authenticate/authenticate2";
import { RequestSessionChallengeDocument, VerifySessionChallengeDocument } from "../../../../../shared/api/data/types";
import { loginWithTorus } from "../../../../o-onboarding/processes/loginWithTorus";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import HtmlViewer from "../../../../../../../packages/o-editors/src/HtmlViewer.svelte";
import ErrorPage from "../../../../../shared/atoms/Error.svelte";

export type AcquireSessionContextData = {
  appId?: string;
  eoaAddress?: string;
  userInfo?: any;
  successAction?: (data: AcquireSessionContextData) => void;
};

export type AcquireSessionContext = ProcessContext<AcquireSessionContextData>;

const processDefinition = (processId: string) =>
  createMachine<AcquireSessionContext, any>({
    id: `${processId}`,

    initial: "loginWithTorus",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<AuthenticateContext, any>("error"),

      loginWithTorus: {
        on: {
          ...(<any>ipc(`loginWithTorus`)),
        },
        invoke: {
          id: "loginWithTorus",
          src: loginWithTorus.stateMachine(`loginWithTorus`),
          data: {
            data: {},
            dirtyFlags: {},
            messages: {},
          },
          onDone: {
            actions: (context, event) => {
              const data: {
                accountAddress: string;
                userInfo: any;
              } = event.data;
              context.data.eoaAddress = data.accountAddress;
              context.data.userInfo = data.userInfo;
            },
            target: "#acquireSession",
          },
          onError: "#error",
        },
      },
      acquireSession: {
        id: "acquireSession",
        entry: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: window.i18n(
              "dapps.o-passport.processes.identify.acquireSession.acquireSession2.acquireSession.message"
            ),
          });
        },
        invoke: {
          src: async (context) => {
            if (!context.data.eoaAddress) {
              throw new Error(
                window.i18n(
                  "dapps.o-passport.processes.identify.acquireSession.acquireSession2.acquireSession.error.contextsPropertyNotSet"
                )
              );
            }
            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: RequestSessionChallengeDocument,
              variables: {
                address: context.data.eoaAddress,
              },
            });

            if (result.errors && result.errors.length) {
              console.error(result.errors);
              throw new Error(JSON.stringify(result.errors));
            }

            const challenge = result.data.requestSessionChallenge;
            const pk = sessionStorage.getItem("circlesKey");
            if (!pk) {
              throw new Error(
                window.i18n(
                  "dapps.o-passport.processes.identify.acquireSession.acquireSession2.acquireSession.error.privatKeyNotUnlocked"
                )
              );
            }
            const acc = RpcGateway.get().eth.accounts.privateKeyToAccount(pk);
            const { message, signature } = acc.sign(challenge);

            const sessionResult = await apiClient.mutate({
              mutation: VerifySessionChallengeDocument,
              variables: {
                challenge: message,
                signature: signature,
              },
            });

            if (sessionResult.data.errors && sessionResult.data.errors.length) {
              console.error(sessionResult.data.errors);
              throw new Error(JSON.stringify(sessionResult.data.errors));
            }
            if (!sessionResult.data.verifySessionChallenge?.success) {
              throw new Error(
                window.i18n(
                  "dapps.o-passport.processes.identify.acquireSession.acquireSession2.acquireSession.error.couldNotGetSession"
                )
              );
            }
          },
          onDone: "#success",
          onError: "#error",
        },
      },
      error: prompt({
        id: "error",
        field: "__",
        component: ErrorPage,
        params: {
          view: {
            error: {
              title: "OOps! Something went wrong",
            },
          },
          hideNav: false,
        },
      }),

      // Wait for the user to enter the code he received in the login-email
      errorRequestingChallenge: prompt<AuthenticateContext, any>({
        field: "errorRequestingChallenge",
        entry: (context) => {
          context.data.errorRequestingChallenge = window.i18n(
            "dapps.o-passport.processes.identify.acquireSession.acquireSession2.acquireSession.errorRequestingChallenge.error"
          );
        },
        component: HtmlViewer,
        isSensitive: true,
        params: {
          submitButtonText: window.i18n(
            "dapps.o-passport.processes.identify.acquireSession.acquireSession2.acquireSession.errorRequestingChallenge.submitButtonText"
          ),
          html: (context) => context.data.errorSendingAuthMail,
        },
        navigation: {
          next: "#acquireSession",
        },
      }),
      success: {
        id: "success",
        entry: (context) => {
          if (context.data.successAction) {
            // The websocket connection was already established previously without session-cookie.
            // Since we now have one the connection should re-established the next time its used.
            try {
              window.o.apiClient.reset();
            } catch (e) {
              console.error(e);
            }
            context.data.successAction(context.data);
          }
        },
        data: (context) => {
          return "if you don't always return something, everything will break!";
        },
        type: "final",
      },
    },
  });

export const acquireSession: ProcessDefinition<void, void> = {
  name: "acquireSession",
  stateMachine: <any>processDefinition,
};
