import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import CheckoutSummary from "../../o-marketplace/atoms/CheckoutSummary.svelte";
import {
  Profile,
  Offer,
  CreatePurchaseDocument,
  PurchaseLineInput
} from "../../../shared/api/data/types";

export type PurchaseContextData = {
  items: Offer[];
  sellerProfile?: Profile;
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
            // TODO: THIS ASSUMES ALL ITEMS ARE FROM THE SAME SELLER
            context.data.sellerProfile = cartContents[0].createdByProfile;
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
          next: "#createPurchase",
        },
      }),
      createPurchase: {
        id: "createPurchase",
        invoke: {
          src: async (context) => {
            const linesGroupedByOffer: {[offerId:number]: number} = {};
            context.data.items.forEach(o => {
              linesGroupedByOffer[o.id] = linesGroupedByOffer[o.id]
                ? linesGroupedByOffer[o.id] + 1
                : 1;
            })

            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: CreatePurchaseDocument,
              variables: {
                lines: Object.entries(linesGroupedByOffer).map(o => {
                  return <PurchaseLineInput> {
                    offerId: parseInt(o[0]),
                    amount: o[1]
                  }
                })
              }
            });

            console.log(result);
          },
          onDone: "#success",
          onError: "#success"
        }
      },
      success: {
        type: "final",
        id: "success",
        data: (context, event: any) => {
          return event.data;
        },
      },
    },
  });

export const purchase: ProcessDefinition<void, PurchaseContextData> = {
  name: "purchase",
  stateMachine: <any>processDefinition,
};
