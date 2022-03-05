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
    if (events && events.length) {
      isInitialized = true;
    }
    if (reverse) {
      events = data.map(o => o).reverse();
    } else {
      events = data;
    }
    isLoading = false;
    if (!isInitialized) {
      if (reverse) {
        setTimeout(() => {
          scrollToBottom()
        });
      } else {
        setTimeout(() => {
          scrollToTop()
        });
      }
    } else {
      if (scrollToAfterLoading) {
        setTimeout(() => {
          const pos = lastElement.offsetTop - lastElementOffsetTop;
          lastElementOffsetTop = lastElement.offsetTop;
          scrollToPosition(pos);
          scrollToAfterLoading = false;
        });
      }
    }
  });
});

let scrollToAfterLoading:boolean = false;

const handleChange = async (e) => {
  if (e.detail.inView && hasMore) {
    scrollToAfterLoading = reverse && isInitialized;
    hasMore = await store.next();
    isInitialized = true;
  }
};

let firstElement: HTMLElement;
let lastElement: HTMLElement;
let lastElementOffsetTop: number = 0;
$: {
  console.log("firstElement", firstElement)
  console.log("lastElement", lastElement)
  if(lastElement) {
    lastElementOffsetTop = lastElement.offsetTop;
  }
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
