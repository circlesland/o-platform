import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {createMachine} from "xstate";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {prompt} from "@o-platform/o-process/dist/states/prompt";
import TextareaEditor from "../../../../../packages/o-editors/src/TextareaEditor.svelte";
import {Account} from "web3-core";
import * as bip39 from "bip39";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import gql from "graphql-tag";
import DropdownSelectEditor from "../../../../../packages/o-editors/src/DropdownSelectEditor.svelte";
import {DropdownSelectorParams} from "@o-platform/o-editors/src/DropdownSelectEditorContext";
import DropDownString from "../../../../../packages/o-editors/src/dropdownItems/DropDownString.svelte";
import {GnosisSafeProxy} from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import {ConnectSafeContext} from "../../o-passport/processes/identify/connectSafe/connectSafe2";
import {BN} from "ethereumjs-util";
import {upsertIdentity} from "../../o-passport/processes/upsertIdentity";
import {EoaData, SafeData} from "./initEvent";

export type FromCirclesLandContextData = {
  seedPhrase?: string;
  eoa?: EoaData;
  safe?: SafeData;
  foundSafeAddresses?: string[],
  chooseSafeAddress?: string;
  circlesLandProfile?: {
    username: string,
    avatarUrl: string
  }
};

export type FromCirclesLandContext = ProcessContext<FromCirclesLandContextData>;

const processDefinition = (processId: string) =>
createMachine<FromCirclesLandContext, any>({
  id: `${processId}:fromCirclesLand`,
  initial: "seedPhrase",
    states: {
        // Include a default 'error' state that propagates the error by re-throwing it in an action.
        // TODO: Check if this works as intended
      ...fatalError<FromCirclesLandContext, any>("error"),

      seedPhrase: prompt<ConnectSafeContext, any>({
        field: "seedPhrase",
        component: TextareaEditor,
        isSensitive: true,
        params: {
          label: "Please enter your seedphrase",
          placeholder: "Seedphrase",
          submitButtonText: "Store on this device",
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
                  keyFromMnemonic = "0x" + bip39.mnemonicToEntropy(context.data.seedPhrase);
                } catch (e) {
                  context.messages["seedPhrase"] = `The seedphrase cannot be converted to a private key. Please double check it.`;
                  throw e;
                }

                try {
                  account = RpcGateway.get().eth.accounts.privateKeyToAccount(keyFromMnemonic);
                } catch (e) {
                  context.messages["seedPhrase"] = `The key that was generated from the seedphrase cannot be converted to an ethereum account.`;
                  throw e;
                }

                if (!context.data.safe?.address) {
                    // If the flow was initialized without safe-address ..
                  const graph = await window.o.theGraphClient.client.subscribeToResult();
                    const foundSafes = await graph.query({
                        query: gql`query user($id:String!) {
                            user(id: $id) {
                                safes {
                                    id
                                    organization
                                    deployed
                                    balances {
                                        amount
                                        token {
                                            id
                                        }
                                    }
                                }
                            }
                        }`,
                      variables: {
                        id: account.address.toLowerCase()
                      }
                    });

                  if (foundSafes.errors && foundSafes.errors.length) {
                    const msg = `An error occurred while we tried to find your safe: ${JSON.stringify(foundSafes.errors)}`;
                    context.messages["seedPhrase"] = msg;
                    throw new Error(msg)
                  }

                  context.data.foundSafeAddresses = foundSafes.data.user.safes
                    .filter(o => o.deployed && o.balances.length > 0)
                    .map(o => o.id);

                  if (!context.data.foundSafeAddresses.length) {
                    const msg = `We couldn't find a safe for your account ${account.address}`;
                    context.messages["seedPhrase"] = msg;
                    throw new Error(msg)
                  }
                }

                context.data.eoa = {
                  address:account.address,
                  privateKey:keyFromMnemonic,
                  origin: "Imported",
                  balance: new BN("0")
                }
              },
            onDone: [{
              cond: (context) => (context.messages["seedPhrase"]?.trim() ?? "") !== "",
              target: "#seedPhrase"
            }, {
              cond: (context) => context.data.foundSafeAddresses?.length > 1,
              target: "#chooseSafeAddress"
            }, {
              cond: (context) => context.data.foundSafeAddresses?.length == 1,
              actions: (context) => context.data.safe = {
                address: context.data.foundSafeAddresses[0],
                origin: "Imported",
                balance: new BN("0")
              },
              target: "#checkSafeAddress"
            }, {
              target: "#checkSafeAddress"
            }],
            onError: "#seedPhrase"
          }
      },
      chooseSafeAddress: prompt({
        field: "chooseSafeAddress",
        component: DropdownSelectEditor,
        params: <DropdownSelectorParams<ConnectSafeContext, string, string>>{
          label: "We found multiple safes for your account. Please select the one you want to connect.",
          placeholder: "Click to select a safe",
          submitButtonText: "Connect",
          itemTemplate: DropDownString,
          getKey: (safeAddress: any) => safeAddress.value,
          getLabel: (safeAddress: any) => safeAddress.label,
          choices: {
            byKey: async (key: string, context) => {
              return context.data.foundSafeAddresses.find(o => o == key);
            },
            find: async (filter: string | undefined, context) => {
              return context.data.foundSafeAddresses.filter(o => o.toLowerCase().startsWith(filter?.toLowerCase() ?? ""));
            },
          },
        },
        navigation: {
          next: "#checkSafeAddress",
        }
      }),
      checkSafeAddress: {
        id: "checkSafeAddress",
        invoke: {
          src: async (context) => {
            context.messages["chooseSafeAddress"] = ``;
            const addressToCheck = context.data.chooseSafeAddress?.trim()
                                ?? context.data.safe?.address;
            try {
              await RpcGateway.trigger(async (web3) => {
                const safeProxy = new GnosisSafeProxy(
                  web3,
                  addressToCheck
                );
                await safeProxy.getNonce();
              }, 2500);

              context.data.safe = {
                address: addressToCheck,
                balance: new BN("0"),
                origin: "Imported"
              };

              return true;
            } catch (e) {
              context.messages["chooseSafeAddress"] =
                `Couldn't determine the owner of safe ${addressToCheck}. Is the address right?`;

              throw e;
            }
          },
          onDone: "#success",
          onError: "#chooseSafeAddress",
        },
      },

      success: {
        id: "success",
        type: "final",
        entry: (context) => {
          // Start the upsert identity flow with the circles.garden profile
          // data:
          window.o.runProcess(upsertIdentity, {
            firstName: "Imported user",
            avatarUrl: "https://storage.googleapis.com/subgraph-images/1603464601140logo.svg"
          });
        },
        data: (context) => {
          return context.data;
        },
      },
    },
});

export const fromCirclesLand: ProcessDefinition<void, FromCirclesLandContext> = {
  name: "fromCirclesLand",
  stateMachine: <any>processDefinition,
};