import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import DropdownSelectEditor from "@o-platform/o-editors/src/DropdownSelectEditor.svelte";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { GnosisSafeProxy } from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import * as bip39 from "bip39";
import { Account } from "web3-core";
import gql from "graphql-tag";
import { DropdownSelectorParams } from "@o-platform/o-editors/src/DropdownSelectEditorContext";
import DropDownString from "@o-platform/o-editors/src/dropdownItems/DropDownString.svelte";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import { AddressEoaMap, Eoa, KeyManager } from "../../../data/keyManager";
import PinInputEditor from "@o-platform/o-editors/src/Pin/PinInputEditor.svelte";
import * as yup from "yup";

export type ConnectSafeContextData = {
  safeAddress?: string;
  foundSafeAddresses?: string[];
  safeOwners?: string[];
  accountAddress?: string;
  seedPhrase?: string;
  unlockKeyPin?: string;
  privateKey?: string;
  availableKeys?: AddressEoaMap;
  selectedKey?: Eoa;
};

export type ConnectSafeContext = ProcessContext<ConnectSafeContextData>;

const editorContent: { [x: string]: EditorViewContext } = {
  seedPhrase: {
    title: "CONNECT RECOVERY CODE",
    description: `Please enter your 24 secret recovery code (seedphrase) 
      <br />
      <br />
      <span class="text-xs">Your secret recovery code will be stored only in your device</span>`,
    placeholder: "Recovery Code",
    submitButtonText: "Connect recovery code",
  },
  selectExistingKey: {
    title: "PLEASE CHOOSE A KEY",
    description: `We found the some keys on your device. Please select the one you want to use:`,
    placeholder: "Recovery Code",
    submitButtonText: "Use key",
  },
  unlockPin: {
    title: "Please enter encryptingPin",
    description: "Please enter the encryptingPin for your key",
    placeholder: "Enter Pin",
    submitButtonText: "Login",
  },
};

const processDefinition = (processId: string) =>
  createMachine<ConnectSafeContext, any>({
    id: `${processId}`,
    initial: "init",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<ConnectSafeContext, any>("error"),

      init: {
        invoke: {
          src: async (context) => {
            const keyManager = new KeyManager(context.data.safeAddress);
            await keyManager.load();
            context.data.availableKeys = keyManager.eoas;
          },
          onDone: "#checkLocalKeys",
        },
      },
      checkLocalKeys: {
        id: "checkLocalKeys",
        entry: () => console.log("connectSafe2/checkLocalKeys/entry"),
        //always: "#seedPhrase",
        always: [
          {
            cond: (context, event) => {
              const availableKeys = Object.values(context.data.availableKeys);
              const result =
                availableKeys.filter((o) => o.isOwner && o.encryptedPrivateKey)
                  .length > 0;
              return result;
            },
            target: "#unlockKeyPin",
          },
          {
            cond: (context, event) => {
              const availableKeys = Object.values(context.data.availableKeys);
              const result =
                availableKeys.filter((o) => o.isOwner && o.encryptedPrivateKey)
                  .length == 0;
              return result;
            },
            target: "#seedPhrase",
          },
        ],
      },
      unlockKeyPin: prompt<ConnectSafeContext, any>({
        id: "unlockKeyPin",
        field: "unlockKeyPin",
        component: PinInputEditor,
        isSensitive: true,
        params: (context) => {
          const eoa = Object.values(context.data.availableKeys).filter(
            (o) => o.isOwner && o.encryptedPrivateKey
          )[0];
          return {
            view: editorContent.unlockPin,
            label: `Please enter the PIN for key '${eoa.name}'`,
            submitButtonText: "Unlock",
          };
        },
        dataSchema: yup.string().required("Please enter your one time token."),
        navigation: {
          next: "#unlockKey",
        },
      }),
      unlockKey: {
        id: "unlockKey",
        invoke: {
          src: async (context, event) => {
            const key = Object.values(context.data.availableKeys).filter(
              (o) => o.isOwner && o.encryptedPrivateKey
            )[0];
            if (!key) throw new Error(`WTF?!`);

            const km = new KeyManager(context.data.safeAddress);
            await km.load();
            const decryptedKey = await km.getKey(
              key.address,
              context.data.unlockKeyPin
            );

            if (!decryptedKey) {
              throw new Error(`Wrong pin?`);
            }

            sessionStorage.setItem("circlesKey", decryptedKey);
          },
          onDone: "#checkSafeAddress",
        },
      },
      seedPhrase: prompt<ConnectSafeContext, any>({
        field: "seedPhrase",
        component: TextareaEditor,
        isSensitive: true,
        params: {
          view: editorContent.seedPhrase,
        },
        navigation: {
          next: "#checkSeedphrase",
        },
      }),
      checkSeedphrase: {
        id: "checkSeedphrase",
        invoke: {
          src: async (context) => {
            context.messages["seedPhrase"] = "";

            let keyFromMnemonic: string;
            let account: Account;

            try {
              keyFromMnemonic =
                "0x" +
                bip39.mnemonicToEntropy(
                  context.data.seedPhrase.replace(/\s\s+/g, " ")
                );
            } catch (e) {
              context.messages[
                "seedPhrase"
              ] = `The seedphrase cannot be converted to a private key. Please double check it.`;
              throw e;
            }

            try {
              account =
                RpcGateway.get().eth.accounts.privateKeyToAccount(
                  keyFromMnemonic
                );
            } catch (e) {
              context.messages[
                "seedPhrase"
              ] = `The key that was generated from the seedphrase cannot be converted to an ethereum account.`;
              throw e;
            }

            if (!context.data.safeAddress) {
              // If the flow was initialized without safe-address ..
              const graph =
                await window.o.theGraphClient.client.subscribeToResult();
              const foundSafes = await graph.query({
                query: gql`
                  query user($id: String!) {
                    user(id: $id) {
                      id
                      safeAddresses
                    }
                  }
                `,
                variables: {
                  id: account.address.toLowerCase(),
                },
              });

              if (foundSafes.errors && foundSafes.errors.length) {
                const msg = `An error occurred while we tried to find your safe: ${JSON.stringify(
                  foundSafes.errors
                )}`;
                context.messages["seedPhrase"] = msg;
                throw new Error(msg);
              }

              context.data.foundSafeAddresses =
                foundSafes.data.user?.safeAddresses ?? [];
              if (!context.data.foundSafeAddresses.length) {
                const msg = `We couldn't find a safe for your account ${account.address}`;
                context.messages["seedPhrase"] = msg;
                throw new Error(msg);
              }
            }

            localStorage.setItem("circlesAccount", account.address);

            context.data.accountAddress = account.address;
            context.data.privateKey = keyFromMnemonic;

            const km = new KeyManager(context.data.safeAddress);
            await km.load();
            await km.setKey(account.address, "123456", keyFromMnemonic);
          },
          onDone: [
            {
              cond: (context) =>
                (context.messages["seedPhrase"]?.trim() ?? "") !== "",
              target: "#seedPhrase",
            },
            {
              cond: (context) => context.data.foundSafeAddresses?.length > 1,
              target: "#safeAddress",
            },
            {
              cond: (context) => context.data.foundSafeAddresses?.length == 1,
              actions: (context) =>
                (context.data.safeAddress = context.data.foundSafeAddresses[0]),
              target: "#checkSafeAddress",
            },
            {
              target: "#checkSafeAddress",
            },
          ],
          onError: "#seedPhrase",
        },
      },
      safeAddress: prompt({
        field: "safeAddress",
        component: DropdownSelectEditor,
        params: <DropdownSelectorParams<ConnectSafeContext, string, string>>{
          label:
            "We found multiple safes for your account. Please select the one you want to connect.",
          placeholder: "Click to select a safe",
          submitButtonText: "Connect",
          itemTemplate: DropDownString,
          getKey: (safeAddress: any) => safeAddress.value,
          getLabel: (safeAddress: any) => safeAddress.label,
          choices: {
            byKey: async (key: string, context) => {
              return context.data.foundSafeAddresses.find((o) => o == key);
            },
            find: async (filter: string | undefined, context) => {
              return context.data.foundSafeAddresses.filter((o) =>
                o.toLowerCase().startsWith(filter?.toLowerCase() ?? "")
              );
            },
          },
        },
        navigation: {
          next: "#checkSafeAddress",
        },
      }),
      checkSafeAddress: {
        id: "checkSafeAddress",
        invoke: {
          src: async (context) => {
            context.messages["safeAddress"] = ``;
            context.data.safeAddress = context.data.safeAddress?.trim();
            try {
              /*console.log(
                  `Checking if safe ${context.data.safeAddress} exists ..`
              );*/
              await RpcGateway.trigger(async (web3) => {
                const safeProxy = new GnosisSafeProxy(
                  web3,
                  context.data.safeAddress
                );
                context.data.safeOwners = await safeProxy.getOwners();
                /*console.log(
                    `Checking if safe ${context.data.safeAddress} exists .. Safe exists.`
                );*/
              }, 2500);
              return true;
            } catch (e) {
              if (e.message == "slow_provider") {
                throw e;
              }
              context.messages[
                "safeAddress"
              ] = `Couldn't determine the owner of safe ${context.data.safeAddress}. Is the address right?`;
              /* console.log(
                  `Checking if safe ${context.data.safeAddress} exists .. Safe doesn't exist.`,
                  e
              );*/
              throw e;
            }
          },
          onDone: "#success",
          onError: "#safeAddress",
        },
      },
      success: {
        id: "success",
        type: "final",
        data: (context) => {
          return context.data;
        },
      },
    },
  });

export const connectSafe: ProcessDefinition<void, ConnectSafeContextData> = {
  name: "connectSafe",
  stateMachine: <any>processDefinition,
};
