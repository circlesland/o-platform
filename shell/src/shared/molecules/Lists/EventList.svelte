<script lang="ts">
import { onMount } from "svelte";
import {
  PaginationArgs,
  QueryEventsArgs,
  SortOrder,
  StreamDocument,
} from "../../api/data/types";

import { inview } from "svelte-inview/dist/index";
import GenericEventCard from "../../GenericEventCard.svelte";

export let views: { [type: string]: any } = {};
export let selector = "timestamp";
export let fetchQuery: any = StreamDocument;
export let queryArguments: QueryEventsArgs;
export let order: SortOrder = SortOrder.Desc;
export let dataKey: string = "events";
export let limit: number = 50;

let events: any[] = [];
let hasMore: boolean = true;
let error: string;
let scrollContent;
let pagination: PaginationArgs = {
  order: order,
  limit: limit,
  continueAt: new Date().toJSON(),
};

const fetchData = async (paginationArg: PaginationArgs) => {
  queryArguments.pagination = paginationArg;

  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const timeline: any = await apiClient.query({
    query: fetchQuery,
    variables: queryArguments,
  });
  if (timeline.errors) {
    error = `Couldn't load data for the following reasons: ${JSON.stringify(
      timeline.errors
    )}`;
  }

  let newBatch = await timeline.data[dataKey];

  if (newBatch.length > 0) {
    events = [...events, ...newBatch];

    pagination = {
      order: order,
      continueAt: newBatch[newBatch.length - 1][selector],
      limit: limit,
    };
  } else {
    hasMore = false;
  }
};

const handleChange = async (e) => {
  if (e.detail.inView && hasMore) await fetchData(pagination);
};
onMount(async () => {
  await fetchData(pagination);
});

const initBar = (bar) => {
  scrollContent = bar;
};
</script>

{#if events}
  {#each events as event}
    {#if views[event.type]}
      <svelte:component this="{views[event.type]}" event="{event}" />
    {:else}
      <GenericEventCard eventData="{event}" />
    {/if}
  {/each}
{:else}
  <section class="flex items-center justify-center mb-2 ">
    <div
      class="flex items-center w-full p-4 space-x-2 bg-white rounded-lg shadow">
      <div class="flex flex-col items-start text-center">
        <div>Loading...</div>
      </div>
    </div>
  </section>
{/if}

<div use:inview="{{}}" on:change="{handleChange}"></div>
