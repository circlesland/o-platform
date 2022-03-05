<script lang="ts">
import { onMount } from "svelte";
import { ProfileEvent } from "../../api/data/types";

import { inview } from "svelte-inview/dist/index";
import GenericEventCard from "../../NotificationViewer/molecules/GenericEventCard.svelte";
import {scrollToTop, scrollToBottom, scrollToPosition} from "../../layouts/Center.svelte";
import {Readable} from "svelte/store";
import { _ } from "svelte-i18n";

export let views: { [type: string]: any } = {};
export let reverse: boolean = false;
export let store: Readable<ProfileEvent[]> & {
  next: () => Promise<boolean>;
};

let isLoading = true;
let hasMore = true;
let events: ProfileEvent[] = [];
let isInitialized: boolean = false;

onMount(() => {
  isLoading = true;
  return store.subscribe((data) => {
    if (reverse) {
      events = data.map(o => o).reverse();
    } else {
      events = data;
    }
    console.log("events:", events);
    isLoading = false;
  });
});

let lastBottomPosition = 0;

const handleChange = async (e) => {
  // This function will be called at least once directly after the page loaded.
  // After that it will be called whenever the marker-element scrolls into view again.
  if (e.detail.inView && hasMore) {
    if (!isInitialized && events.length > 0) {
      // When the underlying store is already initialized but the list is not
      setTimeout(() => {
        scrollToBottom();
        lastBottomPosition = lastElement.offsetTop;
      });
      isInitialized = true;
    } else {
      // When the source and list are already initialized
      hasMore = await store.next();
      const scrollPosition = lastBottomPosition > 0
        ? lastElement.offsetTop - lastBottomPosition
        : -1;
      if (reverse && scrollPosition > 0) {
        setTimeout(() => {
          scrollToPosition(scrollPosition);
        });
      }
      lastBottomPosition = lastElement.offsetTop;
    }
    if (!isInitialized && reverse) {
      // `either store nor list are initialized
      setTimeout(() => {
        scrollToBottom()
        lastBottomPosition = lastElement.offsetTop;
      });
      isInitialized = true;
    }
  }
};

let firstElement: HTMLElement;
let lastElement: HTMLElement;
$: {
  console.log("firstElement", firstElement)
  console.log("lastElement", lastElement)
}
</script>

{#if store && reverse}
  <div use:inview="{{}}" on:change="{handleChange}"></div>
{/if}
{#if store}
  <div bind:this={firstElement}></div>
  {#each events as event, i}
    {#if views[event.type]}
      <svelte:component this="{views[event.type]}" event="{event}" />
    {:else}
      <GenericEventCard event="{event}" />
    {/if}
  {/each}
  <div bind:this={lastElement}></div>
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
{#if store && !reverse}
  <div use:inview="{{}}" on:change="{handleChange}"></div>
{/if}
