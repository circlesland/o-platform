import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import CurrencyTransfer from "@o-platform/o-editors/src/CurrencyTransfer.svelte";
import { ipc } from "@o-platform/o-process/dist/triggers/ipc";
import { transferXdai } from "./transferXdai";
import { transferCircles, TransitivePath } from "./transferCircles";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import * as yup from "yup";
import { requestPathToRecipient } from "../services/requestPathToRecipient";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { BN } from "ethereumjs-util";
import { AvataarGenerator } from "../../../shared/avataarGenerator";
import { promptCirclesSafe } from "../../../shared/api/promptCirclesSafe";
import { SetTrustContext } from "./setTrust";
import { loadProfileByProfileId } from "../../../shared/api/loadProfileByProfileId";
import { loadProfileBySafeAddress } from "../../../shared/api/loadProfileBySafeAddress";
import { me } from "../../../shared/stores/me";
import {DirectPathDocument, Profile, ProfileBySafeAddressDocument} from "../../../shared/api/data/types";
import {
  convertTimeCirclesToCircles,
  displayCirclesAmount,
} from "../../../shared/functions/displayCirclesAmount";
import { TransactionReceipt } from "web3-core";
import TransferSummary from "../atoms/TransferSummary.svelte";
import TransferConfirmation from "../atoms/TransferConfirmation.svelte";

export type TransferContextData = {
  safeAddress: string;
  recipientAddress?: string;
  recipientProfileId?: number;
  recipientProfile?: Profile;
  transitivePath: TransitivePath;
  receipt: TransactionReceipt;
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


export async function findDirectTransfers(from:string, to:string, amount:string) {
  // Find all tokens which are trusted by "to"
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const result = await apiClient.query({
    query: DirectPathDocument,
    variables: {
      from: from,
      to: to,
      amount: amount
    },
  });
  if (result.errors) {
    throw new Error(`An error occurred in the graphQL query: ${JSON.stringify(result.errors)}`);
  }
  const transitivePath:TransitivePath = result.data.directPath;
  console.log("Direct path: ", transitivePath);

  return transitivePath;
}

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

const editorContent: { [x: string]: EditorViewContext } = {
  recipient: {
    title: "Select the recipient you want to send money to",
    description: "",
    placeholder: "Recipient",
    submitButtonText: "Enter Name",
  },
  recipientSafeAddress: {
    title: "Enter the recipients safe address",
    description: "Here you can enter the recipients safe address directly.",
    placeholder: "Safe Address",
    submitButtonText: "Next",
  },
  currency: {
    title: "Please enter the Amount",
    description: "",
    submitButtonText: "Submit",
  },
  message: {
    title: "Transfer Message",
    description: "",
    submitButtonText: "Submit",
  },
  confirm: {
    title: "You are about to transfer",
    description: "",
    submitButtonText: "Send Money",
  },
  success: {
    title: "Transfer successful",
    description: "",
    submitButtonText: "Close",
  },
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
            target: "#tokens",
          },
          {
            target: "#recipientAddress",
          },
        ],
      },
      recipientAddress: promptCirclesSafe<SetTrustContext, any>({
        field: "recipientAddress",
        onlyWhenDirty: false,
        params: {
          view: editorContent.recipient,
          placeholder: editorContent.recipient.placeholder,
          submitButtonText: "Check send limit",
        },
        navigation: {
          next: "#tokens",
        },
      }),
      tokens: prompt<TransferContext, any>({
        field: "tokens",
        component: CurrencyTransfer,
        params: {
          view: editorContent.currency,
          currencies: [
            {
              value: "crc",
              label: strings.currencyCircles,
              __typename: "Currency",
            },
            {
              value: "xdai",
              label: strings.currencyXdai,
              __typename: "Currency",
            },
          ],
        },
        dataSchema: yup.object().shape({
          amount: yup
            .number()
            .min(0.1, "Please enter at least 0.1")
            .typeError("Please enter a valid Number.")
            .required("Please enter a valid amount.")
            .positive("Please enter a valid amount."),
          currency: yup.string().required("Please select a valid currency."),
        }),
        navigation: {
          next: "#findMaxFlow",
          previous: "#recipientAddress",
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
            console.log("CONEXT DATA", context.data);
            const p1 = new Promise<void>(async (resolve) => {

              const amount = context.data.tokens.currency == "crc"
                ? convertTimeCirclesToCircles(
                  Number.parseFloat(context.data.tokens.amount),
                  null
                ).toString()
                : context.data.tokens.amount;

              const circlesValueInWei = RpcGateway.get().utils
                .toWei(amount.toString() ?? "0", "ether")
                .toString();

              const flow = await findDirectTransfers(context.data.safeAddress, context.data.recipientAddress, circlesValueInWei);

              // TODO: Re-implement pathfinder when available again
/*

              const flow = await requestPathToRecipient({
                data: {
                  recipientAddress: context.data.recipientAddress,
                  amount:
                    context.data.tokens.currency == "crc"
                      ? convertTimeCirclesToCircles(
                          Number.parseFloat(context.data.tokens.amount),
                          null
                        ).toString()
                      : context.data.tokens.amount,
                  safeAddress: context.data.safeAddress,
                },
              });
 */
              context.data.maxFlows["crc"] = flow.flow;
              context.data.transitivePath = flow;
              resolve();
            });
            context.data.maxFlows["xdai"] = await RpcGateway.get().eth.getBalance(context.data.safeAddress);
            await p1;
          },
          onDone: "#checkAmount",
          onError: "#error",
        },
      },
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
                  convertTimeCirclesToCircles(
                    Number.parseFloat(context.data.tokens.amount),
                    null
                  ).toString(),
                  "ether"
                )
              );

              return maxFlowInWei.gte(amountInWei);
            },
            target: "#loadRecipientProfile",
          },
          {
            actions: (context) => {
              let displayTimeCircles = true;
              const unsubscribeMe = me.subscribe(($me) => {
                displayTimeCircles =
                  $me.displayTimeCircles ||
                  $me.displayTimeCircles === undefined;
              });
              unsubscribeMe();
              const formattedAmount = parseFloat(
                displayCirclesAmount(
                  context.data.tokens.amount.toString(),
                  null,
                  displayTimeCircles
                ).toString()
              );
              const formattedMax = parseFloat(
                RpcGateway.get().utils.fromWei(
                  context.data.maxFlows[
                    context.data.tokens.currency.toLowerCase()
                  ].toString(),
                  "ether"
                )
              ).toFixed(2);
              context.messages[
                "tokens"
              ] = `The chosen amount exceeds the maximum transferable amount of (${formattedMax}).`;
            },
            target: "#tokens",
          },
        ],
      },
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
          onDone: [
            {
              cond: (context) => !!context.data.recipientProfile,
              target: "#message",
            },
            {
              target: "#acceptSummary",
            },
          ],
          onError: "#error",
        },
      },
      message: prompt<TransferContext, any>({
        field: "message",
        component: TextareaEditor,
        params: {
          view: editorContent.message,
          maxLength: "100",
        },
        navigation: {
          previous: "#tokens",
          next: "#acceptSummary",
          canSkip: () => true,
        },
      }),

      acceptSummary: prompt<TransferContext, any>({
        field: "acceptSummary",
        component: TransferConfirmation,
        params: {
          view: editorContent.confirm,
          submitButtonText: editorContent.confirm.submitButtonText,
          html: () => "",
        },
        navigation: {
          previous: "#message",
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
        entry: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: `Sending Circles ..`,
          });
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
                amount: convertTimeCirclesToCircles(
                  Number.parseFloat(context.data.tokens.amount),
                  null
                ),
                privateKey: sessionStorage.getItem("circlesKey"),
                message: context.data.message,
                transitivePath: context.data.transitivePath,
              };
            },
            messages: {},
            dirtyFlags: {},
          },
          onDone: {
            target: "#showSuccess",
            actions: (context, event) => {
              context.data.transitivePath = event.data.transitivePath;
              context.data.receipt = event.data.receipt;
              console.log("Transfer CRC returned:", event.data);
            },
          },
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
                privateKey: sessionStorage.getItem("circlesKey"),
                message: context.data.message,
              };
            },
            messages: {},
            dirtyFlags: {},
          },
          onDone: {
            target: "#showSuccess",
            actions: (context, event) => {
              context.data.receipt = event.data.receipt;
            },
          },
          onError: "#error",
        },
      },
      showSuccess: prompt({
        id: "showSuccess",
        field: "__",
        entry: (context) => {
          context.dirtyFlags = {};
        },
        component: TransferSummary,
        params: {
          view: editorContent.success,
          html: () => "",
          hideNav: false,
        },
        navigation: {
          next: "#success",
        },
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
