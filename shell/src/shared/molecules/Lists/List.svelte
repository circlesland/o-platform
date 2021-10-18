<script lang="ts">
import { me } from "../../../shared/stores/me";

import { onMount } from "svelte";
import {
  ProfileEvent,
  TransactionTimelineDocument,
} from "../../../shared/api/data/types";

import { inview } from "svelte-inview/dist/index";

export let listItemComponent;
export let listItemType;
export let fetchQuery: any;
export let fetchQueryArguments;
export let dataKey: string;

let fromTimestamp: string = undefined;
let posts: typeof listItemType[] = [];
let hasMore: boolean = true;
let error: string;
let scrollContent;
const fetchData = async (timeStamp) => {
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const timeline = await apiClient.query({
    query: fetchQuery,
    variables: { ...fetchQueryArguments, fromTimestamp: timeStamp },
  });
  if (timeline.errors) {
    error = `Couldn't load data for the following reasons: ${JSON.stringify(
      timeline.errors
    )}`;
  }

  let newBatch = await timeline.data[dataKey];
  console.log("BATCH: ", newBatch);
  if (newBatch.length > 0) {
    posts = [...posts, ...newBatch];
    console.log("DUDE: ", newBatch.at(-1).timestamp);
    fromTimestamp = newBatch.at(-1).timestamp;
  } else {
    hasMore = false;
  }
};

const handleChange = (e) => {
  if (e.detail.inView && hasMore) fetchData(fromTimestamp);
};
onMount(async () => {
  fetchData(fromTimestamp);
});

const initBar = (bar) => {
  scrollContent = bar;
};
</script>

{#if posts}
  {#each posts as post}
    <svelte:component this="{listItemComponent}" param="{post}" />
  {:else}
    <section class="flex items-center justify-center mb-6 ">
      <div
        class="flex items-center w-full p-4 space-x-2 bg-white rounded-lg shadow">
        <div class="flex flex-col items-start text-center">
          <div>Loading...</div>
        </div>
      </div>
    </section>
  {/each}
{/if}

<div use:inview="{{}}" on:change="{handleChange}"></div>
