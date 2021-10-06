import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { createMachine } from "xstate";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import * as yup from "yup";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import HtmlViewer from "@o-platform/o-editors/src/HtmlViewer.svelte";
import NumberEditor from "@o-platform/o-editors/src/NumberEditor.svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { KeyManager } from "../../../o-passport/data/keyManager";

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
      id: `${processId}:unlockKey`,
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
              context.data.accountAddress = accAddress;
            },
            onDone: [
              {
                target: "#enterDecryptionPin",
              },
            ],
          },
        },
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
            next: "#execUnlockKey",
          },
        }),
        execUnlockKey: {
          id: "execUnlockKey",
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
        success: {
          id: "success",
          type: "final",
          entry: (context, event: PlatformEvent) => {
            if (context.data.successAction) {
              context.data.successAction(context.data);
            }
          },
          data: (context, event) => {
            return context.data.accountAddress;
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

export const unlockKey: ProcessDefinition<void, LoginWithTorusContext> = {
  name: "unlockKey",
  stateMachine: <any>processDefinition,
};
