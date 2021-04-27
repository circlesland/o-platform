import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import DropdownSelectEditor from "@o-platform/o-editors/src/DropdownSelectEditor.svelte";
import HtmlViewer from "../../../../../packages/o-editors/src/HtmlViewer.svelte";
import CurrencyTransfer from "../../../../../packages/o-editors/src/CurrencyTransfer.svelte";
import { ipc } from "@o-platform/o-process/dist/triggers/ipc";
import { transferXdai } from "./transferXdai";
import { transferCircles } from "./transferCircles";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import gql from "graphql-tag";
import { Choice } from "../../../../../packages/o-editors/src/choiceSelectorContext";
import * as yup from "yup";

export type TransferContextData = {
  safeAddress: string;
  recipientAddress?: string;
  tokens?: {
    currency: string;
    amount: string;
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
    "Select the recipient you want to send money to (autocomplete up)",
  tokensLabel: "Please enter the amount and the token you want to transfer",
  currencyCircles: "CRC",
  currencyXdai: "xDai",
  summaryLabel: "Summary",
};

const processDefinition = (processId: string) =>
  createMachine<TransferContext, any>({
    id: `${processId}:transfer`,
    initial: "checkRecipientAddress",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<TransferContext, any>("error"),

      checkRecipientAddress: {
        id: "checkRecipientAddress",
        always: [
          {
            cond: (context) => !!context.data.recipientAddress,
            target: "#tokens",
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
          next: "#tokens",
        },
      }),
      tokens: prompt<TransferContext, any>({
        fieldName: "tokens",
        component: CurrencyTransfer,
        params: {
          label: strings.tokensLabel,
          currencies: [
            {
              key: "crc",
              label: strings.currencyCircles,
            },
            {
              key: "xdai",
              label: strings.currencyXdai,
            },
          ],
        },
        navigation: {
          next: "#acceptSummary",
          previous: "#recipientAddress",
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
              return `You are about to transfer <strong>${
                context.data.tokens.amount
              } ${context.data.tokens.currency.toUpperCase()}</strong> to <strong>${
                context.data.recipientAddress
              }</strong>.<br/>Do you want to continue?`;
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
