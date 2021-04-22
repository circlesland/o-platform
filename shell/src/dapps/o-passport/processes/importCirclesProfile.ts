import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import {prompt} from "@o-platform/o-process/dist/states/prompt";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {createMachine} from "xstate";
import {GnosisSafeProxy} from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import {config} from "@o-platform/o-circles/dist/config";
import Web3 from "web3";

export type ImportedCirclesProfileData = {
  seedPhrase?: string
  circlesAddress?: string
  firstName?: string
  avatarUrl?: string
}

export type ImportCirclesProfileContextData = {
  safeAddress?: string;
  seedPhrase?:string;
  safeNonce?: any;
  circlesGardenProfile?: any;
  profileData?: ImportedCirclesProfileData
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
  placeholderSafeAddress: "you@example.com",
  labelSeedPhrase: "Please enter your seed phrase",
  placeholderSeedPhrase: "Seedphrase"

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
            context.data.safeAddress = context.data.safeAddress?.trim();
            try {
              console.log(`Checking if safe ${context.data.safeAddress} exists ..`);
              const safeProxy = new GnosisSafeProxy(config.getCurrent().web3(), "", context.data.safeAddress);
              context.data.safeNonce = await safeProxy.getNonce();
              console.log(`Checking if safe ${context.data.safeAddress} exists .. Safe exists.`);
              return true;
            } catch (e) {
              console.log(`Checking if safe ${context.data.safeAddress} exists .. Safe doesn't exist.`);
              throw e;
            }
          },
          onDone: "#checkCirclesGarden",
          onError: "#error"
        }
      },
      checkCirclesGarden: {
        id: "checkCirclesGarden",
        invoke: {
          src: async (context) => {
            const checksumAddress = Web3.utils.toChecksumAddress(context.data.safeAddress);
            const queryUrl = `https://api.circles.garden/api/users/?address[]=${checksumAddress}`;
            const result = await fetch(queryUrl);

            if (result.status != 200) {
              return;
            }

            const resultJson = await result.json();
            if (!Array.isArray(resultJson.data) || resultJson.data.length == 0) {
              return;
            }

            context.data.circlesGardenProfile = {
              username: resultJson.data[0].username,
              avatarUrl: resultJson.data[0].avatarUrl
            };
          },
          onDone: "#seedPhrase",
          onError: "#error"
        }
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
            context.data.profileData = {
              seedPhrase: context.data.seedPhrase,
              circlesAddress: context.data.safeAddress,
              firstName: context.data.circlesGardenProfile?.username,
              avatarUrl: context.data.circlesGardenProfile?.avatarUrl
            };
          },
          onDone: "#success",
          onError: "#error",
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

export const importCirclesProfile: ProcessDefinition<void, ImportedCirclesProfileData> = {
  name: "importCirclesProfile",
  stateMachine: <any>processDefinition,
};
