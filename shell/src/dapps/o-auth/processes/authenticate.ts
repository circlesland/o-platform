import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import BooleanEditor from "@o-platform/o-editors/src/BooleanEditor.svelte";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import gql from "graphql-tag";

export type AuthenticateContextData = {
  appId?: string;
  loginEmail?: string;
  acceptTos?:boolean;
  code?: string;
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
  labelLoginEmail: "Please enter your e-mail address",
  labelVerificationCode:
    "Enter your authentication code below or click the link in the e-mail to sign-in",
  placeholder: "you@example.com",
};

const processDefinition = (processId: string) =>
  createMachine<AuthenticateContext, any>({
    id: `${processId}:authenticate`,
    initial: "findEntryPoint",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<AuthenticateContext, any>("error"),

      // If a 'code' was supplied, we skip right to the 'exchangeCodeForToken' step,
      // else we ask the user for the e-mail address and send a challenge.
      findEntryPoint: {
        id: "findEntryPoint",
        always: [
          {
            cond: (context) => typeof context.data.code === "string",
            target: "exchangeCodeForToken",
          },
          {
            target: "loginEmail",
          },
        ],
      },
      loginEmail: prompt<AuthenticateContext, any>({
        fieldName: "loginEmail",
        component: TextEditor,
        params: {
          label: strings.labelLoginEmail,
          placeholder: strings.placeholder,
        },
        navigation: {
          next: "#checkAcceptTos"
        },
      }),
      checkAcceptTos: {
        id: "checkAcceptTos",
        always: [{
          cond: () => true,
          target: "#acceptTos"
        }, {
          target: "#requestAuthCode"
        }]
      },
      // Ask the user for the e-mail address
      acceptTos: prompt<AuthenticateContext, any>({
        fieldName: "acceptTos",
        component: BooleanEditor,
        params: {
          label: "Do you accept our ",
          link: "https://circles.name/tos",
          linkLabel: "terms of service"
        },
        navigation: {
          next: "#requestAuthCode"
        },
      }),
      // Request an auth code to the given e-mail address
      // and then go to the 'code' input step.
      requestAuthCode: {
        id: "requestAuthCode",
        invoke: {
          src: async (context) => {
            const result = await window.o.authClient.mutate({
              mutation: gql`
                mutation loginWithEmail(
                  $appId: String!
                  $emailAddress: String!
                ) {
                  loginWithEmail(appId: $appId, emailAddress: $emailAddress) {
                    success
                    errorMessage
                  }
                }
              `,
              variables: {
                appId: context.data.appId,
                emailAddress: context.data.loginEmail,
              },
            });

            if (!result.data.loginWithEmail.success) {
              console.error(
                `Couldn't request a challenge:`,
                result.data.loginWithEmail.errorMessage
              );
              throw new Error(result.data.loginWithEmail.errorMessage);
            }
          },
          onDone: "#code",
          onError: "#error",
        },
      },
      // Wait for the user to enter the code he received in the login-email
      code: prompt<AuthenticateContext, any>({
        fieldName: "code",
        component: TextEditor,
        params: {
          label: strings.labelVerificationCode,
        },
        navigation: {
          next: "#exchangeCodeForToken",
        },
      }),
      // The code was either manually entered or pre-configured at launch.
      // Exchange it for the actual token and redirect the user to the application.
      exchangeCodeForToken: {
        id: "exchangeCodeForToken",
        invoke: {
          src: async (context) => {
            const result = await window.o.authClient.mutate({
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
                oneTimeToken: context.data.code.trim(),
              },
            });

            if (!result.data.verify.success) {
              console.error(
                `Couldn't request a challenge:`,
                result.data.verify.errorMessage
              );
              throw new Error(result.data.verify.errorMessage);
            }

            return result.data.verify.exchangeTokenUrl + result.data.verify.jwt;
          },
          onDone: "#redirectToApplication",
          onError: "#error",
        },
      },
      redirectToApplication: {
        id: "redirectToApplication",
        entry: (context, event) => {
          window.location = event.data;
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
