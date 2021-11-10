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
import {show} from "@o-platform/o-process/dist/actions/show";
import ErrorView from "../../../shared/atoms/Error.svelte";
import {ipc} from "@o-platform/o-process/dist/triggers/ipc";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {transferCircles} from "../../o-banking/processes/transferCircles";
import {convertTimeCirclesToCircles} from "../../../shared/functions/displayCirclesAmount";
import {totalPrice} from "../stores/shoppingCartStore";
import {me} from "../../../shared/stores/me";

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
          onDone: "#pay",
          onError: {
            actions: (context, event) => {
              window.o.lastError = event.data;
            },
            target: "#showError",
          }
        }
      },
      pay: {
        id: "pay",
        on: <any>{
          ...ipc("pay"),
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
              let amount = 0;
              const unsub = totalPrice.subscribe($totalPrice => {
                amount = $totalPrice;
              });
              unsub();

              let mySafeAddress = "";
              const unsub2 = me.subscribe($me => {
                mySafeAddress = $me.circlesAddress;
              });
              unsub2();

              return {
                safeAddress: mySafeAddress,
                recipientAddress: context.data.sellerProfile.circlesAddress,
                amount: convertTimeCirclesToCircles(
                  amount,
                  null
                ),
                privateKey: sessionStorage.getItem("circlesKey"),
                message: undefined,
                transitivePath: context.data.transitivePath,
              };
            },
            messages: {},
            dirtyFlags: {},
          },
          onDone: {
            target: "#success",
            actions: (context, event) => {
              // context.data.transitivePath = event.data.transitivePath;
              // context.data.receipt = event.data.receipt;
              console.log("Transfer CRC returned:", event.data);
            },
          },
          onError: "#showError",
        },
      },
      showError: {
        id: "showError",
        entry: show({
          component: ErrorView,
          params: {},
          field: {
            name: "",
            get: () => undefined,
            set: (o: any) => {},
          },
        }),
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
