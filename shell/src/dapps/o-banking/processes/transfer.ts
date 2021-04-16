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

export type TransferContextData = {
  safeAddress: string;
  recipientAddress?: string;
  tokens?: {
    currency: string;
    amount: string;
  };
  acceptSummary?: boolean;
};

const trustUsersQuery = {
  query: gql`
    query safe($id: String!) {
      safe(id: $id) {
        incoming {
          userAddress
          canSendToAddress
          limit
        }
        outgoing {
          userAddress
          canSendToAddress
          limit
        }
      }
    }
  `,
  variables: {
    id: "0xd460db4cfa021c42edeb7e555d904400dab65ecc",
  },
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
          graphqlQuery: trustUsersQuery,
          optionIdentifier: "canSendToAddress",
          getOptionLabel: (option) => option.canSendToAddress,
          getSelectionLabel: (option) => option.canSendToAddress,
        },
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
              return `You are about to transfer <b>${
                context.data.tokens.amount
              } ${context.data.tokens.currency.toUpperCase()}</b> to <b>${
                context.data.recipientAddress
              }</b>.<br/>Do you want to continue?`;
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
              return context.data.tokens.currency == "crc";
            },
            target: "callCirclesTransfer",
          },
          {
            cond: (context) => {
              return context.data.tokens.currency == "xdai";
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
