<script lang="ts" context="module">
import { SvelteComponentDev } from "svelte/internal";
import { ProfileEvent } from "../../api/data/types";

export type EventListView = {
  component?: SvelteComponentDev;
  function?: (event: ProfileEvent) => SvelteComponentDev | null;
};

export type EventListViewMap = {
  [eventType: string]: EventListView;
};
</script>

<script lang="ts">
import { onMount } from "svelte";

import { inview } from "svelte-inview/dist/index";
import GenericEventCard from "../../NotificationViewer/molecules/GenericEventCard.svelte";
import {
  poppedScrollPosition,
  scrollToTop,
  scrollToBottom,
  scrollToPosition,
  popScrollPosition,
  scrollPositionStackPopulated,
} from "../../layouts/Center.svelte";
import { Readable } from "svelte/store";
import { SvelteComponentDev } from "svelte/internal";
import { _ } from "svelte-i18n";
import Label from "../../atoms/Label.svelte";

export let views: EventListViewMap = {};
export let reverse: boolean = false;
export let store: Readable<ProfileEvent[]> & {
  next: () => Promise<boolean>;
};

let isLoading = true;
let hasMore = true;
let events: ProfileEvent[] = [];
let eventsWithViews: { component: SvelteComponentDev; event: ProfileEvent }[] = [];
let initialScrollToBottom: boolean = false;
let lastElement: HTMLElement;

onMount(() => {
  isLoading = true;
  return store.subscribe((data: any) => {
    events = reverse
      ? data.metadata
        ? data.events.map((o) => o).reverse()
        : data.map((o) => o).reverse()
      : data.metadata
      ? data.events.map((o) => o)
      : data.map((o) => o);

    if (data.metadata?.itemAdded) {
      setTimeout(() => (reverse ? scrollToBottom() : scrollToTop()));
    }

    eventsWithViews = events
      .map((event) => {
        const view: EventListView = views[event.type];
        let viewComponent: SvelteComponentDev;
        if (view.function) {
          viewComponent = view.function(event);
        } else if (view.component) {
          viewComponent = view.component;
        } else {
          viewComponent = GenericEventCard;
        }

        return {
          event: event,
          component: viewComponent,
        };
      })
      .filter((o) => o.component);

    isLoading = !(<any>store)._isInitialized;
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
        if (!poppedScrollPosition) {
          // only scroll to the bottom if the current scroll position
          // is not a custom scroll position from the Center's scrollPositionStack
          scrollToBottom();
        }
        if (lastElement) {
          lastBottomPosition = lastElement.offsetTop;
        }
      });
      initialScrollToBottom = true;
    } else {
      // store and list were already initialized before
      hasMore = await store.next();
      const scrollPosition = (lastElement ? lastElement.offsetTop : 0) - lastBottomPosition;

      if (reverse) {
        setTimeout(() => {
          scrollToPosition(scrollPosition);
        });
      }
      if (lastElement) {
        lastBottomPosition = lastElement.offsetTop;
      }
    }
    if (!initialScrollToBottom && reverse) {
      // list wasn't initialized before
      setTimeout(() => {
        scrollToBottom();
        if (lastElement) {
          lastBottomPosition = lastElement.offsetTop;
        }
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
  {#each eventsWithViews as eventWithView, i}
    <svelte:component this="{eventWithView.component}" event="{eventWithView.event}" />

    {#if store && !reverse && i > events.length - 25}
      <div use:inview="{{}}" on:change="{handleChange}"></div>
    {/if}
  {/each}
  <div bind:this="{lastElement}"></div>
{/if}
{#if isLoading}
  <section class="flex items-center justify-center mb-2 ">
    <div class="flex items-center w-full p-4 space-x-2 bg-white border rounded-xl border-bordergray">
      <div class="flex flex-col items-start text-center">
        <div><Label key="shared.molecules.lists.eventList.loading" /></div>
      </div>
    </div>
  </section>
{/if}
{#if eventsWithViews && eventsWithViews.length === 0 && !isLoading}
  <section class="flex items-center justify-center mb-2 ">
    <div class="flex items-center w-full p-4 space-x-2 bg-white border rounded-xl border-bordergray">
      <div class="flex flex-col items-start text-center">
        <div>No entries</div>
      </div>
    </div>
  </section>
{/if}
