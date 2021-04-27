import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import {prompt} from "@o-platform/o-process/dist/states/prompt";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {createMachine} from "xstate";
import {GnosisSafeProxy} from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import Web3 from "web3";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import * as bip39 from "bip39";
import {Observable} from "rxjs";

export type ImportedCirclesProfileData = {
  circlesAddress?: string;
  firstName?: string;
  avatarUrl?: string;
  privateKey?: string;
  accountAddress?: string;
};

export type ImportCirclesProfileContextData = {
  safeAddress?: string;
  seedPhrase?: string;
  safeOwners?: string[];
  circlesGardenProfile?: any;
  profileData?: ImportedCirclesProfileData;
};

/**
 * This is the context on which the process will work.
 * The actual fields are defined above in the 'ImportCirclesProfileContextData' type.
 * The 'ImportCirclesProfileContextData' type is also the return value of the process (see bottom for the signature).
 */
export type ImportCirclesProfileContext = ProcessContext<ImportCirclesProfileContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
  labelSafeAddress: "Please enter your circles safe address",
  placeholderSafeAddress: "your safe address",
  labelSeedPhrase: "Please enter your seed phrase",
  placeholderSeedPhrase: "Seedphrase",
};

const processDefinition = (processId: string) =>
  createMachine<ImportCirclesProfileContext, any>({
    id: `${processId}`,
    initial: "safeAddress",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<ImportCirclesProfileContext, any>("error"),

      safeAddress: prompt<ImportCirclesProfileContext, any>({
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
              await RpcGateway.trigger(async web3 => {
                const safeProxy = new GnosisSafeProxy(
                  web3,
                  "",
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
          onDone: "#checkCirclesGarden",
          onError: "#safeAddress",
        },
      },
      checkCirclesGarden: {
        id: "checkCirclesGarden",
        invoke: {
          src: async (context) => {
            const checksumAddress = Web3.utils.toChecksumAddress(
              context.data.safeAddress
            );
            const queryUrl = `https://api.circles.garden/api/users/?address[]=${checksumAddress}`;
            const result = await fetch(queryUrl);

            if (result.status != 200) {
              return;
            }

            const resultJson = await result.json();
            if (
              !Array.isArray(resultJson.data) ||
              resultJson.data.length == 0
            ) {
              return;
            }

            context.data.circlesGardenProfile = {
              username: resultJson.data[0].username,
              avatarUrl: resultJson.data[0].avatarUrl,
            };
          },
          onDone: "#seedPhrase",
          onError: "#error",
        },
      },
      seedPhrase: prompt<ImportCirclesProfileContext, any>({
        fieldName: "seedPhrase",
        component: TextEditor,
        params: {
          label: strings.labelSeedPhrase,
          placeholder: strings.placeholderSeedPhrase,
          submitButtonText: "Save",
        },
        navigation: {
          next: "#prepareProfile",
        },
      }),
      prepareProfile: {
        id: "prepareProfile",
        invoke: {
          src: async (context) => {
            context.messages["seedPhrase"] = "";

            let keyFromMnemonic: string;
            let account: any;

            if ((context.data.seedPhrase ?? "") === "") {
              // TODO: 0x123 is for testing without private key. Needs to be removed later.
              keyFromMnemonic = "0x123";
              account = {
                address: "0x123",
              };
            } else {
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
                account = RpcGateway.get().eth.accounts.privateKeyToAccount(
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
            }
            context.data.profileData = {
              privateKey: keyFromMnemonic,
              accountAddress: account.address,
              circlesAddress: context.data.safeAddress,
              firstName: context.data.circlesGardenProfile?.username,
              avatarUrl: context.data.circlesGardenProfile?.avatarUrl,
            };
          },
          onDone: "#success",
          onError: "#seedPhrase",
        },
      },
      success: {
        id: "success",
        type: "final",
        data: (context) => {
          return context.data.profileData;
        },
      },
    },
  });

export const importCirclesProfile: ProcessDefinition<void,
  ImportedCirclesProfileData> = {
  name: "importCirclesProfile",
  stateMachine: <any>processDefinition,
};
