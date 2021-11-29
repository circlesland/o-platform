import {writable} from "svelte/store";
import {AggregateType, CompletePurchaseDocument, Purchase, Purchases} from "../api/data/types";
import {me} from "./me";
import {Subscription} from "rxjs";
import {ApiClient} from "../apiConnection";

let purchasesById: { [id: number]: Purchase } = {};

async function loadPurchases() {
  let mySafeAddress = "";
  me.subscribe($me => mySafeAddress = $me.circlesAddress)();
  const result = await ApiClient.queryAggregate<Purchases>(AggregateType.Purchases, mySafeAddress);
  return result.purchases;
}

export const {subscribe, set, update} = writable<Purchase[]>([], function start(set) {
  // Subscribe to $me and reload the store when the profile changes
  async function update() {
    const purchases = await loadPurchases();
    purchases.forEach(o => purchasesById[o.id] = o);
    set(purchases);
  }

  let shellEventSubscription: Subscription;

  const profileSubscription = me.subscribe(async $me => {
    if (shellEventSubscription) {
      shellEventSubscription.unsubscribe();
      shellEventSubscription = null;
    }

    console.log(`purchases: Updating ..`);
    await update();

    shellEventSubscription = window.o.events.subscribe(async event => {
      // TODO: Update when new purchases have been created
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

export const purchases = {
  subscribe: subscribe,
  findById: async (id: number) => {
    let cachedPurchase = purchasesById[id];
    if (!cachedPurchase) {
      let mySafeAddress = "";
      me.subscribe($me => mySafeAddress = $me.circlesAddress)();
      const result = await ApiClient.queryAggregate<Purchases>(AggregateType.Purchases, mySafeAddress, {
        purchases: {
          purchaseIds: [id]
        }
      });
      if (result.purchases.length == 1) {
        purchasesById[result.purchases[0].id] = result.purchases[0];
      }
      cachedPurchase = result.purchases[0];
    }
    return cachedPurchase;
  },
  completePurchase: async (invoiceId:number) => {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    await apiClient.mutate({
      mutation: CompletePurchaseDocument,
      variables: {
        invoiceId: invoiceId
      }
    });
    const refreshedPurchases = await loadPurchases();
    set(refreshedPurchases);
  }
}