import {writable} from "svelte/store";
import {AggregateType, CompletePurchaseDocument, Purchase, Purchases} from "../api/data/types";
import {me} from "./me";
import {Subscription} from "rxjs";
import {ApiClient} from "../apiConnection";

let purchasesById: { [id: number]: Purchase } = {};

async function loadPurchases(safeAddress:string) {
  const result = await ApiClient.queryAggregate<Purchases>(AggregateType.Purchases, safeAddress);
  result.purchases.forEach(o => purchasesById[o.id] = o);
  return result.purchases;
}

let shellEventSubscription: Subscription;
let profileSubscription: () => void|undefined;

export const {subscribe, set, update} = writable<Purchase[]>(null, function start(set) {
  // Subscribe to $me and reload the store when the profile changes
  async function update(safeAddress:string) {
    const purchases = await loadPurchases(safeAddress);
    set(purchases);
  }

  if (!profileSubscription) {
    profileSubscription = me.subscribe(async $me => {
      if (shellEventSubscription) {
        shellEventSubscription.unsubscribe();
        shellEventSubscription = null;
      }

      console.log(`purchases: Updating ..`);
      await update($me.circlesAddress);

      shellEventSubscription = window.o.events.subscribe(async event => {
        // TODO: Update when new sales have been created
      });
    });
  }

  return function stop() {
    if (profileSubscription) {
      profileSubscription();
      profileSubscription = null;
    }

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
    const completedInvoice = await apiClient.mutate({
      mutation: CompletePurchaseDocument,
      variables: {
        invoiceId: invoiceId
      }
    });
    if (!completedInvoice.data?.completePurchase) {
      throw new Error(`Couldn't complete the purchase.`);
    }
    const refreshedPurchases = await loadPurchases(completedInvoice.data.completePurchase.buyerAddress);
    set(refreshedPurchases);
  }
}