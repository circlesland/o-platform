import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { createMachine } from "xstate";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { promptChoice } from "../../o-passport/processes/identify/prompts/promptChoice";
import ButtonStackSelector from "@o-platform/o-editors/src/ButtonStackSelector.svelte";
import NumberEditor from "../../../../../packages/o-editors/src/NumberEditor.svelte";
import * as yup from "yup";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { KeyManager } from "../../o-passport/data/keyManager";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import HtmlViewer from "../../../../../packages/o-editors/src/HtmlViewer.svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { show } from "@o-platform/o-process/dist/actions/show";
import ErrorView from "../../../shared/atoms/Error.svelte";
import { getOpenLogin } from "../../../shared/openLogin";

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
  successAction?: (data: LoginWithTorusContextData) => void;
};

export type LoginWithTorusContext = ProcessContext<LoginWithTorusContextData>;

const processDefinition = (processId: string) =>
  createMachine<LoginWithTorusContext, any>(
    {
      id: `${processId}:loginWithTorus`,
      initial: "init",
      states: {
        // Include a default 'error' state that propagates the error by re-throwing it in an action.
        // TODO: Check if this works as intended
        ...fatalError<LoginWithTorusContext, any>("error"),

        init: {
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
          entry: () => console.log("chooseFlow"),
          params: {
            view: {
              title: "Welcome to Cirles Land",
              description: "Please choose a sign-in option",
              placeholder: "",
              submitButtonText: "",
            },
          },
          options: [
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
          ],
        }),

        google: {
          id: "google",
          invoke: {
            src: async (context) => {
              const openLogin = await getOpenLogin();
              const privateKey = await openLogin.login({
                loginProvider: "google",
              });
              const userInfo = await openLogin.getUserInfo();
              return {
                privateKey: privateKey,
                userInfo: userInfo,
              };
            },
            onDone: {
              actions: "assignPrivateKeyAndUserInfoToContext",
              target: "#enterEncryptionPin",
            },
            onError: {
              target: "#chooseFlow",
            },
          },
        },
        apple: {
          id: "apple",
          invoke: {
            src: async (context) => {
              const openLogin = await getOpenLogin();
              const privateKey = await openLogin.login({
                loginProvider: "apple",
              });
              return {
                privateKey: privateKey,
                userInfo: await openLogin.getUserInfo(),
              };
            },
            onDone: {
              actions: "assignPrivateKeyAndUserInfoToContext",
              target: "#enterEncryptionPin",
            },
            onError: {
              target: "#chooseFlow",
            },
          },
        },
        github: {
          id: "github",
          invoke: {
            src: async (context) => {
              const openLogin = await getOpenLogin();
              const privateKey = await openLogin.login({
                loginProvider: "github",
              });
              return {
                privateKey: privateKey,
                userInfo: await openLogin.getUserInfo(),
              };
            },
            onDone: {
              actions: "assignPrivateKeyAndUserInfoToContext",
              target: "#enterEncryptionPin",
            },
            onError: {
              target: "#chooseFlow",
            },
          },
        },
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
              target: "#enterEncryptionPin",
            },
          },
        } /*
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
      },*/,
        enterEncryptionPin: prompt<LoginWithTorusContext, any>({
          id: "enterEncryptionPin",
          field: "encryptionPin",
          component: NumberEditor,
          isSensitive: true,
          params: {
            view: {
              title: "Please enter a pin",
              description:
                "The pin will be used to encrypt your private key on your device.",
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
          component: NumberEditor,
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
                context.messages[
                  "decryptionPin"
                ] = `Couldn't decrypt your key: ${e.message}`;
                throw e;
              }

              if (!privateKey || privateKey == "") {
                delete context.data.decryptionPin;
                delete context.data.privateKey;
                context.messages["decryptionPin"] =
                  "Couldn't decrypt your key. Have you entered the correct pin?";
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
          context.data.privateKey = event.data.privateKey.privKey;
          context.data.userInfo = event.data.userInfo;
        },
      },
    }
  );

export const loginWithTorus: ProcessDefinition<void, LoginWithTorusContext> = {
  name: "loginWithTorus",
  stateMachine: <any>processDefinition,
};
