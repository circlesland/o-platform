import {writable} from "svelte/store";
import {AggregateType, CompleteSaleDocument, Sale, Sales} from "../api/data/types";
import {me} from "./me";
import {Subscription} from "rxjs";
import {ApiClient} from "../apiConnection";

let salesById: { [id: number]: Sale } = {};

async function loadSales() {
  let mySafeAddress = "";
  me.subscribe($me => mySafeAddress = $me.circlesAddress)();
  const result = await ApiClient.queryAggregate<Sales>(AggregateType.Sales, mySafeAddress);
  return result.sales;
}

export const {subscribe, set, update} = writable<Sale[]>(null, function start(set) {
  // Subscribe to $me and reload the store when the profile changes
  async function update() {
    const sales = await loadSales();
    sales.forEach(o => salesById[o.id] = o);
    set(sales);
  }

  let shellEventSubscription: Subscription;

  const profileSubscription = me.subscribe(async $me => {
    if (shellEventSubscription) {
      shellEventSubscription.unsubscribe();
      shellEventSubscription = null;
    }

    console.log(`sales: Updating ..`);
    await update();

    shellEventSubscription = window.o.events.subscribe(async event => {
      // TODO: Update when new sales have been created
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

export const sales = {
  subscribe: subscribe,
  findById: async (id: number) => {
    let cachedSale = salesById[id];
    if (!cachedSale) {
      let mySafeAddress = "";
      me.subscribe($me => mySafeAddress = $me.circlesAddress)();
      const result = await ApiClient.queryAggregate<Sales>(AggregateType.Sales, mySafeAddress, {
        sales: {
          salesIds: [id]
        }
      });
      if (result.sales.length == 1) {
        salesById[result.sales[0].id] = result.sales[0];
      }
      cachedSale = result.sales[0];
    }
    return cachedSale;
  },
  completeSale: async (invoiceId:number) => {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    await apiClient.mutate({
      mutation: CompleteSaleDocument,
      variables: {
        invoiceId: invoiceId
      }
    });
    const refreshedSales = await loadSales();
    set(refreshedSales);
  }
}