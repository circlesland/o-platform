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
  FindSafesByOwnerDocument, FindSafesByOwnerQueryVariables, ImportOrganisationsDocument, SafeInfo,
  UpsertProfileDocument,
} from "../../../shared/api/data/types";
import { GnosisSafeProxy } from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import HtmlViewer from "../../../../../packages/o-editors/src/HtmlViewer.svelte";
import { KeyManager } from "../../o-passport/data/keyManager";
import { loadProfile } from "../../o-passport/processes/identify/services/loadProfile";
import SimpleDropDownEditor from "../../../../../packages/o-editors/src/SimpleDropDownEditor.svelte";
import { DropdownSelectorParams } from "@o-platform/o-editors/src/DropdownSelectEditorContext";
import DropDownCandidateSafe from "../views/atoms/DropDownCandidateSafe.svelte";
import {ApiClient} from "../../../shared/apiConnection";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";

export type ConnectSafeInfo = {
  success: boolean,
  errorMessage?: string,
  importedAccount?: Account,
  ownedSafes?: {[x:string]:SafeInfo & {isAlive: boolean}}
}

export type PromptConnectOrCreateContextData = {
  seedPhrase?: string;
  availableSafes?: ConnectSafeInfo;
  selectedSafe?: SafeInfo & {isAlive: boolean};
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
  accountIsDeadInfo: {
    title: "Safe deactivated",
    description: "The selected safe received no UBI for more than 90 days and was deactivated. You can still use your Circles and transfer them to your new safe.",
    placeholder: "",
    submitButtonText: "Create new safe"
  }
};

async function safeInfoFromSeedphrase(context:ConnectSafeContext) : Promise<ConnectSafeInfo> {
  let keyFromMnemonic:string;
  try {
    keyFromMnemonic = "0x"
      + bip39.mnemonicToEntropy(context.data.seedPhrase.replace(/\s\s+/g, " "));
  } catch (e) {
    return {
      success: false,
      errorMessage: `The seedphrase cannot be converted to a private key. Please double check it.`
    };
  }

  const importedAccount = RpcGateway.get().eth.accounts.privateKeyToAccount(keyFromMnemonic);

  const candidates = await ApiClient.query<
    SafeInfo[], FindSafesByOwnerQueryVariables>(FindSafesByOwnerDocument,{
    owner: importedAccount.address.toLowerCase()
  });

  if (candidates.length == 0) {
    return {
      success: false,
      errorMessage: `Found no safes with a positive CRC balance that are owned by ${importedAccount.address.toLowerCase()}.`
    };
  }

  const candidatesBySafeAddress = candidates.reduce((p,c) => {
    p[c.safeAddress] = c;
    return p;
  }, <{[x:string]:SafeInfo}>{});

  return {
    success: true,
    importedAccount: importedAccount,
    ownedSafes: Object.values(candidatesBySafeAddress).map(o => {
      const nowMinus90days = Date.now() - (90 * 24 * 60 * 60 * 1000);
      return {
        ...o,
        isAlive: o.lastUbiAt && parseInt(o.lastUbiAt) > nowMinus90days
      }
    }).reduce((p,c) => {
      p[c.safeAddress] = c;
      return p;
    }, <{[x:string]:SafeInfo & {isAlive: boolean}}>{})
  };
}

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
            next: "#findSafe",
          }
        }),

        findSafe: {
          id: "findSafe",
          invoke: {
            src: async (context) => {
              context.data.availableSafes = await safeInfoFromSeedphrase(context);
              if (!context.data.availableSafes.success) {
                context.messages["seedPhrase"] = context.data.availableSafes.errorMessage;
                throw new Error(context.messages["seedPhrase"]);
              }
              const ownedSafes = Object.values(context.data.availableSafes.ownedSafes);
              if (context.data.availableSafes.success && ownedSafes.length == 1) {
                context.data.selectedSafe = ownedSafes[0];
              }
            },
            onDone: [{
              cond: (context) =>
                !!context.data.selectedSafe && context.data.selectedSafe.isAlive,
              target: "#addNewOwnerInfo"
            }, {
              cond: (context) =>
                !!context.data.selectedSafe && !context.data.selectedSafe.isAlive,
              target: "#accountIsDeadInfo"
            }, {
                target: "#selectSafe"
              }
            ],
            onError: "#seedPhrase",
          }
        },

        selectSafe: prompt<PromptConnectOrCreateContext, any>({
          id: "selectSafe",
          field: "selectedSafe",
          component: SimpleDropDownEditor,
          params: <DropdownSelectorParams<PromptConnectOrCreateContext, SafeInfo, string>> {
            view: {
              title: "We found multiple safes for your key",
              description: "Please select the one you want to connect with your circles.land profile",
              submitButtonText: "Connect",
            },
            placeholder: "",
            submitButtonText: "Connect",
            itemTemplate: DropDownCandidateSafe, // TODO: This is not used by the SimpleDropDownEditor
            getKey: (o) => o.safeAddress,
            getLabel: (o) => {
              if (
                o.safeProfile &&
                o.safeProfile.firstName &&
                o.safeProfile.firstName != ""
              ) {
                return `${o.safeProfile.firstName} ${o.safeProfile.lastName ?? ""}`;
              }
              return o.safeAddress;
            },
            keyProperty: "safeAddress",
            choices: {
              byKey: async (key: string, context) => {
                return context.data.availableSafes.ownedSafes[key];
              },
              find: async (filter: string, context) => {
                return Object.values(context.data.availableSafes.ownedSafes);
              },
            },
          },
          navigation: {
            next: [{
              cond: (context) => !context.data.selectedSafe.isAlive,
              target: "#accountIsDeadInfo"
            }, {
              target: "#addNewOwnerInfo"
            }],
            previous: "#seedPhrase",
            canSkip: () => false,
            canGoBack: () => true,
          },
        }),

        accountIsDeadInfo: prompt({
          id: "accountIsDeadInfo",
          field: "__",
          component: HtmlViewer,
          params: {
            view: editorContent.accountIsDeadInfo,
            html: () => editorContent.accountIsDeadInfo.description,
            hideNav: false,
          },
          navigation: {
            next: "#addNewOwner",
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
                  context.data.availableSafes[context.data.selectedSafe];
              }

              const safeProxy = new GnosisSafeProxy(
                RpcGateway.get(),
                context.data.selectedSafe.safeAddress
              );

              var km = new KeyManager(null);
              await km.load();

              const currentOwners = await safeProxy.getOwners();
              if (
                currentOwners.find(
                  (o) => o.toLowerCase() == km.torusKeyAddress.toLowerCase()
                )
              ) {
                console.log("The new safe owner was already added.");
              } else {
                const receipt = await safeProxy.addOwnerWithThreshold(
                  context.data.availableSafes.importedAccount.privateKey,
                  km.torusKeyAddress,
                  1
                );

                console.log("Added new owner to safe: ", receipt);
              }
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
                    context.data.availableSafes.importedAccount.privateKey,
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

              let importedFirstName = context.data.selectedSafe.safeProfile?.firstName
                ? context.data.selectedSafe.safeProfile?.firstName
                : "";

              if (RpcGateway.get().utils.isAddress(importedFirstName)) {
                importedFirstName = "";
              }

              const result = await apiClient.mutate({
                mutation: UpsertProfileDocument,
                variables: {
                  id: $me.id,
                  successorOfCirclesAddress: !context.data.selectedSafe.isAlive
                    ? context.data.selectedSafe.safeAddress?.toLowerCase()
                    : undefined,
                  circlesSafeOwner: $me.circlesSafeOwner,
                  circlesAddress: context.data.selectedSafe.isAlive
                    ? context.data.selectedSafe.safeAddress.toLowerCase()
                    : undefined,
                  avatarCid: $me.avatarCid,
                  avatarUrl: $me.avatarUrl
                    ? $me.avatarUrl
                    : context.data.selectedSafe.safeProfile?.avatarUrl
                      ? context.data.selectedSafe.safeProfile?.avatarUrl
                      : null,
                  avatarMimeType: $me.avatarMimeType,
                  firstName: $me.firstName && $me.firstName != ""
                    ? $me.firstName
                    : importedFirstName,
                  lastName: $me.lastName
                    ? $me.lastName
                    : context.data.selectedSafe.safeProfile?.lastName
                      ? context.data.selectedSafe.safeProfile?.lastName
                      : null,
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
    }
  );

export const connectSafe: ProcessDefinition<
  void,
  PromptConnectOrCreateContext
> = {
  name: "connectSafe",
  stateMachine: <any>processDefinition,
};