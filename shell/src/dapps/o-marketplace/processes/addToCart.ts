import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {createMachine} from "xstate";
import {Offer} from "../../../shared/api/data/types";
import {offers} from "../../../shared/stores/offers";
import {cartContents} from "../stores/shoppingCartStore";

export type AddToCartContextData = {
  offerId: number,
  shopId: number,
  successAction?: (data: AddToCartContextData) => Promise<void>,
  redirectTo?: string
};

export type AddToCartContext = ProcessContext<AddToCartContextData>;

const processDefinition = (processId: string) =>
  createMachine<AddToCartContext, any>({
    id: `${processId}:addToCart`,
    initial: "addToCart",
    states: {
      ...fatalError<AddToCartContext, any>("error"),

      addToCart: {
        invoke: {
          src: async (context, event) => {

            let offer: Offer & { shopId: number };
            let cart: (Offer & { shopId: number })[] = [];

            if (!context.data.offerId) {
              throw new Error(`The process' context got no 'offerId'.`);
            }

            const o = await offers.findById(context.data.offerId);
            if (!o) {
              throw new Error(`Couldn't find an offer with id ${context.data.offerId}`);
            }

            offer = {
              ...o,
              shopId: context.data.shopId,
            };

            const unsubCart = cartContents.subscribe((o) => {
              cart = o ? o : [];
            });
            unsubCart();

            cartContents.update((o) => (cartContents ? [...cart, offer] : [offer]));

          },
          onDone: "#success"
        }
      },

      success: {
        type: "final",
        id: "success",
        entry: (context) => {
        },
        invoke: {
          src: async (context) => {
            if (context.data.successAction) {
              await context.data.successAction(context.data);
            }
          }
        },
        data: (context, event: any) => {
          return context.data;
        },
      },
    }
  });

export const addToCart: ProcessDefinition<void,
  AddToCartContext> = {
  name: "addToCart",
  stateMachine: <any>processDefinition,
};
