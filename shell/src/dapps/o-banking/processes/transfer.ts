import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import DropdownSelectEditor from "@o-platform/o-editors/src/DropdownSelectEditor.svelte";
import HtmlViewer from "@o-platform/o-editors/src/HtmlViewer.svelte";
import CurrencyTransfer from "@o-platform/o-editors/src/CurrencyTransfer.svelte";
import { ipc } from "@o-platform/o-process/dist/triggers/ipc";
import { transferXdai } from "./transferXdai";
import { transferCircles } from "./transferCircles";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import gql from "graphql-tag";
import { Choice } from "@o-platform/o-editors/src/choiceSelectorContext";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import * as yup from "yup";
import { requestPathToRecipient } from "../services/requestPathToRecipient";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { BN } from "ethereumjs-util";
import { loadProfileByProfileId } from "../data/loadProfileByProfileId";
import { loadProfileBySafeAddress } from "../data/loadProfileBySafeAddress";
import { AvataarGenerator } from "../../../shared/avataarGenerator";
import {Profile} from "../data/api/types";

export type TransferContextData = {
  safeAddress: string;
  recipientAddress?: string;
  recipientProfileId?: number;
  recipientProfile?: Profile;
  message?: string;
  tokens?: {
    currency: string;
    amount: string;
  };
  maxFlows?: {
    [currency: string]: string;
  };
  summaryHtml?: string;
  acceptSummary?: boolean;
};

/**
 * This is the context on which the process will work.
 * The actual fields are defined above in the 'AuthenticateContextData' type.
 * The 'AuthenticateContextData' type is also the return value of the process (see bottom for the signature).
 */
export type TransferContext = ProcessContext<TransferContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
  labelRecipientAddress: "Select the recipient you want to send money to",
  tokensLabel: "Please enter the amount",
  currencyCircles: "CRC",
  currencyXdai: "xDai",
  summaryLabel: "Summary",
  messageLabel: "Purpose of transfer",
};

const currencyLookup = {
  CRC: "Circles",
  XDAI: "xDai",
};

const processDefinition = (processId: string) =>
  createMachine<TransferContext, any>({
    id: `${processId}:transfer`,
    initial: "checkIsPreFilled",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<TransferContext, any>("error"),

      checkIsPreFilled: {
        id: "checkIsPreFilled",
        always: [
          {
            cond: (context) => {
              const web3 = RpcGateway.get();

              const hasSender = web3.utils.isAddress(context.data.safeAddress);
              const hasRecipient = web3.utils.isAddress(
                context.data.recipientAddress
              );
              const amount = new BN(
                !context.data.tokens?.amount
                  ? "0"
                  : web3.utils.toWei(
                      context.data.tokens?.amount?.toString(),
                      "ether"
                    )
              );
              const hasAmount = amount.gt(new BN("0"));
              const isXdai = context.data.tokens?.currency == "xdai";

              return hasSender && hasRecipient && hasAmount && isXdai;
            },
            target: "#loadRecipientProfile",
          },
          {
            target: "#checkRecipientAddress",
          },
        ],
      },

      checkRecipientAddress: {
        id: "checkRecipientAddress",
        always: [
          {
            cond: (context) => !!context.data.recipientAddress,
            target: "#findMaxFlow",
          },
          {
            target: "#recipientAddress",
          },
        ],
      },
      recipientAddress: prompt<TransferContext, any>({
        fieldName: "recipientAddress",
        component: DropdownSelectEditor,
        params: {
          label: strings.labelRecipientAddress,
          graphql: true,
          asyncChoices: async (searchText?: string) => {
            const apiClient =
              await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.query({
              query: gql`
                query search($searchString: String!) {
                  search(query: { searchString: $searchString }) {
                    id
                    circlesAddress
                    firstName
                    lastName
                    dream
                    country
                    avatarUrl
                  }
                }
              `,
              variables: {
                searchString: searchText ?? "",
              },
            });

            return result.data.search && result.data.search.length > 0
              ? result.data.search
                    .filter(o => o.circlesAddress)
                    .map((o) => {
                      return <Choice>{
                        value: RpcGateway.get().utils.toChecksumAddress(o.circlesAddress),
                        label: `${o.firstName} ${o.lastName ? o.lastName : ""}`,
                        avatarUrl: o.avatarUrl ? o.avatarUrl : AvataarGenerator.generate(o.circlesAddress),
                      };
                    })
                  .filter((o) => o.value)
              : [];
          },
          optionIdentifier: "value",
          getOptionLabel: (option) => option.label,
          getSelectionLabel: (option) => option.label,
        },
        dataSchema: yup.string().required("Please enter a valid eth-address."),
        navigation: {
          next: "#findMaxFlow",
        },
      }),
      findMaxFlow: {
        id: "findMaxFlow",
        entry: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: `Calculating the maximum transfer amount ..`,
          });
        },
        invoke: {
          id: "findMaxFlow",
          src: async (context) => {
            if (!context.data.recipientAddress) {
              throw new Error(`No recipient address on context`);
            }
            context.data.maxFlows = {};
            const p1 = new Promise<void>(async (resolve, reject) => {
              const flow = await requestPathToRecipient({
                data: {
                  recipientAddress: context.data.recipientAddress,
                  amount: "9999999000000000000000000",
                  safeAddress: context.data.safeAddress,
                },
              });
              context.data.maxFlows["crc"] = flow.flow;
              resolve();
            });
            const p2 = await RpcGateway.trigger(async (web3) => {
              context.data.maxFlows["xdai"] = await web3.eth.getBalance(
                web3.utils.toChecksumAddress(context.data.safeAddress)
              );
            }, 1000);

            await Promise.all([p1, p2]);
          },
          onDone: "#tokens",
          onError: "#error",
        },
      },
      tokens: prompt<TransferContext, any>({
        fieldName: "tokens",
        component: CurrencyTransfer,
        params: {
          label: strings.tokensLabel,
          currencies: [
            {
              value: "crc",
              label: strings.currencyCircles,
            },
            {
              value: "xdai",
              label: strings.currencyXdai,
            },
          ],
        },
        dataSchema: yup.object().shape({
          amount: yup
            .number()
            .typeError("Please enter a valid Number.")
            .required("Please enter a valid amount.")
            .positive("Please enter a valid amount."),
          currency: yup.string().required("Please select a valid currency."),
        }),
        navigation: {
          next: "#checkAmount",
          previous: "#recipientAddress",
        },
      }),
      checkAmount: {
        id: "checkAmount",
        always: [
          {
            cond: (context, event) => {
              const maxFlowInWei = new BN(
                context.data.maxFlows[
                  context.data.tokens.currency.toLowerCase()
                ]
              );
              const amountInWei = new BN(
                RpcGateway.get().utils.toWei(
                  context.data.tokens.amount,
                  "ether"
                )
              );
              return maxFlowInWei.gte(amountInWei);
            },
            target: "#loadRecipientProfile",
          },
          {
            actions: (context) => {
              const formattedAmount = parseFloat(context.data.tokens.amount).toFixed(2);
              const formattedMax = parseFloat(RpcGateway.get().utils.fromWei(context.data.maxFlows[context.data.tokens.currency.toLowerCase()].toString(), "ether")).toFixed(2);
              context.messages["tokens"] = `The chosen amount (${formattedAmount}) exceeds the maximum transferable amount of (${formattedMax}).`;
            },
            target: "#tokens",
          },
        ],
      },
      message: prompt<TransferContext, any>({
        fieldName: "message",
        component: TextareaEditor,
        params: {
          label: strings.messageLabel,
          maxLength: "100",
        },
        navigation: {
          previous: "#tokens",
          next: "#loadRecipientProfile",
          canSkip: () => true,
        },
      }),
      loadRecipientProfile: {
        id: "loadRecipientProfile",
        invoke: {
          src: async (context) => {
            if (context.data.recipientProfileId) {
              // Use the profile id to get the profile but send to the context.data.recipientAddress
              context.data.recipientProfile = await loadProfileByProfileId(
                context.data.recipientProfileId
              );
            } else if (context.data.recipientAddress) {
              context.data.recipientProfile = await loadProfileBySafeAddress(
                context.data.recipientAddress
              );
            } else {
              // No profile found
            }
          },
          onDone: "#prepareSummary",
          onError: "#error",
        },
      },
      prepareSummary: {
        id: "prepareSummary",
        invoke: {
          src: async (context) => {
            const lastName = context.data.recipientProfile.lastName
              ? context.data.recipientProfile.lastName
              : "";
            const to = context.data.recipientProfile
              ? context.data.recipientProfile.firstName + " " + lastName
              : context.data.recipientAddress;

            let toAvatarUrl = context.data.recipientProfile
              ? context.data.recipientProfile.avatarUrl
              : null;

            if (context.data.tokens?.currency?.toLowerCase() != "xdai") {
              toAvatarUrl = toAvatarUrl
                  ? toAvatarUrl
                  : AvataarGenerator.generate(context.data.recipientAddress);
            } else {
              toAvatarUrl = toAvatarUrl
                  ? toAvatarUrl
                  : AvataarGenerator.default();
            }

            if (!context.data.tokens) {
              throw new Error(`No currency or amount selected`);
            } else {
              context.data.summaryHtml = `<span>You are about to transfer</span>
                <strong class='text-primary text-5xl block mt-2'>
                    ${context.data.tokens.amount}
                    ${
                      currencyLookup[context.data.tokens.currency.toUpperCase()]
                    }</strong>
                <span class='block mt-2'>
                to 
                </span>
                <div class="avatar self-center justify-self-center text-center mt-4">
                  <div class="w-36 h-36 rounded-full mb-4">
                    <img
                      src=${toAvatarUrl}
                      alt=${to}
                    />
                  </div>
                </div>
                <div class="self-center flex-grow justify-self-start text-center">
                  <h2>
                    ${to}
                  </h2>
                </div>
                <strong class='text-primary block mt-4'>
                Do you want to continue?
                </strong>`;
            }
          },
          onDone: "#acceptSummary",
          onError: "#error",
        },
      },
      acceptSummary: prompt<TransferContext, any>({
        fieldName: "acceptSummary",
        component: HtmlViewer,
        params: {
          label: strings.summaryLabel,
          submitButtonText: "Send Money",
          html: (context) => context.data.summaryHtml,
        },
        navigation: {
          previous: "#tokens",
          next: "#checkChoice",
        },
      }),
      checkChoice: {
        id: "checkChoice",
        always: [
          {
            cond: (context) => {
              return context.data.tokens.currency.toLowerCase() == "crc";
            },
            target: "callCirclesTransfer",
          },
          {
            cond: (context) => {
              return context.data.tokens.currency.toLowerCase() == "xdai";
            },
            target: "callXdaiTransfer",
          },
        ],
      },
      callCirclesTransfer: {
        id: "callCirclesTransfer",
        on: <any>{
          ...ipc("callCirclesTransfer"),
        },
        invoke: {
          src: transferCircles.stateMachine(
            `${processId}:transfer:transferCircles`
          ),
          data: {
            data: (context, event) => {
              return {
                safeAddress: context.data.safeAddress,
                recipientAddress: context.data.recipientAddress,
                amount: context.data.tokens.amount,
                privateKey: localStorage.getItem("circlesKey"),
              };
            },
            messages: {},
            dirtyFlags: {},
          },
          onDone: "#showSuccess",
          onError: "#error",
        },
      },
      callXdaiTransfer: {
        id: "callXdaiTransfer",
        on: <any>{
          ...ipc("callXdaiTransfer"),
        },
        invoke: {
          src: transferXdai.stateMachine(`${processId}:transfer:transferXdai`),
          data: {
            data: (context, event) => {
              return {
                safeAddress: context.data.safeAddress,
                recipientAddress: context.data.recipientAddress,
                amount: context.data.tokens.amount,
                privateKey: localStorage.getItem("circlesKey"),
              };
            },
            messages: {},
            dirtyFlags: {},
          },
          onDone: "#showSuccess",
          onError: "#error",
        },
      },
      showSuccess: prompt({
        id: "showSuccess",
        fieldName: "__",
        component: HtmlViewer,
        params: {
          html: () => `<p>Transfer successful</p>`,
          submitButtonText: "Close",
          hideNav: true
        },
        navigation: {
          next: "#success"
        }
      }),
      success: {
        id: "success",
        type: "final",
        data: (context, event: PlatformEvent) => {
          return "yeah!";
        },
      },
    },
  });

export const transfer: ProcessDefinition<void, TransferContext> = {
  name: "transfer",
  stateMachine: <any>processDefinition,
};
