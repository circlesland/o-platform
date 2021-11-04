import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import TransferSummary from "../../o-banking/atoms/TransferSummary.svelte";
import { Profile } from "../../../shared/api/data/types";
import {
  transferCircles,
  TransitivePath,
} from "../../../dapps/o-banking/processes/transferCircles";
import { TransactionReceipt } from "web3-core";

export type PurchaseContextData = {
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

export type PurchaseContext = ProcessContext<PurchaseContextData>;

const editorContent: { [x: string]: EditorViewContext } = {
  summary: {
    title: "Check out",
    description: "thank you, we transferred all your money to us. Goodbye",
    placeholder: "",
    submitButtonText: "Pay now",
  },
};

const processDefinition = (processId: string) =>
  createMachine<PurchaseContext, any>({
    id: `${processId}:createOffer`,
    initial: "acceptSummary",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<PurchaseContext, any>("error"),

      acceptSummary: prompt<PurchaseContext, any>({
        field: "acceptSummary",
        component: TransferSummary,
        params: {
          view: editorContent.summary,
          submitButtonText: editorContent.summary.submitButtonText,
          html: () => "",
        },
        navigation: {
          next: "#success",
        },
      }),
      success: {
        type: "final",
        id: "success",
        data: (context, event: any) => {
          // console.log(`enter: upsertIdentity.success`, context.data);
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.authenticated",
            profile: context.data,
          });
          return event.data;
        },
      },
    },
  });

export const purchase: ProcessDefinition<void, PurchaseContextData> = {
  name: "purchase",
  stateMachine: <any>processDefinition,
};
