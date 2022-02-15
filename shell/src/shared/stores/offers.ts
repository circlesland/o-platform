import {readable} from "svelte/store";
import {AggregateType, Offer, Offers} from "../api/data/types";
import {me} from "./me";
import {Subscription} from "rxjs";
import {ApiClient} from "../apiConnection";

let offersById: { [id: number]: Offer } = {};

async function loadOffers() {
  let mySafeAddress = "";
  me.subscribe($me => mySafeAddress = $me.circlesAddress)();
  const result = await ApiClient.queryAggregate<Offers>(AggregateType.Offers, mySafeAddress);
  return result.offers;
}

export const {subscribe} = readable<Offer[]>([], function start(set) {
  // Subscribe to $me and reload the store when the profile changes
  async function update() {
    const offers = await loadOffers();
    offers.forEach(o => offersById[o.id] = o);
    set(offers);
  }

  let shellEventSubscription: Subscription;

  const profileSubscription = me.subscribe(async $me => {
    if (shellEventSubscription) {
      shellEventSubscription.unsubscribe();
      shellEventSubscription = null;
    }

    console.log(`offers: Updating ..`);
    await update();

    shellEventSubscription = window.o.events.subscribe(async event => {
      // TODO: Update when new offers have been created
    });
  });

  return function stop() {
    profileSubscription();

    if (shellEventSubscription) {
      shellEventSubscription.unsubscribe();
      shellEventSubscription = null;
    }
  };
});

export const offers = {
  subscribe: subscribe,
  findById: async (id: number) => {
    let cachedOffer = offersById[id];
    if (!cachedOffer) {
      let mySafeAddress = "";
      me.subscribe($me => mySafeAddress = $me.circlesAddress)();
      const result = await ApiClient.queryAggregate<Offers>(AggregateType.Offers, mySafeAddress, {
        offers: {
          offerIds: [id]
        }
      });
      if (result.offers.length == 1) {
        offersById[result.offers[0].id] = result.offers[0];
      }
      cachedOffer = result.offers[0];
    }
    return cachedOffer;
  }
}