import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {createMachine} from "xstate";
import {prompt} from "@o-platform/o-process/dist/states/prompt";
import TextareaEditor from "../../../../../packages/o-editors/src/TextareaEditor.svelte";
import {ConnectSafeContext} from "../../o-passport/processes/identify/connectSafe/connectSafe2";
import * as bip39 from "bip39";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {Account} from "web3-core";
import {FindSafeAddressByOwnerDocument, UpsertProfileDocument} from "../../../shared/api/data/types";
import {GnosisSafeProxy} from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import HtmlViewer from "../../../../../packages/o-editors/src/HtmlViewer.svelte";
import {BalanceDocument} from "../../o-banking/data/api/types";
import {BN} from "ethereumjs-util";
import {KeyManager} from "../../o-passport/data/keyManager";
import {me} from "../../../shared/stores/me";
import {loadProfile} from "../../o-passport/processes/identify/services/loadProfile";

export type PromptConnectOrCreateContextData = {
  seedPhrase?: string;
  importedAccount?: Account;
  selectedSafeAddress?: string;
  successAction?: (data: PromptConnectOrCreateContextData) => void
};

export type PromptConnectOrCreateContext = ProcessContext<PromptConnectOrCreateContextData>;

const editorContent = {
  seedPhrase: {
    title: "CONNECT RECOVERY CODE",
    description: `Please enter your 24 secret recovery code (seedphrase) 
      <br />
      <br />
      <span class="text-xs">Your secret recovery code will be stored only in your device</span>`,
    placeholder: "Recovery Code",
    submitButtonText: "Connect recovery code",
  },
  addOwnerInfo: {
    title: "Add owner to safe",
    description: `We'll add you new key as owner to your existing safe. Your previous key will stay an owner as well.`,
    placeholder: "",
    submitButtonText: "Proceed",
  }
};
const processDefinition = (processId: string) =>
  createMachine<PromptConnectOrCreateContext, any>({
    id: `${processId}:promptConnectOrCreate`,
    initial: "seedPhrase",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<PromptConnectOrCreateContext, any>("error"),

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

            try {
              keyFromMnemonic = "0x" + bip39.mnemonicToEntropy(context.data.seedPhrase);
            } catch (e) {
              context.messages["seedPhrase"] = `The seedphrase cannot be converted to a private key. Please double check it.`;
              throw e;
            }

            try {
              context.data.importedAccount = RpcGateway.get().eth.accounts.privateKeyToAccount(keyFromMnemonic);
            } catch (e) {
              context.messages["seedPhrase"] = `The key that was generated from the seedphrase cannot be converted to an ethereum account.`;
              throw e;
            }
          },
          onDone: "#findSafe",
          onError: "#seedPhrase"
        }
      },

      findSafe: {
        id: "findSafe",
        invoke: {
          src: async (context) => {
            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.query({
              query: FindSafeAddressByOwnerDocument,
              variables: {
                owner: context.data.importedAccount.address.toLowerCase(),
              },
            });

            if (result.errors && result.errors.length) {
              throw new Error(`Couldn't find a safe for owner ${context.data.importedAccount.address}: ${JSON.stringify(result.errors)}`)
            }

            const foundSafeAddresses = result.data.findSafeAddressByOwner;
            if (!foundSafeAddresses.length) {
              throw new Error(`Couldn't find a safe for owner ${context.data.importedAccount.address}: ${JSON.stringify(result.errors)}`)
            }

            const safesWithBalance = [];
            for(let safeAddress of foundSafeAddresses) {
              const result = await apiClient.query({
                query: BalanceDocument,
                variables: {
                  safeAddress: safeAddress
                }
              });
              const balance = new BN(result.data.balance);
              if (balance.gt(new BN("0"))) {
                safesWithBalance.push(safeAddress);
              }
            }
            if (safesWithBalance.length == 0) {
              throw new Error(`Found no safes with balance.`);
            }
            if (safesWithBalance.length > 0) {
              context.data.selectedSafeAddress = safesWithBalance[0];
            }
// TODO: Use the below code:
            /*
            if (safesWithBalance.length > 1) {
              throw new Error(`Found more than one safe with CRC balance.`);
            }

             */

            context.data.selectedSafeAddress = safesWithBalance[0];
          },
          onDone: "#addNewOwnerInfo",
          onError: {
            actions: (ctx, event) => {
              ctx.messages["seedPhrase"] = `Couldn't find your safe: ${JSON.stringify(event.data)}.`;
            },
            target: "#seedPhrase"
          },
        }
      },

      addNewOwnerInfo: prompt({
        id: "addNewOwnerInfo",
        field: "__",
        component: HtmlViewer,
        params: {
          view: editorContent.addOwnerInfo,
          html: () => "We will add a new owner to your safe. No worries we keep your old key as owner too.",
          hideNav: false,
        },
        navigation: {
          next: "#addNewOwner",
        }
      }),

      addNewOwner: {
        id: "addNewOwner",
        invoke: {
          src: async (context) => {
            const safeProxy = new GnosisSafeProxy(
              RpcGateway.get(),
              context.data.selectedSafeAddress
            );

            var km = new KeyManager(null);
            await km.load();

            const currentOwners = await safeProxy.getOwners();
            if (currentOwners.find(o => o.toLowerCase() == km.torusKeyAddress.toLowerCase())) {

              console.log("The new safe owner was already added.");
            } else {

              const receipt = await safeProxy.addOwnerWithThreshold(
                context.data.importedAccount.privateKey,
                km.torusKeyAddress,
                1);

              console.log("Added new owner to safe: ", receipt);
            }
            //safeProxy.addOwnerWithThreshold()
          },
          onDone: "updateRegistration",
          onError: "seedPhrase",
        }
      },

      updateRegistration: {
        id: "updateRegistration",
        invoke: {
          src: async (context) => {
            const safeProxy = new GnosisSafeProxy(
              RpcGateway.get(),
              context.data.selectedSafeAddress
            );

            const $me = await loadProfile();
            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: UpsertProfileDocument,
              variables: {
                id: $me.id,
                circlesAddress: safeProxy.address,
                circlesSafeOwner: $me.circlesSafeOwner,
                avatarCid: $me.avatarCid,
                avatarUrl: $me.avatarUrl,
                avatarMimeType: $me.avatarMimeType,
                firstName: $me.firstName,
                lastName: $me.lastName,
                country: $me.country,
                dream: $me.dream,
                newsletter: $me.newsletter,
                status: $me.status ?? "registered"
              },
            });
          },
          onDone: "success",
          onError: "seedPhrase",
        }
      },

      success: {
        type: "final",
        entry: (context) => {
          if (context.data.successAction) {
            context.data.successAction(context.data);
          }
        }
      }
    }
  });

export const connectSafe: ProcessDefinition<void, PromptConnectOrCreateContext> = {
  name: "connectSafe",
  stateMachine: <any>processDefinition,
};
