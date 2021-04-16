import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import TextAutocompleteEditor from "../../../../../packages/o-editors/src/TextAutocompleteEditor.svelte";
import HtmlViewer from "../../../../../packages/o-editors/src/HtmlViewer.svelte";
import CurrencyTransfer from "../../../../../packages/o-editors/src/CurrencyTransfer.svelte";
import { ipc } from "@o-platform/o-process/dist/triggers/ipc";
import { transferXdai } from "./transferXdai";
import { transferCircles } from "./transferCircles";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import TextEditor from "../../../../../packages/o-editors/src/TextEditor.svelte";
import {SetTrustContext} from "./setTrust";

export type SendInviteGasContextData = {
  safeAddress: string;
  recipientAddress?: string;
  amount?:number;
  acceptSummary?: boolean;
};

/**
 * This is the context on which the process will work.
 * The actual fields are defined above in the 'AuthenticateContextData' type.
 * The 'AuthenticateContextData' type is also the return value of the process (see bottom for the signature).
 */
export type SendInviteGasContext = ProcessContext<SendInviteGasContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
  summaryLabel: "Summary",
  amountLabel: "How many invites do you want to send?"
};

const processDefinition = (processId: string) =>
  createMachine<SendInviteGasContext, any>({
    id: `${processId}:transfer`,
    initial: "acceptSummary",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<SendInviteGasContext, any>("error"),

      amount: prompt<SetTrustContext, any>({
        fieldName: "amount",
        component: TextEditor,
        params: {
          label: strings.amountLabel,
        },
        navigation: {
          next: "#acceptSummary",
        },
      }),
      acceptSummary: prompt<SendInviteGasContext, any>({
        fieldName: "acceptSummary",
        component: HtmlViewer,
        params: {
          label: strings.summaryLabel,
          html: (context) => {
            return `You are about to transfer <b>${context.data.amount} invite credits (equivalent to {context.data.amount * 0.10} XDAI) to <b>${context.data.recipientAddress}</b>.
                    <br/>Click next to send it now.`;
          },
        },
        navigation: {
          next: "#callXdaiTransfer",
        },
      }),
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

export const sendInviteGas: ProcessDefinition<void, SendInviteGasContext> = {
  name: "sendInviteGas",
  stateMachine: <any>processDefinition,
};
