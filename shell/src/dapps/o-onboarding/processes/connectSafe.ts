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
import {FindSafesByOwnerDocument,FindSafesByOwnerQueryVariables,ImportOrganisationsDocument,SafeInfo,UpsertProfileDocument,} from "../../../shared/api/data/types";
import { GnosisSafeProxy } from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import HtmlViewer from "../../../../../packages/o-editors/src/HtmlViewer.svelte";
import { KeyManager } from "../../o-passport/data/keyManager";
import { loadProfile } from "../../o-passport/processes/identify/services/loadProfile";
import SimpleDropDownEditor from "../../../../../packages/o-editors/src/SimpleDropDownEditor.svelte";
import { DropdownSelectorParams } from "@o-platform/o-editors/src/DropdownSelectEditorContext";
import DropDownCandidateSafe from "../views/atoms/DropDownCandidateSafe.svelte";
import { ApiClient } from "../../../shared/apiConnection";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { BN } from "ethereumjs-util";

export type ConnectSafeInfo = {
  success: boolean;
  errorMessage?: string;
  importedAccount?: Account;
  ownedSafes?: { [x: string]: SafeInfo & { isAlive: boolean } };
};

export type PromptConnectOrCreateContextData = {
  seedPhrase?: string;
  availableSafes?: ConnectSafeInfo;
  selectedSafe?: SafeInfo & { isAlive: boolean };
  successAction?: (data: PromptConnectOrCreateContextData) => void;
};

export type PromptConnectOrCreateContext = ProcessContext<PromptConnectOrCreateContextData>;

const editorContent = {
  seedPhrase: {
    title: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.seedPhrase.title"),
    description: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.seedPhrase.description"),
    placeholder: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.seedPhrase.placeholder"),
    submitButtonText: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.seedPhrase.submitButtonText"),
  },
  addOwnerInfo: {
    title: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.addOwnerInfo.title"),
    description: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.addOwnerInfo.description"),
    placeholder: "",
    submitButtonText: window.o.i18n(
      "dapps.o-onboarding.processes.connectSafe.editorContent.addOwnerInfo.submitButtonText"
    ),
  },
  accountIsDeadInfo: {
    title: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.accountIsDeadInfo.title"),
    description: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.accountIsDeadInfo.description"),
    placeholder: "",
    submitButtonText: window.o.i18n(
      "dapps.o-onboarding.processes.connectSafe.editorContent.accountIsDeadInfo.submitButtonText"
    ),
  },
};

async function safeInfoFromSeedphrase(context: ConnectSafeContext): Promise<ConnectSafeInfo> {
  let keyFromMnemonic: string;
  try {
    keyFromMnemonic = "0x" + bip39.mnemonicToEntropy(context.data.seedPhrase.replace(/\s\s+/g, " "));
  } catch (e) {
    return {
      success: false,
      errorMessage: window.o.i18n("dapps.o-onboarding.processes.connectSafe.safeInfoFromSeedphrase.seedphraseError"),
    };
  }

  const importedAccount = RpcGateway.get().eth.accounts.privateKeyToAccount(keyFromMnemonic);

  const candidates = await ApiClient.query<SafeInfo[], FindSafesByOwnerQueryVariables>(FindSafesByOwnerDocument, {
    owner: importedAccount.address.toLowerCase(),
  });

  if (candidates.length == 0) {
    return {
      success: false,
      errorMessage:
        window.o.i18n("dapps.o-onboarding.processes.connectSafe.safeInfoFromSeedphrase.foundNoSafes") +
        `${importedAccount.address.toLowerCase()}.`,
    };
  }

  const candidatesBySafeAddress = candidates.reduce((p, c) => {
    p[c.safeAddress] = c;
    return p;
  }, <{ [x: string]: SafeInfo }>{});

  return {
    success: true,
    importedAccount: importedAccount,
    ownedSafes: Object.values(candidatesBySafeAddress)
      .map((o) => {
        const nowMinus90days = Date.now() - 90 * 24 * 60 * 60 * 1000;
        return {
          ...o,
          isAlive: o.lastUbiAt && parseInt(o.lastUbiAt) > nowMinus90days,
        };
      })
      .reduce((p, c) => {
        p[c.safeAddress] = c;
        return p;
      }, <{ [x: string]: SafeInfo & { isAlive: boolean } }>{}),
  };
}

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
          view: editorContent.seedPhrase = {
            title: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.seedPhrase.title"),
            description: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.seedPhrase.description"),
            placeholder: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.seedPhrase.placeholder"),
            submitButtonText: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.seedPhrase.submitButtonText"),
          },
        },
        navigation: {
          next: "#findSafe",
        },
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
          onDone: [
            {
              cond: (context) => !!context.data.selectedSafe && context.data.selectedSafe.isAlive,
              target: "#addNewOwnerInfo",
            },
            {
              cond: (context) => !!context.data.selectedSafe && !context.data.selectedSafe.isAlive,
              target: "#accountIsDeadInfo",
            },
            {
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
        params: <DropdownSelectorParams<PromptConnectOrCreateContext, SafeInfo, string>>{
          view: {
            title: window.o.i18n("dapps.o-onboarding.processes.connectSafe.selectSafe.title"),
            description: window.o.i18n("dapps.o-onboarding.processes.connectSafe.selectSafe.description"),
            submitButtonText: window.o.i18n("dapps.o-onboarding.processes.connectSafe.selectSafe.submitButtonText"),
          },
          placeholder: "",
          submitButtonText: window.o.i18n("dapps.o-onboarding.processes.connectSafe.selectSafe.submitButtonText"),
          itemTemplate: DropDownCandidateSafe, // TODO: This is not used by the SimpleDropDownEditor
          getKey: (o) => o.safeAddress,
          getLabel: (o) => (o.safeProfile ? o.safeProfile.displayName : o.safeAddress),
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
          next: [
            {
              cond: (context) => !context.data.selectedSafe.isAlive,
              target: "#accountIsDeadInfo",
            },
            {
              target: "#addNewOwnerInfo",
            },
          ],
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
          view: editorContent.accountIsDeadInfo = {
            title: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.accountIsDeadInfo.title"),
            description: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.accountIsDeadInfo.description"),
            placeholder: "",
            submitButtonText: window.o.i18n(
              "dapps.o-onboarding.processes.connectSafe.editorContent.accountIsDeadInfo.submitButtonText"
            ),
          },
          html: () => editorContent.accountIsDeadInfo.description = window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.accountIsDeadInfo.description"),
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
          view: editorContent.addOwnerInfo = {
            title: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.addOwnerInfo.title"),
            description: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.addOwnerInfo.description"),
            placeholder: "",
            submitButtonText: window.o.i18n(
              "dapps.o-onboarding.processes.connectSafe.editorContent.addOwnerInfo.submitButtonText"
            ),
          },
          html: () => "", //window.o.i18n("dapps.o-onboarding.processes.connectSafe.addNewOwnerInfo"),
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
            message: window.o.i18n("dapps.o-onboarding.processes.connectSafe.addNewOwner"),
          });
        },
        invoke: {
          src: async (context) => {
            if (typeof context.data.selectedSafe === "string") {
              context.data.selectedSafe = context.data.availableSafes[context.data.selectedSafe];
            }

            const oldOwnerBalance = await RpcGateway.get().eth.getBalance(
              context.data.availableSafes.importedAccount.address
            );
            if (new BN(oldOwnerBalance).lt(new BN(RpcGateway.get().utils.toWei("0.01", "ether")))) {
              const currentTorusEoa = RpcGateway.get().eth.accounts.privateKeyToAccount(
                sessionStorage.getItem("circlesKey")
              );
              const signedTx = await currentTorusEoa.signTransaction({
                from: currentTorusEoa.address,
                to: context.data.availableSafes.importedAccount.address,
                value: new BN(RpcGateway.get().utils.toWei("0.01", "ether")),
                gasPrice: await RpcGateway.getGasPrice(),
                gas: 37000,
                nonce: await RpcGateway.get().eth.getTransactionCount(currentTorusEoa.address),
              });

              await RpcGateway.get().eth.sendSignedTransaction(signedTx.rawTransaction);
            }

            const safeProxy = new GnosisSafeProxy(RpcGateway.get(), context.data.selectedSafe.safeAddress);

            var km = new KeyManager(null);
            await km.load();

            const currentOwners = await safeProxy.getOwners();
            if (currentOwners.find((o) => o.toLowerCase() == km.torusKeyAddress.toLowerCase())) {
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
          onError: {
            actions: (context, event) => {
              console.log(`An error occurred while adding the owner:`, event);
            },
            target: "seedPhrase",
          },
        },
      },

      updateRegistration: {
        id: "updateRegistration",
        invoke: {
          src: async (context) => {
            const apiClient = await window.o.apiClient.client.subscribeToResult();

            window.o.publishEvent(<PlatformEvent>{
              type: "shell.progress",
              message: window.o.i18n(
                "dapps.o-onboarding.processes.connectSafe.updateRegistration.importingYourOrganisations"
              ),
            });

            const importedOrganisations = await apiClient.mutate({
              mutation: ImportOrganisationsDocument,
            });
            console.log("importedOrganisations:", importedOrganisations);

            const orgas: {
              id: number;
              circlesAddress: string;
              name: string;
              description?: string;
              avatarUrl?: string;
            }[] = importedOrganisations.data?.importOrganisationsOfAccount;

            var km = new KeyManager(null);
            await km.load();

            for (let orga of orgas) {
              window.o.publishEvent(<PlatformEvent>{
                type: "shell.progress",
                message: window.o.i18n("dapps.o-onboarding.processes.connectSafe.updateRegistration.addingYouAsOwner", {
                  values: { orgaName: orga.name },
                }),
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
              message: window.o.i18n("dapps.o-onboarding.processes.connectSafe.publishEvent"),
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
                askedForEmailAddress: false,
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
                firstName: $me.firstName && $me.firstName != "" ? $me.firstName : importedFirstName,
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
        data: () => true,
      },
    },
  });

export const connectSafe: ProcessDefinition<void, PromptConnectOrCreateContext> = {
  name: "connectSafe",
  stateMachine: <any>processDefinition,
};
