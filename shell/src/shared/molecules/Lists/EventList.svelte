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
let initialScrollToBottom: boolean = false;
let lastElement: HTMLElement;

onMount(() => {
  isLoading = true;
  return store.subscribe((data) => {
    if (reverse) {
      events = data.map(o => o).reverse();
    } else {
      events = data;
    }
    isLoading = false;
  });
});

let lastBottomPosition = 0;

const handleChange = async (e) => {
  // This function will be called at least once directly after the page loaded.
  // After that it will be called whenever the marker-element scrolls into view again.
  if (e.detail.inView && hasMore) {
    if (!initialScrollToBottom && events.length > 0 && reverse) {
      // store is initialized but list is not
      setTimeout(() => {
        scrollToBottom();
        lastBottomPosition = lastElement.offsetTop;
      });
      initialScrollToBottom = true;
    } else {
      // store and list were already initialized before
      hasMore = await store.next();
      const scrollPosition = lastElement.offsetTop - lastBottomPosition;

      if (reverse) {
        setTimeout(() => {
          scrollToPosition(scrollPosition);
        });
      }
      lastBottomPosition = lastElement.offsetTop;
    }
    if (!initialScrollToBottom && reverse) {
      // list wasn't initialized before
      setTimeout(() => {
        scrollToBottom()
        lastBottomPosition = lastElement.offsetTop;
      });
      initialScrollToBottom = true;
    }
  }
};

</script>

{#if store && reverse}
  <div use:inview="{{}}" on:change="{handleChange}"></div>
{/if}
{#if store}
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
