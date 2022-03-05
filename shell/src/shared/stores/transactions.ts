import { writable } from "svelte/store";
import {
  EventType,
  PaginationArgs,
  ProfileEvent,
  ProfileEventFilter,
  QueryEventsArgs,
  SortOrder,
  StreamDocument,
} from "../api/data/types";
import { me } from "./me";
import { Subscription } from "rxjs";
import { ApiClient } from "../apiConnection";
//

let order: SortOrder = SortOrder.Desc;
let dataKey: string = "events";
let limit: number = 25;
let selector = "timestamp";
let fetchQuery: any = StreamDocument;
let eventsByHash: { [hash: string]: ProfileEvent } = {};
let hasMore: boolean = true;
let pagination: PaginationArgs = {
  order: order,
  limit: limit,
  continueAt: new Date().toJSON(),
};
const transactionEventTypes = [
  EventType.CrcHubTransfer,
  EventType.CrcMinting,
  EventType.Erc20Transfer,
];

async function fetchData(queryArguments: QueryEventsArgs) {
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const timeline: any = await apiClient.query({
    query: fetchQuery,
    variables: {
      ...queryArguments,
    },
  });

  if (timeline.errors) {
    throw new Error(window.i18n("shared.stores.transactions.errors.couldNotLoadData", { values: { error: JSON.stringify(timeline.errors)}}));
  }

  let newBatch = await timeline.data[dataKey];
  if (newBatch.length > 0) {
    newBatch.forEach((e) => {
      eventsByHash[e.transaction_hash] = e;
    });

    pagination = {
      order: order,
      continueAt: newBatch[newBatch.length - 1][selector],
      limit: limit,
    };
  } else {
    hasMore = false;
  }
}

async function loadTransactions(safeAddress: string) {
  const args = {
    safeAddress: safeAddress,
    types: transactionEventTypes,
    pagination: pagination,
    filter: undefined,
  };

  await fetchData(args);

  return Object.values(eventsByHash).sort((a, b) =>
    a.block_number > b.block_number
      ? -1
      : a.block_number < b.block_number
      ? 1
      : 0
  );
}

async function updateTransactions(safeAddress: string) {
  const args = {
    safeAddress: safeAddress,
    types: transactionEventTypes,
    pagination: {
      order: order,
      limit: limit,
      continueAt: new Date().toJSON(),
    },
    filter: undefined,
  };

  await fetchData(args);

  return Object.values(eventsByHash).sort((a, b) =>
    a.block_number > b.block_number
      ? -1
      : a.block_number < b.block_number
      ? 1
      : 0
  );
}

let isInitialized = false;

const { subscribe, set, update } = writable<ProfileEvent[]>(
  [],
  function start(set) {
    // Subscribe to $me and reload the store when the profile changes
    async function _update(safeAddress: string) {
      const events = await updateTransactions(safeAddress);
      // set(events);
      update((currentTransactions: ProfileEvent[]) => {
        const existingHashes = currentTransactions.reduce((p, c) => {
          p[c.transaction_hash] = true;
          return p;
        }, <{ [hash: string]: any }>{});
        const newEvents = events.filter(
          (o) => !existingHashes[o.transaction_hash]
        );
        newEvents.forEach((e) => currentTransactions.unshift(e));

        return currentTransactions.sort((a, b) =>
          a.block_number > b.block_number
            ? -1
            : a.block_number < b.block_number
            ? 1
            : 0
        );
      });
    }
    async function initialize(safeAddress: string) {
      const events = await loadTransactions(safeAddress);
      set(events);
      isInitialized = true;
    }

    let shellEventSubscription: Subscription;

    const profileSubscription = me.subscribe(async ($me) => {
      if (shellEventSubscription) {
        shellEventSubscription.unsubscribe();
        shellEventSubscription = null;
      }

      if (!$me?.circlesAddress) {
        console.log(`transactions: Not loaded. No safe address on profile.`);
        set([]);
        return;
      }
      console.log(`transactions: Initialize for ${$me.circlesAddress} ..`);
      if (!isInitialized) {
        await initialize($me.circlesAddress);
      }
      shellEventSubscription = window.o.events.subscribe(async (event) => {
        if (event.type == "blockchain_event") {
          console.log(`transactions: Updating because of blockchain event ..`);
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
  }
);

export const transactions = {
  subscribe: (a) => {
    console.log("Subscribing to transactions");
    return subscribe(a);
  },
  fetchMore: async () => {
    let safeAddress: string | null = null;
    const unsub = me.subscribe(($me) => (safeAddress = $me.circlesAddress));
    unsub();
    const events = await loadTransactions(safeAddress);
    set(events);
    return hasMore;
  },
  findByHash: async (transactionHash: string) => {
    let foundTx = eventsByHash[transactionHash];
    if (!foundTx) {
      let safeAddress: string;
      me.subscribe(($me) => (safeAddress = $me.circlesAddress))();

      const foundEvents = await ApiClient.query<
        ProfileEvent[],
        QueryEventsArgs
      >(fetchQuery, {
        safeAddress: safeAddress,
        types: transactionEventTypes,
        pagination: {
          order: order,
          limit: limit,
          continueAt: new Date().toJSON(),
        },
        filter: <ProfileEventFilter>{
          transactionHash: transactionHash,
        },
      });

      if (foundEvents && foundEvents.length > 0) {
        foundTx = foundEvents[0];
        eventsByHash[foundTx.transaction_hash] = foundTx;
      }
    }

    return foundTx;
  },
};
