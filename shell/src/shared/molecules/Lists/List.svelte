<script lang="ts">
import { onMount } from "svelte";
import { inview } from "svelte-inview/dist/index";
import {_} from "svelte-i18n";
import Label from "../../atoms/Label.svelte";

export let listItemComponent;
export let selector = "timestamp";
export const listItemType: any = undefined;
export let fetchQuery: any;
export let fetchQueryArguments;
export let dataKey: string;
export let sortOrder: "ASC" | "DESC" = "DESC";
export let dataLimit: number = 50;

let posts: typeof listItemType[] = [];
let hasMore: boolean = true;
let error: string;
let scrollContent;
let pagination = undefined;
let initialized = false;

const fetchData = async (paginationArg) => {
  fetchQueryArguments.pagination = paginationArg;
  if (!fetchQueryArguments.pagination) {
    fetchQueryArguments.pagination = {
      order: "DESC",
      limit: dataLimit,
      continueAt: new Date(),
    };
  }

  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const timeline = await apiClient.query({
    query: fetchQuery,
    variables: fetchQueryArguments,
  });
  if (timeline.errors) {
    error = `Couldn't load data for the following reasons: ${JSON.stringify(
      timeline.errors
    )}`;
  }

  let newBatch = await timeline.data[dataKey];

  if (newBatch.length > 0) {
    posts = [...posts, ...newBatch];

    pagination = {
      order: sortOrder,
      // continueAtId: newBatch[newBatch.length - 1][selector],
      continueAt: newBatch[newBatch.length - 1][selector],
      limit: dataLimit,
    };
  } else {
    hasMore = false;
    return;
  }

  initialized = true;
  hasMore = newBatch && newBatch.length == dataLimit;
};

const handleChange = (e) => {
  if (e.detail.inView && hasMore) fetchData(pagination);
};
onMount(async () => {
  fetchData(pagination);
});

const initBar = (bar) => {
  scrollContent = bar;
};
</script>

{#if posts}
  {#each posts as post}
    <svelte:component this="{listItemComponent}" param="{post}" />
  {/each}
{:else}
  <section class="flex items-center justify-center mb-2 ">
    <div
      class="flex items-center w-full p-4 space-x-2 bg-white rounded-lg shadow">
      <div class="flex flex-col items-start text-center">
        <div><Label key="shared.molecules.lists.list.loading"  /></div>
      </div>
    </div>
  </section>
{/if}
{#if initialized}
  <div use:inview="{{}}" on:change="{handleChange}"></div>
{/if}
