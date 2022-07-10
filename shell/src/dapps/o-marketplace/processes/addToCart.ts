import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {createMachine} from "xstate";
import {ConfirmLegalAgeDocument, Offer, Profile} from "../../../shared/api/data/types";
import {offers} from "../../../shared/stores/offers";
import {cartContents} from "../stores/shoppingCartStore";
import {promptChoice} from "../../o-passport/processes/identify/prompts/promptChoice";
import {UpsertRegistrationContext} from "../../o-onboarding/processes/registration/promptRegistration";
import ChoiceSelector from "@o-platform/o-editors/src/ChoiceSelector.svelte";
import { me } from "../../../shared/stores/me";
import {ApiClient} from "../../../shared/apiConnection";
import { setWindowLastError } from "../../../shared/processes/actions/setWindowLastError";

export type AddToCartContextData = {
  offerId: number,
  shopId: number,
  offer?: Offer & { shopId: number },
  successAction?: (data: AddToCartContextData) => Promise<void>,
  redirectTo?: string,
  confirmedLegalAge?: number
};

export type AddToCartContext = ProcessContext<AddToCartContextData>;

const processDefinition = (processId: string) =>
  createMachine<AddToCartContext, any>({
    id: `${processId}:addToCart`,
    initial: "loadOffer",
    states: {
      ...fatalError<AddToCartContext, any>("error"),

      loadOffer: {
        id: '#loadOffer',
        invoke: {
          src: async (context) => {
            if (!context.data.offerId) {
              throw new Error(`The process' context got no 'offerId'.`);
            }

            const o = await offers.findById(context.data.offerId);
            if (!o) {
              throw new Error(`Couldn't find an offer with id ${context.data.offerId}`);
            }

            let $me:Profile;
            me.subscribe(m => $me = m)();
            context.data.confirmedLegalAge = $me.confirmedLegalAge;

            context.data.offer = {
              ...o,
              shopId: context.data.shopId,
            };
          },
          onDone: [{
            cond: (context) => (!context.data.confirmedLegalAge || context.data.confirmedLegalAge < 18) && context.data.offer.minAge >= 18,
            target: "#confirmMinAge18"
          }, {
            cond: (context) => (!context.data.confirmedLegalAge || context.data.confirmedLegalAge < 16) && context.data.offer.minAge >= 16,
            target: "#confirmMinAge16"
          }, {
            cond: (context) => !context.data.offer.minAge || context.data.confirmedLegalAge >= 18,
            target: "#addToCart"
          }]
        }
      },
      confirmMinAge16: promptChoice<UpsertRegistrationContext, any>({
        id: "confirmMinAge16",
        component: ChoiceSelector,
        params: {
          view: {
            title: window.i18n("dapps.o-marketplace.processes.addToCart.confirmMinAge16.params.title"),
            description: window.i18n("dapps.o-marketplace.processes.addToCart.confirmMinAge16.params.description")
          }
        },
        options: [{
            key: "yesIm16",
            label: window.i18n("dapps.o-marketplace.processes.addToCart.confirmMinAge16.options.label"),
            target: "#addToCart",
            class: "btn btn-outline",
            action: (context) => {
              ApiClient.mutate(ConfirmLegalAgeDocument, {age: 16}).then(o => console.log(`Updated the profile's legal age to 16`)).then(() => {
                me.reload();
              });
            },
          },
          {
            key: "noImNot16",
            label: window.i18n("dapps.o-marketplace.processes.addToCart.confirmMinAge16.options.labelToYoung"),
            target: "#success",
            class: "btn btn-outline",
            action: (context) => {
            },
          },
        ],
        navigation: {
          // previous: "#loadOffer",
          canGoBack: () => false,
          canSkip: () => false,
          skip: "#addToCart"
        },
      }),
      confirmMinAge18: promptChoice<UpsertRegistrationContext, any>({
        id: "confirmMinAge18",
        component: ChoiceSelector,
        params: {
          view: {
            title: window.i18n("dapps.o-marketplace.processes.addToCart.confirmMinAge18.params.title"),
            description: window.i18n("dapps.o-marketplace.processes.addToCart.confirmMinAge18.params.description")
          }
        },
        options: [{
            key: "yesIm18",
            label: window.i18n("dapps.o-marketplace.processes.addToCart.confirmMinAge18.options.labelOldEnough"),
            target: "#addToCart",
            class: "btn btn-outline",
            action: (context) => {
              ApiClient.mutate(ConfirmLegalAgeDocument, {age: 18}).then(o => console.log(`Updated the profile's legal age to 18`)).then(() => {
                me.reload();
              });
            },
          },
          {
            key: "noImNot18",
            label: window.i18n("dapps.o-marketplace.processes.addToCart.confirmMinAge18.options.labelNotOldEnough"),
            target: "#success",
            class: "btn btn-outline",
            action: (context) => {
            },
          },
        ],
        navigation: {
          // previous: "#loadOffer",
          canGoBack: () => false,
          canSkip: () => false,
          skip: "#addToCart"
        },
      }),
      addToCart: {
        id: "addToCart",
        invoke: {
          src: async (context, event) => {
            let offer: Offer & { shopId: number } = context.data.offer;
            let cart: (Offer & { shopId: number })[] = [];

            cartContents.subscribe((o) => {
              cart = o ? o : [];
            })();

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
