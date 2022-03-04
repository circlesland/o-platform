import { writable } from "svelte/store";
import {
  EventType,
  PaginationArgs, Profile,
  ProfileEvent,
  QueryEventsArgs,
  SortOrder,
  StreamDocument,
} from "../api/data/types";
import { me } from "./me";

let order: SortOrder = SortOrder.Desc;
let dataKey: string = "events";
let limit: number = 25;
let selector = "timestamp";
let fetchQuery: any = StreamDocument;
let eventsByContactAddress: { [hash: string]: ProfileEvent } = {};
let hasMore: boolean = true;
let pagination: PaginationArgs = {
  order: order,
  limit: limit,
  continueAt: new Date().toJSON(),
};
const transactionEventTypes = [
  EventType.NewUser
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

  let newBatch = timeline.data[dataKey];
  if (newBatch.length > 0) {
    newBatch.forEach((e) => (eventsByContactAddress[e.contact_address] = e));

    pagination = {
      order: order,
      continueAt: newBatch[newBatch.length - 1][selector],
      limit: limit,
    };
  } else {
    hasMore = false;
  }
}

async function loadEvents() {
  let $me:Profile;
  me.subscribe(m => $me = m)();
  const args = {
    safeAddress: $me.circlesAddress,
    types: transactionEventTypes,
    pagination: pagination,
    filter: undefined,
  };

  await fetchData(args);

  return Object.values(eventsByContactAddress).sort((a, b) =>
    a.block_number > b.block_number
      ? -1
      : a.block_number < b.block_number
      ? 1
      : 0
  );
}


const { subscribe, set } = writable<ProfileEvent[]>(
  [],
);

export const newUsers = {
  subscribe: (a) => {
    console.log("Subscribing to newUsers");
    return subscribe(a);
  },
  fetchMore: async () => {
    let safeAddress: string | null = null;
    me.subscribe(($me) => (safeAddress = $me.circlesAddress))();

    const events = await loadEvents();
    set(events);

    return hasMore;
  }
};
