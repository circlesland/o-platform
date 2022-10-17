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
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { BN } from "ethereumjs-util";
import { promptCirclesSafe } from "../../../shared/api/promptCirclesSafe";
import { SetTrustContext } from "./setTrust";
import { loadProfileByProfileId } from "../../../shared/api/loadProfileByProfileId";
import { loadProfileBySafeAddress } from "../../../shared/api/loadProfileBySafeAddress";

import { me } from "../../../shared/stores/me";
import { DirectPathDocument, Profile, QueryDirectPathArgs } from "../../../shared/api/data/types";
import { convertTimeCirclesToCircles, displayCirclesAmount } from "../../../shared/functions/displayCirclesAmount";
import { TransactionReceipt } from "web3-core";
import TransferSummary from "../atoms/TransferSummary.svelte";
import TransferConfirmation from "../atoms/TransferConfirmation.svelte";
import { ApiClient } from "../../../shared/apiConnection";
import { Currency } from "../../../shared/currency";
import HtmlViewer from "../../../../../packages/o-editors/src/HtmlViewer.svelte";

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
  successAction: (data: TransferContextData) => void;
};

export async function findDirectTransfers(from: string, to: string, amount: string) {
  // Find all tokens which are trusted by "to"
  const result = await ApiClient.query<TransitivePath, QueryDirectPathArgs>(DirectPathDocument, {
    from: from,
    to: to,
    amount: amount,
  });
  return result;
}

export type TransferContext = ProcessContext<TransferContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
  labelRecipientAddress: window.o.i18n("dapps.o-banking.processes.transfer.strings.labelRecipientAddress"),
  tokensLabel: window.o.i18n("dapps.o-banking.processes.transfer.strings.tokensLabel"),
  currencyCircles: window.o.i18n("dapps.o-banking.processes.transfer.strings.currencyCircles"),
  currencyXdai: window.o.i18n("dapps.o-banking.processes.transfer.strings.currencyXdai"),
  summaryLabel: window.o.i18n("dapps.o-banking.processes.transfer.strings.summaryLabel"),
  messageLabel: window.o.i18n("dapps.o-banking.processes.transfer.strings.messageLabel"),
};

const editorContent: { [x: string]: EditorViewContext } = {
  recipient: {
    title: window.o.i18n("dapps.o-banking.processes.transfer.editorContent.recipient.title"),
    description: "",
    placeholder: window.o.i18n("dapps.o-banking.processes.transfer.editorContent.recipient.placeholder"),
    submitButtonText: window.o.i18n("dapps.o-banking.processes.transfer.editorContent.recipient.submitButtonText"),
  },
  recipientSafeAddress: {
    title: window.o.i18n("dapps.o-banking.processes.transfer.editorContent.recipientSafeAddress.title"),
    description: window.o.i18n("dapps.o-banking.processes.transfer.editorContent.recipientSafeAddress.description"),
    placeholder: window.o.i18n("dapps.o-banking.processes.transfer.editorContent.recipientSafeAddress.placeholder"),
    submitButtonText: window.o.i18n(
      "dapps.o-banking.processes.transfer.editorContent.recipientSafeAddress.submitButtonText"
    ),
  },
  currency: {
    title: window.o.i18n("dapps.o-banking.processes.transfer.editorContent.currency.title"),
    description: "",
    submitButtonText: window.o.i18n("dapps.o-banking.processes.transfer.editorContent.currency.submitButtonText"),
  },
  message: {
    title: window.o.i18n("dapps.o-banking.processes.transfer.editorContent.message.title"),
    description: "",
    submitButtonText: window.o.i18n("dapps.o-banking.processes.transfer.editorContent.message.submitButtonText"),
  },
  confirm: {
    title: window.o.i18n("dapps.o-banking.processes.transfer.editorContent.confirm.title"),
    description: "",
    submitButtonText: window.o.i18n("dapps.o-banking.processes.transfer.editorContent.confirm.submitButtonText"),
  },
  success: {
    title: window.o.i18n("dapps.o-banking.processes.transfer.editorContent.success.title"),
    description: "",
    submitButtonText: window.o.i18n("dapps.o-banking.processes.transfer.editorContent.success.submitButtonText"),
  },
  noPath: {
    title: window.o.i18n("dapps.o-banking.processes.transfer.editorContent.success.title"),
    description: "",
    submitButtonText: window.o.i18n("dapps.o-banking.processes.transfer.editorContent.success.submitButtonText"),
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
              const hasRecipient = web3.utils.isAddress(context.data.recipientAddress);
              const amount = new BN(
                !context.data.tokens?.amount ? "0" : web3.utils.toWei(context.data.tokens?.amount?.toString(), "ether")
              );
              const hasAmount = amount.gt(new BN("0"));
              //const isXdai = context.data.tokens?.currency == "xdai";

              return hasSender && hasRecipient && hasAmount /* && isXdai*/;
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
            target: "#loadRecipientProfile",
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
          view: (editorContent.recipient = {
            title: window.o.i18n("dapps.o-banking.processes.transfer.editorContent.recipient.title"),
            description: "",
            placeholder: window.o.i18n("dapps.o-banking.processes.transfer.editorContent.recipient.placeholder"),
            submitButtonText: window.o.i18n(
              "dapps.o-banking.processes.transfer.editorContent.recipient.submitButtonText"
            ),
          }),
          placeholder: (editorContent.recipient.placeholder = window.o.i18n(
            "dapps.o-banking.processes.transfer.editorContent.recipient.placeholder"
          )),
          submitButtonText: window.o.i18n("dapps.o-banking.processes.transfer.recipientAddress.submitButtonText"),
        },
        navigation: {
          next: "#loadRecipientProfile",
        },
      }),
      loadRecipientProfile: {
        id: "loadRecipientProfile",
        invoke: {
          src: async (context) => {
            if (context.data.recipientProfileId) {
              // Use the profile id to get the profile but send to the context.data.recipientAddress
              context.data.recipientProfile = await loadProfileByProfileId(context.data.recipientProfileId);
            } else if (context.data.recipientAddress) {
              context.data.recipientProfile = await loadProfileBySafeAddress(context.data.recipientAddress);
            } else {
              // No profile found
            }
          },
          onDone: [
            {
              cond: (context) => !!context.data.recipientProfile,
              target: "#getMaxFlow",
            },
            {
              target: "#getMaxFlow",
            },
          ],
          onError: "#error",
        },
      },
      getMaxFlow: {
        id: "getMaxFlow",
        entry: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: window.o.i18n("dapps.o-banking.processes.transfer.findMaxFlow.entry.message"),
          });
        },
        invoke: {
          id: "getMaxFlow",
          src: async (context) => {
            const flow = await ApiClient.query<TransitivePath, QueryDirectPathArgs>(DirectPathDocument, {
              from: context.data.safeAddress,
              to: context.data.recipientAddress,
              amount: "9999999999999999999999999999999999",
            });

            if (!context.data.maxFlows) {
              context.data.maxFlows = {};
            }
            context.data.maxFlows["crc"] = flow.flow;
          },
          onDone: [
            {
              cond: (context) => {
                console.log('context.data.maxFlows["crc"] == "0"', context.data.maxFlows["crc"]);
                return context.data.maxFlows["crc"] == "";
              },
              target: "#noTrust",
            },
            {
              target: "#tokens",
            },
          ],
          onError: "#error",
        },
      },
      noTrust: prompt<TransferContext, any>({
        id: "noTrust",
        field: "__",
        component: HtmlViewer,
        params: (context) => {
          return {
            view: {
              title: "Not trusted",
              description: `${context.data.recipientProfile.displayName} isn't trusting you.`,
              submitButtonText: "Go back",
            },
            html: () => "",
            hideNav: false,
          };
        },
        navigation: {
          next: "#recipientAddress",
          canGoBack: () => false,
          canSkip: () => false,
        },
      }),
      tokens: prompt<TransferContext, any>({
        field: "tokens",
        component: CurrencyTransfer,
        params: {
          view: (editorContent.currency = {
            title: window.o.i18n("dapps.o-banking.processes.transfer.editorContent.currency.title"),
            description: "",
            submitButtonText: window.o.i18n(
              "dapps.o-banking.processes.transfer.editorContent.currency.submitButtonText"
            ),
          }),
          currencies: [
            {
              value: "crc",
              label: (strings.currencyCircles = window.o.i18n(
                "dapps.o-banking.processes.transfer.strings.currencyCircles"
              )),
              __typename: "Currency",
            },
            {
              value: "xdai",
              label: (strings.currencyXdai = window.o.i18n("dapps.o-banking.processes.transfer.strings.currencyXdai")),
              __typename: "Currency",
            },
          ],
        },
        dataSchema: yup.object().shape({
          amount: yup
            .number()
            .min(0.1, window.o.i18n("dapps.o-banking.processes.transfer.tokens.dataSchema.min"))
            .typeError(window.o.i18n("dapps.o-banking.processes.transfer.tokens.dataSchema.typeError"))
            .required(window.o.i18n("dapps.o-banking.processes.transfer.tokens.dataSchema.required"))
            .positive(window.o.i18n("dapps.o-banking.processes.transfer.tokens.dataSchema.positive")),
          currency: yup.string().required(window.o.i18n("dapps.o-banking.processes.transfer.tokens.currency")),
        }),
        navigation: {
          next: "#findTransferPath",
          previous: "#recipientAddress",
        },
      }),
      findTransferPath: {
        id: "findTransferPath",
        entry: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: window.o.i18n("dapps.o-banking.processes.transfer.findTransferPath.entry.message"),
          });
        },
        invoke: {
          id: "findTransferPath",
          src: async (context) => {
            if (!context.data.recipientAddress) {
              throw new Error(window.o.i18n("dapps.o-banking.processes.transfer.findTransferPath.invoke"));
            }
            // context.data.maxFlows = {};
            // context.data.maxFlows["xdai"] = await RpcGateway.get().eth.getBalance(context.data.safeAddress);

            const amount = new Currency().convertTimeCirclesToCircles(
              Number.parseFloat(context.data.tokens.amount),
              null
            );

            const circlesValueInWei = RpcGateway.get()
              .utils.toWei(amount.toString() ?? "0", "ether")
              .toString();

            const flow = await ApiClient.query<TransitivePath, QueryDirectPathArgs>(DirectPathDocument, {
              from: context.data.safeAddress,
              to: context.data.recipientAddress,
              amount: circlesValueInWei,
            });

            // context.data.maxFlows["crc"] = flow.flow;
            context.data.transitivePath = flow;
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
              if (context.data.maxFlows[context.data.tokens.currency.toLowerCase()] == "") return false;

              const maxFlowInWei = new BN(context.data.maxFlows[context.data.tokens.currency.toLowerCase()]);

              const amount =
                context.data.tokens.currency == "crc"
                  ? convertTimeCirclesToCircles(
                      Number.parseFloat(context.data.tokens.amount), // HARDCODED TO 10* for now
                      null
                    ).toString()
                  : context.data.tokens.amount;

              const circlesValueInWei = new BN(
                RpcGateway.get()
                  .utils.toWei(amount.toString() ?? "0", "ether")
                  .toString()
              );

              if (maxFlowInWei.lt(circlesValueInWei) || context.data.transitivePath.transfers.length == 0) {
                console.log(
                  `The max flow is smaller than the entered value (${circlesValueInWei}). Max flow: ${maxFlowInWei}`
                );
              }

              return maxFlowInWei.gte(circlesValueInWei) && context.data.transitivePath.transfers.length != 0;
            },
            target: "#message",
          },
          {
            actions: (context) => {
              let displayTimeCircles = true;
              me.subscribe(($me) => {
                displayTimeCircles = $me.displayTimeCircles || $me.displayTimeCircles === undefined;
              })();

              let formattedMax: string = "0.00";
              if (context.data.maxFlows[context.data.tokens.currency.toLowerCase()] != "") {
                formattedMax =
                  parseFloat(
                    new Currency()
                      .displayAmount(
                        context.data.maxFlows[context.data.tokens.currency.toLowerCase()].toString(),
                        null,
                        "EURS"
                      )
                      .toString()
                  ).toFixed(0) + ".00";
              }

              context.messages["tokens"] = window.o.i18n(
                "dapps.o-banking.processes.transfer.checkAmount.contextMessages",
                { values: { formattedMax: formattedMax } }
              );
            },
            target: "#tokens",
          },
        ],
      },
      message: prompt<TransferContext, any>({
        field: "message",
        component: TextareaEditor,
        params: {
          view: (editorContent.message = {
            title: window.o.i18n("dapps.o-banking.processes.transfer.editorContent.message.title"),
            description: "",
            submitButtonText: window.o.i18n(
              "dapps.o-banking.processes.transfer.editorContent.message.submitButtonText"
            ),
          }),
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
          view: (editorContent.confirm = {
            title: window.o.i18n("dapps.o-banking.processes.transfer.editorContent.confirm.title"),
            description: "",
            submitButtonText: window.o.i18n(
              "dapps.o-banking.processes.transfer.editorContent.confirm.submitButtonText"
            ),
          }),
          submitButtonText: (editorContent.confirm.submitButtonText = window.o.i18n(
            "dapps.o-banking.processes.transfer.editorContent.confirm.submitButtonText"
          )),
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
          src: transferCircles.stateMachine(`${processId}:transfer:transferCircles`),
          data: {
            data: (context, event) => {
              return {
                safeAddress: context.data.safeAddress,
                recipientAddress: context.data.recipientAddress,
                amount: convertTimeCirclesToCircles(Number.parseFloat(context.data.tokens.amount), null),
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
          if (context.data.successAction) {
            context.data.successAction(context.data);
          }
        },
        component: TransferSummary,
        params: {
          view: (editorContent.success = {
            title: window.o.i18n("dapps.o-banking.processes.transfer.editorContent.success.title"),
            description: "",
            submitButtonText: window.o.i18n(
              "dapps.o-banking.processes.transfer.editorContent.success.submitButtonText"
            ),
          }),
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
