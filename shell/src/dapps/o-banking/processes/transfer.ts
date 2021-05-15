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

export type TransferContextData = {
  safeAddress: string;
  recipientAddress?: string;
  message?: string;
  tokens?: {
    currency: string;
    amount: string;
  };
  maxFlows?: {
    [currency: string]: string;
  };
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
  labelRecipientAddress:
    "Select the recipient you want to send money to",
  tokensLabel: "Please enter the amount",
  currencyCircles: "CRC",
  currencyXdai: "xDai",
  summaryLabel: "Summary",
  messageLabel: "Purpose of transfer",
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
            target: "#acceptSummary",
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
            const apiClient = await window.o.apiClient.client.subscribeToResult();
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
                  .map((o) => {
                    return <Choice>{
                      value: o.circlesAddress,
                      label: `${o.firstName} ${o.lastName}`,
                      avatarUrl: o.avatarUrl,
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
            target: "#message",
          },
          {
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
          next: "#acceptSummary",
          canSkip: () => true,
        },
      }),
      acceptSummary: prompt<TransferContext, any>({
        fieldName: "acceptSummary",
        component: HtmlViewer,
        params: {
          label: strings.summaryLabel,
          html: (context) => {
            if (!context.data.tokens) {
              throw new Error(`No currency or amount selected`);
            } else {
              return `<span>You are about to transfer</span>
                <strong class='text-primary block'>${
                  context.data.tokens.amount
                } ${context.data.tokens.currency.toUpperCase()}</strong>
                <span class='block'>
                to 
                </span>
                <strong class='block break-all'>${
                  context.data.recipientAddress
                }</strong>
                <span class='block mt-4'>Message:</span>
                <span class='block'>
                ${context.data.message}
                </span>
                <strong class='text-primary block mt-4'>
                Do you want to continue?
                </strong>`;
            }
          },
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
          onDone: "#success",
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
          onDone: "#success",
          onError: "#error",
        },
      },
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
