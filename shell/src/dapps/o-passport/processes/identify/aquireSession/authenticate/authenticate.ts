import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import EmailAddressEditor from "@o-platform/o-editors/src/EmailAddressEditor.svelte";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import HtmlViewer from "@o-platform/o-editors/src/HtmlViewer.svelte";
import BooleanEditor from "@o-platform/o-editors/src/BooleanEditor.svelte";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import * as yup from "yup";
import {
  LoginWithEmailDocument, TosDocument,
  VerifyDocument,
} from "../../../../data/auth/types";
import {SessionInfoDocument} from "../../../../data/api/types";

export type AuthenticateContextData = {
  appId?: string;
  tosUrl?: string;
  tosVersion?: string;
  loginEmail?: string;
  hashedEmail?: string;
  acceptTos?: boolean;
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
  labelLoginEmail:
    "Welcome, a pleasure you found your way to CirclesLand. <br/><strong class='text-primary block mt-3'>Please provide your email address</strong>",
  labelVerificationCode:
    `An email has been send to you, please check your inbox. To login please click the link in the email or enter the code you received by mail. <br/><span class="text-xs">It may take a moment. Also check your spam folder.</span>`,
  placeholder: "you@example.com",
};
async function sha256(str) {
  const strBuffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', strBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
}

export type ToSConsents = {
  [emailHash:string]:string
};

const processDefinition = (processId: string) =>
  createMachine<AuthenticateContext, any>({
    id: `${processId}`,
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
        component: EmailAddressEditor,
        params: {
          label: strings.labelLoginEmail,
          placeholder: strings.placeholder,
          submitButtonText: "Let me in",
        },
        dataSchema: yup
          .string()
          .required("Please provide your email address")
          .email("That doesn't seem like a valid email address"),
        navigation: {
          next: "#getTosVersion",
        },
      }),
      getTosVersion: {
        id: "getTosVersion",
        invoke: {
          src: async (context) => {
            // TODO: E-Mail hashing doesn't belong in the 'getTosVersion' step
            context.data.hashedEmail = await sha256(context.data.loginEmail);

            const authClient = await window.o.authClient.client.subscribeToResult();
            const result = await authClient.query({
              query: TosDocument,
              variables: {
                appId: context.data.appId
              }
            });
            if (result.errors && result.errors.length > 0 || !result.data.tos.found) {
              result.errors?.forEach(o => console.error(o));
              throw new Error(`Couldn't query the terms of service for appId '${context.data.appId}'.`);
            }
            context.data.tosUrl = result.data.tos.url;
            context.data.tosVersion = result.data.tos.version;
          },
          onDone: "#checkSkipAcceptTos",
          onError: "#error"
        }
      },
      checkSkipAcceptTos: {
        id: "checkSkipAcceptTos",
        always: [
          {
            cond: (context) => {
              const storedConsentsJson = localStorage.getItem("tosConsents");
              if (!storedConsentsJson) {
                return false;
              }
              try {
                const storedConsents:ToSConsents = JSON.parse(storedConsentsJson);
                if (!storedConsents || !storedConsents[context.data.hashedEmail]) {
                  return false;
                }

                if (storedConsents[context.data.hashedEmail] !== context.data.tosVersion) {
                  delete storedConsents[context.data.hashedEmail];
                  localStorage.setItem("tosConsents", JSON.stringify(storedConsents));
                  return false;
                }
              } catch (e) {
                localStorage.removeItem("tosConsents");
                return false;
              }

              return true;
            },
            target: "#requestAuthCode",
          },
          {
            target: "#acceptTos",
          },
        ],
      },
      // Ask the user to accept TOS
      acceptTos: prompt<AuthenticateContext, any>({
        fieldName: "acceptTos",

        component: HtmlViewer,
        params: {
        //  link: "",
        //  linkLabel: "terms of service & privacy policy",
        //submitButtonText: "",
          submitButtonText: "I read and accept them",
          html: (context) => `CirclesLand is built on a blockchain, which by design is a transparent and permanent decentralized database. 
          With your signup you agree that your profile, transactions and friend connections will be irrevocably public.<br/><br/>
          For details read our <a class="text-primary" href="https://circlesland.ghost.io/terms-of-service">privacy policy & terms of service</a>`,
        },
/*
        dataSchema: yup
          .boolean()
          .oneOf([true], "Please accept the terms to proceed"),
*/
        navigation: {
          next: "#storeAcceptTos",
          canGoBack: () => true,
          previous: "#loginEmail"
        },
      }),
      storeAcceptTos: {
        id: "storeAcceptTos",
        entry: (context) => {
          const storedConsentsJson = localStorage.getItem("tosConsents");

          try {
            let storedConsents: ToSConsents = storedConsentsJson
                ? JSON.parse(storedConsentsJson)
                : undefined;

            if (!storedConsents) {
              storedConsents = {};
            }

            if (!storedConsents[context.data.hashedEmail]) {
              storedConsents[context.data.hashedEmail] = context.data.tosVersion;
            }

            localStorage.setItem("tosConsents", JSON.stringify(storedConsents));
          } catch (e) {
            localStorage.removeItem("tosConsents");
          }
        },
        always: "#requestAuthCode",
      },
      // Request an auth code to the given e-mail address
      // and then go to the 'code' input step.
      requestAuthCode: {
        id: "requestAuthCode",
        invoke: {
          src: async (context) => {
            const authClient = await window.o.authClient.client.subscribeToResult();
            const result = await authClient.mutate({
              mutation: LoginWithEmailDocument,
              variables: {
                appId: context.data.appId,
                emailAddress: context.data.loginEmail,
                acceptTosVersion: context.data.tosVersion
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
        isSensitive: true,
        params: {
          label: strings.labelVerificationCode,
          submitButtonText: "Login",
        },
        dataSchema: yup.string().required("Please enter your one time token."),
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
            const authClient = await window.o.authClient.client.subscribeToResult();
            const result = await authClient.mutate({
              mutation: VerifyDocument,
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
