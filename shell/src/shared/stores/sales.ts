import { writable } from "svelte/store";
import {
  AggregateType,
  CompleteSaleDocument,
  Sale,
  Sales,
} from "../api/data/types";
import { me } from "./me";
import { Subscription } from "rxjs";
import { ApiClient } from "../apiConnection";

let salesById: { [id: number]: Sale } = {};
let salesByPickupCode: { [id: string]: Sale } = {};

async function loadSales(safeAddress: string) {
  const result = await ApiClient.queryAggregate<Sales>(
    AggregateType.Sales,
    safeAddress
  );
  result.sales.forEach((o) => (salesById[o.id] = o));
  return result.sales;
}

let shellEventSubscription: Subscription;
let profileSubscription: () => void | undefined;

export const { subscribe, set, update } = writable<Sale[]>(
  null,
  function start(set) {
    // Subscribe to $me and reload the store when the profile changes
    async function update(safeAddress: string) {
      const sales = await loadSales(safeAddress);
      set(sales);
    }

    if (!profileSubscription) {
      profileSubscription = me.subscribe(async ($me) => {
        if (shellEventSubscription) {
          shellEventSubscription.unsubscribe();
          shellEventSubscription = null;
        }

        console.log(`sales: Updating ..`);
        await update($me.circlesAddress);

        shellEventSubscription = window.o.events.subscribe(async (event) => {
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
  }
);

export const sales = {
  subscribe: subscribe,
  findByPickupCode: async (code: string) => {
    let cachedSale = salesByPickupCode[code];
    if (!cachedSale) {
      let mySafeAddress = "";
      me.subscribe(($me) => (mySafeAddress = $me.circlesAddress))();
      const result = await ApiClient.queryAggregate<Sales>(
        AggregateType.Sales,
        mySafeAddress,
        {
          sales: {
            pickupCode: code,
          },
        }
      );
      if (result.sales.length == 1) {
        salesById[result.sales[0].id] = result.sales[0];
      }
      cachedSale = result.sales[0];
    }
    return cachedSale;
  },
  findById: async (id: number) => {
    let cachedSale = salesById[id];
    if (!cachedSale) {
      let mySafeAddress = "";
      me.subscribe(($me) => (mySafeAddress = $me.circlesAddress))();
      const result = await ApiClient.queryAggregate<Sales>(
        AggregateType.Sales,
        mySafeAddress,
        {
          sales: {
            salesIds: [id],
          },
        }
      );
      if (result.sales.length == 1) {
        salesById[result.sales[0].id] = result.sales[0];
      }
      cachedSale = result.sales[0];
    }
    return cachedSale;
  },
  completeSale: async (invoiceId: number) => {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const completedInvoice = await apiClient.mutate({
      mutation: CompleteSaleDocument,
      variables: {
        invoiceId: invoiceId,
      },
    });
    if (!completedInvoice.data?.completeSale) {
      throw new Error(window.i18n("shared.stores.sales.errors.couldNotComplete"));
    }
    const refreshedPurchases = await loadSales(
      completedInvoice.data.completeSale.sellerAddress
    );
    set(refreshedPurchases);
  },
  revokeSale: async (invoiceId: number) => {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const completedInvoice = await apiClient.mutate({
      mutation: CompleteSaleDocument,
      variables: {
        invoiceId: invoiceId,
        revoke: true,
      },
    });
    if (!completedInvoice.data?.completeSale) {
      throw new Error(window.i18n("shared.stores.sales.errors.couldNoRevoke"));
    }
    const refreshedPurchases = await loadSales(
      completedInvoice.data.completeSale.sellerAddress
    );
    set(refreshedPurchases);
  },
};
