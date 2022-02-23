<script lang="ts">
import { onMount } from "svelte";
import { ProfileEvent } from "../../api/data/types";

import { inview } from "svelte-inview/dist/index";
import GenericEventCard from "../../NotificationViewer/molecules/GenericEventCard.svelte";
import {Readable} from "svelte/store";
import { _ } from "svelte-i18n";

export let views: { [type: string]: any } = {};
export let store: Readable<ProfileEvent[]> & {
  fetchMore: () => Promise<boolean>;
};

$: {
  store = store;
}

let isLoading = true;
let hasMore = true;
let scrollContent;
let events: ProfileEvent[] = [];

onMount(() => {
  isLoading = true;
  return store.subscribe((data) => {
    events = data;
    isLoading = false;
  });
});

const handleChange = async (e) => {
  if (e.detail.inView && hasMore) {
    hasMore = await store.fetchMore();
  }
};

const initBar = (bar) => {
  scrollContent = bar;
};
</script>

{#if store}
  {#each events as event}
    {#if views[event.type]}
      <svelte:component this="{views[event.type]}" event="{event}" />
    {:else}
      <GenericEventCard event="{event}" />
    {/if}
  {/each}
{:else}
  <section class="flex items-center justify-center mb-2 ">
    <div
      class="flex items-center w-full p-4 space-x-2 bg-white rounded-lg shadow">
      <div class="flex flex-col items-start text-center">
        <div>{$_("shared.molecules.lists.eventList.loading")}</div>
      </div>
    </div>
  </section>
{/if}
{#if store}
  <div use:inview="{{}}" on:change="{handleChange}"></div>
{/if}
