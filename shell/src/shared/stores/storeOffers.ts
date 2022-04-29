import { readable, writable } from "svelte/store";
import { AggregateType, Offer, Offers } from "../api/data/types";
import { me } from "./me";
import { Subscriber, Subscription } from "rxjs";
import { ApiClient } from "../apiConnection";

let offersById: { [id: number]: Offer } = {};

export class StoreOffers {
  private readonly _subscribe: any;

  constructor(storeCirclesAddress: string) {
    const { subscribe, set, update } = writable<Offer[]>([], (set) => {
      const offers = this.loadOffers(storeCirclesAddress).then((e) => set(e));
    });
    this._subscribe = subscribe;
  }

  subscribe(run: Subscriber<any>) {
    return this._subscribe(run);
  }

  private async loadOffers(shopId?: string) {
    let mySafeAddress = "";
    me.subscribe(($me) => (mySafeAddress = $me.circlesAddress))();
    let result = undefined;
    if (shopId) {
      result = await ApiClient.queryAggregate<Offers>(
        AggregateType.Offers,
        mySafeAddress,
        {
          offers: {
            createdByAddresses: [shopId],
          },
        }
      );
    } else {
      result = await ApiClient.queryAggregate<Offers>(
        AggregateType.Offers,
        mySafeAddress
      );
    }
    return result.offers;
  }
}

export class StoresOffers {
  readonly storeOffers: { [storeCirclesAddress: string]: StoreOffers } = {};

  getOffersFor(storeCirclesAddress: string): StoreOffers {
    if (!this.storeOffers[storeCirclesAddress]) {
      this.storeOffers[storeCirclesAddress] = new StoreOffers(
        storeCirclesAddress
      );
    }
    return this.storeOffers[storeCirclesAddress];
  }
}

export const storeOffers = new StoresOffers();
