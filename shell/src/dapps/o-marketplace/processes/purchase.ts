import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import CheckoutSummary from "../../o-marketplace/atoms/CheckoutSummary.svelte";
import { Profile, Offer, Purchase } from "../../../shared/api/data/types";

import {
  transferCircles,
  TransitivePath,
} from "../../../dapps/o-banking/processes/transferCircles";
import { TransactionReceipt } from "web3-core";

export type PurchaseContextData = {
  items: Offer[];
  safeAddress: string;
  recipientAddress?: string;
  sellerProfile?: Profile;
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
    description: "You are about to transfer",
    placeholder: "",
    submitButtonText: "Buy now",
  },
};

const processDefinition = (processId: string) =>
  createMachine<PurchaseContext, any>({
    id: `${processId}:createOffer`,
    initial: "init",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<PurchaseContext, any>("error"),

      init: {
        id: "init",
        entry: (context) => {
          const cartContents = JSON.parse(localStorage.getItem("cartContents"));
          if (cartContents) {
            context.data.items = cartContents;
            context.data.sellerProfile = cartContents[0].createdBy;
          }
        },
        always: "#checkoutSummary",
        // onError: "#error",
      },
      checkoutSummary: prompt<PurchaseContext, any>({
        field: "checkoutSummary",
        component: CheckoutSummary,
        // const cachedProfile = localStorage.getItem("cartContents");
        params: {
          view: editorContent.summary,
          submitButtonText: editorContent.summary.submitButtonText,
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
