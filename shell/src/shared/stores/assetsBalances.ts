import {readable} from "svelte/store";
import {
  AggregatesDocument,
  AggregateType,
  AssetBalance,
  Erc20Balances,
  ProfileAggregate,
  QueryAggregatesArgs
} from "../api/data/types";
import {me} from "./me";
import {Subscription} from "rxjs";
import {ApiClient} from "../apiConnection";

async function loadBalances(safeAddress: string) {
  const aggregates = await ApiClient.query<ProfileAggregate[], QueryAggregatesArgs>(AggregatesDocument, {
    types: [AggregateType.CrcBalances, AggregateType.Erc20Balances],
    safeAddress: safeAddress
  });

  const crcBalances: ProfileAggregate = aggregates.find(o => o.type == AggregateType.CrcBalances);
  if (!crcBalances || crcBalances.payload.__typename !== AggregateType.CrcBalances) {
    throw new Error(`Couldn't find the CrcBalances in the query result.`)
  }

  let erc20Balances: ProfileAggregate = aggregates.find(o => o.type == AggregateType.Erc20Balances);
  if (!erc20Balances  || erc20Balances.payload.__typename !== AggregateType.Erc20Balances) {
    erc20Balances = {
      type: AggregateType.Erc20Balances,
      safe_address: safeAddress,
      payload: <Erc20Balances>{
        __typename: AggregateType.Erc20Balances,
        lastUpdatedAt: new Date().toJSON(),
        balances: []
      }
    };
  }

  return {
    crcBalances: crcBalances.payload.balances,
    erc20Balances: (<Erc20Balances>erc20Balances.payload).balances
  };
}


let _set:(value:any) => void;

async function _update(safeAddress:string) {
  if (!_set)
    return;
  const balances = await loadBalances(safeAddress);
  _set({
    crcBalances: balances.crcBalances,
    erc20Balances: balances.erc20Balances
  });
}

const _assetsBalances = readable<{
  crcBalances: AssetBalance[],
  erc20Balances: AssetBalance[]
}>({
  crcBalances: [],
  erc20Balances: []
}, function start(set) {
  _set = set;
  // Subscribe to $me and reload the store when the profile changes
  let shellEventSubscription: Subscription;

  const profileSubscription = me.subscribe(async $me => {
    if (shellEventSubscription) {
      shellEventSubscription.unsubscribe();
      shellEventSubscription = null;
    }

    if (!$me?.circlesAddress) {
      console.log(`assetBalances: Not loaded. No safe address on profile.`);
      set({
        erc20Balances: [],
        crcBalances: []
      });
      return;
    }
    console.log(`assetBalances: Updating for ${$me.circlesAddress} ..`);
    await _update($me.circlesAddress);

    shellEventSubscription = window.o.events.subscribe(async event => {
      if (event.type == "blockchain_event") {
        console.log(`assetBalances: Updating because of blockchain event ..`);
        await _update($me.circlesAddress);
      }
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

export const assetBalances = {
  subscribe: _assetsBalances.subscribe,
  update: () => {
    me.subscribe(async $me => {
      _update($me.circlesAddress);
    })();
  }
}