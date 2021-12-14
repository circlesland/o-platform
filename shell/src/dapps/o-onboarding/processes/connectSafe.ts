import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import TextareaEditor from "../../../../../packages/o-editors/src/TextareaEditor.svelte";
import { ConnectSafeContext } from "../../o-passport/processes/identify/connectSafe/connectSafe2";
import * as bip39 from "bip39";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { Account } from "web3-core";
import {
  FindSafeAddressByOwnerDocument, FindSafeAddressByOwnerQueryVariables, ImportOrganisationsDocument,
  Profile,
  ProfilesByCirclesAddressDocument, ProfilesByCirclesAddressQueryVariables,
  SafeAddressByOwnerResult,
  UpsertProfileDocument,
} from "../../../shared/api/data/types";
import { GnosisSafeProxy } from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import HtmlViewer from "../../../../../packages/o-editors/src/HtmlViewer.svelte";
import { BN } from "ethereumjs-util";
import { KeyManager } from "../../o-passport/data/keyManager";
import { loadProfile } from "../../o-passport/processes/identify/services/loadProfile";
import SimpleDropDownEditor from "../../../../../packages/o-editors/src/SimpleDropDownEditor.svelte";
import { DropdownSelectorParams } from "@o-platform/o-editors/src/DropdownSelectEditorContext";
import DropDownCandidateSafe from "../views/atoms/DropDownCandidateSafe.svelte";
import {ApiClient} from "../../../shared/apiConnection";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";

export type SafeCandidate = {
  address: string;
  balance?: BN;
  circlesGardenProfile?: {
    username: string;
    avatar: string;
  };
  circlesLandProfile?: Profile;
};

export type PromptConnectOrCreateContextData = {
  seedPhrase?: string;
  importedAccount?: Account;
  safeCandidates?: {
    [address: string]: SafeCandidate;
  };
  selectedSafe?: SafeCandidate;
  safeProxy?: GnosisSafeProxy;
  successAction?: (data: PromptConnectOrCreateContextData) => void;
};

export type PromptConnectOrCreateContext =
  ProcessContext<PromptConnectOrCreateContextData>;

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
    description: `We'll add your new key as owner to your existing safe. Your previous key will stay an owner as well.`,
    placeholder: "",
    submitButtonText: "Proceed",
  },
};
const processDefinition = (processId: string) =>
  createMachine<PromptConnectOrCreateContext, any>(
    {
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
                context.data.importedAccount =
                  RpcGateway.get().eth.accounts.privateKeyToAccount(
                    keyFromMnemonic
                  );
              } catch (e) {
                context.messages[
                  "seedPhrase"
                ] = `The key that was generated from the seedphrase cannot be converted to an ethereum account.`;
                throw e;
              }
            },
            onDone: "#findSafe",
            onError: "#seedPhrase",
          },
        },

        findSafe: {
          id: "findSafe",
          invoke: {
            src: async (context) => {

              const foundSafeAddresses = await ApiClient.query<
                SafeAddressByOwnerResult[], FindSafeAddressByOwnerQueryVariables
                >(FindSafeAddressByOwnerDocument,{
                  owner: context.data.importedAccount.address.toLowerCase()
                });

              const query = foundSafeAddresses.reduce(
                (p, c) =>
                  p +
                  `address[]=${RpcGateway.get().utils.toChecksumAddress(
                    c.safeAddress
                  )}&`,
                ""
              );
              const circlesGardenProfileRequest = `https://api.circles.garden/api/users/?${query}`;
              const circlesGardenFetchPromise = fetch(circlesGardenProfileRequest)
                .then((result) => result.json());

              const circlesLandProfileQueryPromise = ApiClient.query<Profile[], ProfilesByCirclesAddressQueryVariables>(
                ProfilesByCirclesAddressDocument,{
                  circlesAddresses: foundSafeAddresses.filter(o => o.type === "ubi").map(o => o.safeAddress)
                });

              const results = await Promise.all([
                circlesGardenFetchPromise,
                circlesLandProfileQueryPromise,
                //...balanceQueryPromises
              ]);

              const circlesGardenProfilesResult = results[0];
              const circlesLandProfilesResult = results[1];

              const balancesBySafeAddress: { [safeAddress: string]: BN } = {};
              const circlesLandProfiles: Profile[] = circlesLandProfilesResult;

              const circlesGardenProfiles =
                circlesGardenProfilesResult.data?.map((o: any) => {
                  return <Profile>{
                    id: 0,
                    firstName: o.username,
                    lastName: "",
                    circlesAddress: o.safeAddress.toLowerCase(),
                    avatarUrl: o.avatarUrl,
                  };
                }) ?? [];

              context.data.safeCandidates = {};
              for (let candidateAddress of foundSafeAddresses) {
                context.data.safeCandidates[candidateAddress.safeAddress] = {
                  address: candidateAddress.safeAddress,
                  balance: balancesBySafeAddress[candidateAddress.safeAddress],
                  circlesGardenProfile: circlesGardenProfiles?.find(
                    (o) => o.circlesAddress == candidateAddress.safeAddress
                  ),
                  circlesLandProfile: circlesLandProfiles.find(
                    (o) => o.circlesAddress == candidateAddress.safeAddress
                  ),
                };
              }

              const candidates = Object.values(context.data.safeCandidates);
              if (candidates.length == 0) {
                context.messages[
                  "seedPhrase"
                ] = `Found no safes with a positive CRC balance that are owned by ${context.data.importedAccount.address.toLowerCase()}.`;
                throw new Error(context.messages["seedPhrase"]);
              }

              if (candidates.length == 1) {
                context.data.selectedSafe = candidates[0];
              }
            },
            onDone: [
              {
                cond: (context) => !!context.data.selectedSafe,
                target: "#addNewOwnerInfo",
              },
              {
                cond: (context) =>
                  !context.data.selectedSafe &&
                  Object.keys(context.data.safeCandidates).length > 1,
                target: "#selectSafe",
              },
            ],
            onError: "#seedPhrase",
          },
        },

        selectSafe: prompt<PromptConnectOrCreateContext, any>({
          id: "selectSafe",
          field: "selectedSafe",
          component: SimpleDropDownEditor,
          params: <
            DropdownSelectorParams<
              PromptConnectOrCreateContext,
              SafeCandidate,
              string
            >
          >{
            view: {
              title: "We found multiple safes for your key",
              description:
                "Please select the one you want to connect with your circles.land profile",
              submitButtonText: "Connect",
            },
            placeholder: "",
            submitButtonText: "Connect",
            itemTemplate: DropDownCandidateSafe,
            getKey: (o) => o.address,
            getLabel: (o) => {
              if (
                o.circlesLandProfile &&
                o.circlesLandProfile.firstName &&
                o.circlesLandProfile.firstName != ""
              ) {
                return `${o.circlesLandProfile.firstName} ${
                  o.circlesLandProfile.lastName ?? ""
                }`;
              }
              if (o.circlesGardenProfile) {
                return o.circlesGardenProfile.username;
              }
              return o.address;
            },
            keyProperty: "address",
            choices: {
              byKey: async (key: string, context) => {
                return context.data.safeCandidates[key];
              },
              find: async (filter: string, context) => {
                return Object.values(context.data.safeCandidates);
              },
            },
          },
          navigation: {
            next: "#addNewOwnerInfo",
            previous: "#seedPhrase",
            canSkip: () => false,
            canGoBack: () => true,
          },
        }),

        addNewOwnerInfo: prompt({
          id: "addNewOwnerInfo",
          field: "__",
          component: HtmlViewer,
          params: {
            view: editorContent.addOwnerInfo,
            html: () =>
              "We will add a new owner to your safe. No worries we keep your old key as owner too.",
            hideNav: false,
          },
          navigation: {
            next: "#addNewOwner",
          },
        }),

        addNewOwner: {
          id: "addNewOwner",
          entry: () => {
            window.o.publishEvent(<PlatformEvent>{
              type: "shell.progress",
              message: "Adding new owner ..",
            });
          },
          invoke: {
            src: async (context) => {
              if (typeof context.data.selectedSafe === "string") {
                context.data.selectedSafe =
                  context.data.safeCandidates[context.data.selectedSafe];
              }

              context.data.safeProxy = new GnosisSafeProxy(
                RpcGateway.get(),
                context.data.selectedSafe.address
              );

              var km = new KeyManager(null);
              await km.load();

              const currentOwners = await context.data.safeProxy.getOwners();
              if (
                currentOwners.find(
                  (o) => o.toLowerCase() == km.torusKeyAddress.toLowerCase()
                )
              ) {
                console.log("The new safe owner was already added.");
              } else {
                const receipt = await context.data.safeProxy.addOwnerWithThreshold(
                  context.data.importedAccount.privateKey,
                  km.torusKeyAddress,
                  1
                );

                console.log("Added new owner to safe: ", receipt);
              }
              //safeProxy.addOwnerWithThreshold()
            },
            onDone: "updateRegistration",
            onError: "seedPhrase",
          },
        },

        updateRegistration: {
          id: "updateRegistration",
          invoke: {
            src: async (context) => {
              const apiClient = await window.o.apiClient.client.subscribeToResult();

              window.o.publishEvent(<PlatformEvent>{
                type: "shell.progress",
                message: "Importing your organisations ..",
              });

              const importedOrganisations = await apiClient.mutate({
                mutation: ImportOrganisationsDocument
              });
              console.log("importedOrganisations:", importedOrganisations);

              const orgas:{
                id:number
                circlesAddress:string
                name:string
                description?:string
                avatarUrl?:string
              }[] = importedOrganisations.data?.importOrganisationsOfAccount;

              var km = new KeyManager(null);
              await km.load();

              for (let orga of orgas) {
                window.o.publishEvent(<PlatformEvent>{
                  type: "shell.progress",
                  message: `Adding you as owner to ${orga.name} ..`
                });
                try {
                  const safeProxy = new GnosisSafeProxy(RpcGateway.get(), orga.circlesAddress);
                  await safeProxy.addOwnerWithThreshold(
                    context.data.importedAccount.privateKey,
                    km.torusKeyAddress,
                    1
                  );
                } catch (e) {
                  console.error(e);
                }
              }

              window.o.publishEvent(<PlatformEvent>{
                type: "shell.progress",
                message: "Updating your profile ..",
              });

              const $me = await loadProfile();
              const result = await apiClient.mutate({
                mutation: UpsertProfileDocument,
                variables: {
                  id: $me.id,
                  circlesAddress: context.data.selectedSafe.address,
                  circlesSafeOwner: $me.circlesSafeOwner,
                  avatarCid: $me.avatarCid,
                  avatarUrl: $me.avatarUrl,
                  avatarMimeType: $me.avatarMimeType,
                  firstName: $me.firstName,
                  lastName: $me.lastName,
                  country: $me.country,
                  dream: $me.dream,
                  newsletter: $me.newsletter,
                  displayCurrency: $me.displayCurrency,
                  status: $me.status ?? "registered",
                },
              });
            },
            onDone: "success",
            onError: "seedPhrase",
          },
        },

        success: {
          type: "final",
          entry: (context) => {
            if (context.data.successAction) {
              context.data.successAction(context.data);
            }
          },
        },
      },
    },
    {
      services: {
        findMostRecentUbiSafe: async (context, event) => {
          const result = await ApiClient.query<string, FindSafeAddressByOwnerQueryVariables>(FindSafeAddressByOwnerDocument,{
            owner: context.data.importedAccount.address.toLowerCase(),
          });
        },
      },
    }
  );

export const connectSafe: ProcessDefinition<
  void,
  PromptConnectOrCreateContext
> = {
  name: "connectSafe",
  stateMachine: <any>processDefinition,
};