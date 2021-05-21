import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { GnosisSafeProxy } from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import * as bip39 from "bip39";

export type ConnectSafeContextData = {
  safeAddress?: string;
  safeOwners?: string[];
  accountAddress?: string;
  seedPhrase?: string;
  privateKey?: string;
};

export type ConnectSafeContext = ProcessContext<ConnectSafeContextData>;

const strings = {
  labelSafeAddress: `Please copy and paste in your "Profile Address", which you can find on the <a class="text-primary" href="https://circles.garden/settings" target="_blank">settings page</a> of your circles.garden Wallet`,
  placeholderSafeAddress: "your safe address",
  labelSeedPhrase:
    "If you already have a safe address from Circles.garden you can find it at <a href='https://circles.garden/seedphrase' class='btn-link' target='_blank'>circles.garden/seedphrase</a>.<br/><br/>Your seedphrase is always only stored on your device. To connect this device, <span class='text-primary'>please enter your seedphrase</span>.",
  placeholderSeedPhrase: "Seedphrase",
};

const processDefinition = (processId: string) =>
  createMachine<ConnectSafeContext, any>({
    id: `${processId}`,
    initial: "checkSkipSafeAddress",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<ConnectSafeContext, any>("error"),

      checkSkipSafeAddress: {
        always: [
          {
            cond: (context) => {
              return !!context.data.safeAddress;
            },
            target: "#checkSafeAddress",
          },
          {
            target: "#safeAddress",
          },
        ],
      },
      safeAddress: prompt<ConnectSafeContext, any>({
        fieldName: "safeAddress",
        component: TextEditor,
        params: {
          label: strings.labelSafeAddress,
          placeholder: strings.placeholderSafeAddress,
          submitButtonText: "Connect",
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
              console.log(
                `Checking if safe ${context.data.safeAddress} exists ..`
              );
              await RpcGateway.trigger(async (web3) => {
                const safeProxy = new GnosisSafeProxy(
                  web3,
                  context.data.safeAddress
                );
                context.data.safeOwners = await safeProxy.getOwners();
                console.log(
                  `Checking if safe ${context.data.safeAddress} exists .. Safe exists.`
                );
              }, 2500);
              return true;
            } catch (e) {
              if (e.message == "slow_provider") {
                throw e;
              }
              context.messages[
                "safeAddress"
              ] = `Couldn't determine the owner of safe ${context.data.safeAddress}. Is the address right?`;
              console.log(
                `Checking if safe ${context.data.safeAddress} exists .. Safe doesn't exist.`,
                e
              );
              throw e;
            }
          },
          onDone: "#seedPhrase",
          onError: "#safeAddress",
        },
      },
      seedPhrase: prompt<ConnectSafeContext, any>({
        fieldName: "seedPhrase",
        component: TextareaEditor,
        isSensitive: true,
        params: {
          label: strings.labelSeedPhrase,
          placeholder: strings.placeholderSeedPhrase,
          submitButtonText: "Store on this device",
        },
        navigation: {
          next: "#prepareOutput",
        },
      }),
      prepareOutput: {
        id: "prepareOutput",
        invoke: {
          src: async (context) => {
            context.messages["seedPhrase"] = "";

            let keyFromMnemonic: string;
            let account: any;

            try {
              keyFromMnemonic =
                "0x" + bip39.mnemonicToEntropy(context.data.seedPhrase);
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

            if (!context.data.safeOwners.find((o) => o === account.address)) {
              context.messages[
                "seedPhrase"
              ] = `The given key doesn't belong to a owner of safe ${context.data.safeAddress}`;
              throw new Error(
                `The given key doesn't belong to a owner of safe ${context.data.safeAddress}`
              );
            }

            localStorage.setItem("circlesAccount", account.address);

            context.data.accountAddress = account.address;
            context.data.privateKey = keyFromMnemonic;
          },
          onDone: "#success",
          onError: "#seedPhrase",
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
