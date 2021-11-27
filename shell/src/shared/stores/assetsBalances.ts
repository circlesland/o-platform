import {readable} from "svelte/store";
import {AggregatesDocument, AggregateType, AssetBalance, Erc20Balances, ProfileAggregate} from "../api/data/types";
import {me} from "./me";
import {Subscription} from "rxjs";

async function loadBalances(safeAddress: string) {
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const balancesResult = await apiClient.query({
    query: AggregatesDocument,
    variables: {
      types: [AggregateType.CrcBalances, AggregateType.Erc20Balances],
      safeAddress: safeAddress
    },
  });

  if (balancesResult.errors?.length > 0) {
    throw new Error(`Couldn't read the balance of safe ${safeAddress}`);
  }

  const crcBalances: ProfileAggregate = balancesResult.data.aggregates.find(o => o.type == "CrcBalances");
  if (!crcBalances || crcBalances.payload.__typename !== "CrcBalances") {
    throw new Error(`Couldn't find the CrcBalances in the query result.`)
  }

  let erc20Balances: ProfileAggregate = balancesResult.data.aggregates.find(o => o.type == "Erc20Balances");
  if (!erc20Balances  || erc20Balances.payload.__typename !== "Erc20Balances") {
    erc20Balances = {
      type: "Erc20Balances",
      safe_address: safeAddress,
      payload: <Erc20Balances>{
        __typename: "Erc20Balances",
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

export const assetsBalances = readable<{
  crcBalances: AssetBalance[],
  erc20Balances: AssetBalance[]
}>({
  crcBalances: [],
  erc20Balances: []
}, function start(set) {
  // Subscribe to $me and reload the store when the profile changes
  async function update(safeAddress:string) {
    const balances = await loadBalances(safeAddress);
    set({
      crcBalances: balances.crcBalances,
      erc20Balances: balances.erc20Balances
    });
  }

  let shellEventSubscription: Subscription;

  const profileSubscription = me.subscribe(async $me => {
    if (shellEventSubscription) {
      shellEventSubscription.unsubscribe();
      shellEventSubscription = null;
    }

    if (!$me.circlesAddress) {
      console.log(`assetBalances: Not loaded. No safe address on profile.`);
      set({
        erc20Balances: [],
        crcBalances: []
      });
      return;
    }
    console.log(`assetBalances: Updating for ${$me.circlesAddress} ..`);
    await update($me.circlesAddress);

    shellEventSubscription = window.o.events.subscribe(async event => {
      if (event.type == "blockchain_event") {
        console.log(`assetBalances: Updating because of blockchain event ..`);
        await update($me.circlesAddress);
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