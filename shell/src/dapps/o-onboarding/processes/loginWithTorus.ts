import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { createMachine } from "xstate";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { promptChoice } from "../../o-passport/processes/identify/prompts/promptChoice";
import ButtonStackSelector from "@o-platform/o-editors/src/ButtonStackSelector.svelte";
import PinInputEditor from "../../../../../packages/o-editors/src/Pin/PinInputEditor.svelte";
import * as yup from "yup";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { KeyManager } from "../../o-passport/data/keyManager";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import HtmlViewer from "../../../../../packages/o-editors/src/HtmlViewer.svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { show } from "@o-platform/o-process/dist/actions/show";
import ErrorView from "../../../shared/atoms/Error.svelte";
import { getOpenLogin } from "../../../shared/openLogin";
import {
  FindInvitationCreatorDocument,
  Profile,
  ProfilesDocument,
  ProfilesQueryVariables,
  QueryFindInvitationCreatorArgs
} from "../../../shared/api/data/types";
import {ApiClient} from "../../../shared/apiConnection";
import {AvataarGenerator} from "../../../shared/avataarGenerator";

export type LoginWithTorusContextData = {
  chooseFlow?: {
    key: string;
    label: string;
  };
  userInfo?: any;
  privateKey?: string;
  encryptionPin?: string;
  decryptionPin?: string;
  accountAddress?: string;
  inviterProfile?: Profile;
  successAction?: (data: LoginWithTorusContextData) => void;
};

export type LoginWithTorusContext = ProcessContext<LoginWithTorusContextData>;

const loginOptions = [
  {
    key: "google",
    label: "Login with Google",
    target: "#google",
    class: "btn btn-outline",
    icon: "google",
  },
  {
    key: "apple",
    label: "Login with Apple",
    target: "#apple",
    class: "btn btn-outline",
    icon: "apple",
  },
  {
    key: "github",
    label: "Login with Github",
    target: "#github",
    class: "btn btn-outline",
    icon: "github",
  } /*
          {
            key: "email",
            label: "Login with E-Mail",
            target: "#email",
            class: "btn-info",
          }*/,
];

const processDefinition = (processId: string) =>
  createMachine<LoginWithTorusContext, any>(
    {
      id: `${processId}:loginWithTorus`,
      initial: "decideWelcomeMessage",
      states: {
        // Include a default 'error' state that propagates the error by re-throwing it in an action.
        // TODO: Check if this works as intended
        ...fatalError<LoginWithTorusContext, any>("error"),

        decideWelcomeMessage: {
          invoke: {
            src: async (context) => {
              const invitationCode = localStorage.getItem("circlesInvite");
              if (invitationCode) {
                context.data.inviterProfile = await ApiClient.query<Profile, QueryFindInvitationCreatorArgs>(
                  FindInvitationCreatorDocument,
                  {
                    code: invitationCode
                  }
                );
              }
            },
            onDone: [{
              cond: (context) => !!context.data.inviterProfile,
              target: "showInviterMessage"
            }, {
              target: "init"
            }]
          }
        },

        showInviterMessage: prompt({
          id: "showInviterMessage",
          field: "__",
          component: HtmlViewer,
          params: {
            view: {
              title: "Welcome",
              submitButtonText: "Next",
            },
            html: (context) => `<img style="max-width:128px;" src="${
              !context.data.inviterProfile.avatarUrl 
                ? AvataarGenerator.generate(context.data.inviterProfile.circlesAddress) 
                : context.data.inviterProfile.avatarUrl}" /> <b>${context.data.inviterProfile.firstName
              }  ${context.data.inviterProfile.lastName 
              ? "" + context.data.inviterProfile.lastName 
              : ""}</b> invited you to CirclesLand.<br/><br/>Click 'Next' to Login`,
            submitButtonText: "Login",
            hideNav: false,
          },
          navigation: {
            next: "#init",
          },
        }),

        init: {
          id: "init",
          invoke: {
            src: async (context) => {
              const keyManager = new KeyManager(null);
              await keyManager.load();
              const accAddress = keyManager.torusKeyAddress;
              if (accAddress) {
                context.data.accountAddress = accAddress;
              } else {
                // Init open login
                await getOpenLogin();
              }
            },
            onDone: [
              {
                cond: (context) => context.data.accountAddress === undefined,
                target: "chooseFlow",
              },
              {
                cond: (context) => context.data.accountAddress !== undefined,
                target: "#enterDecryptionPin",
              },
            ],
          },
        },
        chooseFlow: promptChoice({
          id: "chooseFlow",
          component: ButtonStackSelector,
          params: {
            view: {
              title: "Welcome to Cirles Land",
              description:
                "Please choose a sign-in option<br/> <small>By choosing one of the sign-in options you agree to our <a href='https://coda.io/@circlesland/terms' target='_blank' class='link' alt='privacy'>Terms of Service</a>.</small>",
              placeholder: "",
              submitButtonText: "",
            },
          },
          options: loginOptions,
        }),

        google: {
          id: "google",
          entry: [
            () => {
              window.o.publishEvent(<PlatformEvent>{
                type: "shell.progress",
                message: "Please wait, we're Signing you in",
              });
            },
            (context) => {
              context.dirtyFlags = {};
            },
          ],
          invoke: {
            src: async (context) => {
              /*
              const openLogin = await getOpenLogin();
              const authResult = await openLogin.triggerLogin({
                typeOfLogin: "google",
                verifier: "circles-google-testnet",
                clientId:
                  "906916064114-5m4nsuvu0uhs2gnav4me4rsdrnlf445k.apps.googleusercontent.com",
              });
              context.data.privateKey = authResult.privateKey;
              context.data.userInfo = authResult.userInfo;
              return {
                privateKey: context.data.privateKey,
                userInfo: context.data.userInfo,
              };

               */
              const openLogin = await getOpenLogin();
              const privateKey = await openLogin.login({
                loginProvider: "google",
                extraLoginOptions: {
                  prompt: "consent",
                  display: "touch",
                },
              });
              const userInfo = await openLogin.getUserInfo();
              return {
                privateKey: privateKey.privKey,
                userInfo: userInfo,
              };
            },
            onDone: {
              actions: "assignPrivateKeyAndUserInfoToContext",
              target: "#enterEncryptionPin",
            },
            onError: [
              {
                // user closed popup
                cond: (context, event) =>
                  event.data.message == "user closed popup",
                target: "#chooseFlow",
              },
              {
                cond: (context, event) => (window.o.lastError = event.data),
                actions: (context, event) => {
                  window.o.lastError = event.data;
                },
                target: "#showError",
              },
            ],
          },
        },
        apple: {
          id: "apple",
          entry: [
            () => {
              window.o.publishEvent(<PlatformEvent>{
                type: "shell.progress",
                message: "Please wait, we're Signing you in",
              });
            },
            (context) => {
              context.dirtyFlags = {};
            },
          ],
          invoke: {
            src: async (context) => {
              const openLogin = await getOpenLogin();
              const privateKey = await openLogin.login({
                loginProvider: "apple",
              });
              return {
                privateKey: privateKey.privKey,
                userInfo: await openLogin.getUserInfo(),
              };
            },

            onDone: {
              actions: "assignPrivateKeyAndUserInfoToContext",
              target: "#enterEncryptionPin",
            },
            onError: [
              {
                // user closed popup
                cond: (context, event) =>
                  event.data.message == "user closed popup",
                target: "#chooseFlow",
              },
              {
                cond: (context, event) => (window.o.lastError = event.data),
                actions: (context, event) => {
                  window.o.lastError = event.data;
                },
                target: "#showError",
              },
            ],
          },
        },
        github: {
          id: "github",
          entry: [
            () => {
              window.o.publishEvent(<PlatformEvent>{
                type: "shell.progress",
                message: "Please wait, we're Signing you in",
              });
            },
            (context) => {
              context.dirtyFlags = {};
            },
          ],
          invoke: {
            src: async (context) => {
              const openLogin = await getOpenLogin();
              const privateKey = await openLogin.login({
                loginProvider: "github",
              });
              return {
                privateKey: privateKey.privKey,
                userInfo: await openLogin.getUserInfo(),
              };
            },
            onDone: {
              actions: "assignPrivateKeyAndUserInfoToContext",
              target: "#enterEncryptionPin",
            },
            onError: [
              {
                // user closed popup
                cond: (context, event) =>
                  event.data.message == "user closed popup",
                target: "#chooseFlow",
              },
              {
                cond: (context, event) => (window.o.lastError = event.data),
                actions: (context, event) => {
                  window.o.lastError = event.data;
                },
                target: "#showError",
              },
            ],
          },
        },
        /*
      facebook: {
        id: "facebook",
        invoke: {
          src: async (context) => {
            const openLogin = await getOpenLogin();
            const privateKey = await openLogin.login({
              loginProvider: "facebook",
            });
            return {
              privateKey: privateKey,
              userInfo: await openLogin.getUserInfo(),
            };
          },
          onDone: {
            actions: "assignPrivateKeyAndUserInfoToContext",
            target: "#enterEncryptionPin"
          },
          onError: {
            target: "#chooseFlow",
          }
        }
      },
      email: {
        id: "email",
        invoke: {
          src: async (context) => {
            const openLogin = await getOpenLogin();
            const privateKey = await openLogin.login({
              loginProvider: "email_passwordless",
            });
            return {
              privateKey: privateKey,
              userInfo: await openLogin.getUserInfo()
            };
          },
          onDone: {
            actions: "assignPrivateKeyAndUserInfoToContext",
            target: "#enterEncryptionPin"
          }
        }
      },*/
        enterEncryptionPin: prompt<LoginWithTorusContext, any>({
          id: "enterEncryptionPin",
          field: "encryptionPin",
          component: PinInputEditor,
          isSensitive: true,
          params: {
            view: {
              title: "Set a PIN to protect your account",
              description:
                "The pin will be used to encrypt your private key on your device. NOTE: This won't help against a sophisticated attacker but prevents casual theft. ",
              placeholder: "Enter Pin",
              submitButtonText: "Store private key on this device",
            },
          },
          dataSchema: yup
            .string()
            .required("Please enter a pin to protect your private key."),
          navigation: {
            next: "#storeKey",
          },
        }),
        enterDecryptionPin: prompt<LoginWithTorusContext, any>({
          id: "enterDecryptionPin",
          field: "decryptionPin",
          component: PinInputEditor,
          isSensitive: true,
          params: {
            view: {
              title: "Please enter your pin",
              description:
                "The pin will be used to decrypt your private key on your device.",
              placeholder: "Enter Pin",
              submitButtonText: "Unlock",
            },
          },
          dataSchema: yup
            .string()
            .required(
              "Please enter a encryptingPin to protect your private key."
            ),
          navigation: {
            next: "#unlockKey",
          },
        }),
        unlockKey: {
          id: "unlockKey",
          entry: (context) => {
            context.dirtyFlags = {};
          },
          invoke: {
            src: async (context) => {
              const km = new KeyManager(null);
              await km.load();
              let privateKey: string | null = null;
              try {
                privateKey = await km.getKey(
                  context.data.accountAddress,
                  context.data.decryptionPin
                );
              } catch (e) {
                context.messages["decryptionPin"] = `Invalid Pin`;
                throw e;
              }

              if (!privateKey || privateKey == "") {
                delete context.data.decryptionPin;
                delete context.data.privateKey;
                context.messages["decryptionPin"] = "Invalid Pin";
                throw new Error(context.messages["decryptionPin"]);
              }

              sessionStorage.setItem("circlesKey", privateKey);

              delete context.data.privateKey;
              delete context.data.decryptionPin;
            },
            onDone: "#success",
            onError: {
              target: "#enterDecryptionPin",
            },
          },
        },
        storeKey: {
          id: "storeKey",
          invoke: {
            src: async (context) => {
              const km = new KeyManager(null);
              const account = RpcGateway.get().eth.accounts.privateKeyToAccount(
                context.data.privateKey
              );

              await km.addEoa(
                account.address,
                account.privateKey,
                context.data.encryptionPin,
                "torus"
              );

              context.data.accountAddress = account.address;
              sessionStorage.setItem("circlesKey", account.privateKey);

              delete context.data.privateKey;
              delete context.data.encryptionPin;
            },
            onDone: "#success",
            onError: {
              actions: (context, event) => {
                window.o.lastError = event.data;
              },
              target: "#showError",
            },
          },
        },
        showError: {
          id: "showError",
          entry: show({
            // TODO: fix <any> cast
            component: ErrorView,
            params: {},
            field: {
              name: "",
              get: () => undefined,
              set: (o: any) => {},
            },
          }),
        },
        success: {
          id: "success",
          type: "final",
          entry: (context, event: PlatformEvent) => {
            if (context.data.successAction) {
              context.data.successAction(context.data);
            }
          },
          data: (context, event) => {
            delete context.data.privateKey;
            return context.data;
          },
        },
      },
    },
    {
      actions: {
        assignPrivateKeyAndUserInfoToContext: (context, event) => {
          context.data.privateKey = event.data.privateKey;
          context.data.userInfo = event.data.userInfo;
        },
      },
    }
  );

export const loginWithTorus: ProcessDefinition<void, LoginWithTorusContext> = {
  name: "loginWithTorus",
  stateMachine: <any>processDefinition,
};
