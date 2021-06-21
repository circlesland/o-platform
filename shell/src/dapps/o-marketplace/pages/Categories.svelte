<script lang="ts">
  import MarketplaceHeader from "../atoms/MarketplaceHeader.svelte";
  import { OfferCategoriesDocument, TagsDocument } from "../data/api/types";
  import { onMount } from "svelte";
  import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
  import { Subscription } from "rxjs";
  import { push } from "svelte-spa-router";

  let isLoading: boolean;
  let error: Error;
  let categories: string[] = [];
  let shellEventSubscription: Subscription;

  async function load() {
    if (isLoading) return;

    isLoading = true;
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const result = await apiClient.query({
      query: TagsDocument,
      variables: {
        typeId_in: ["o-marketplace:offer:category:1"],
      },
    });
    if (result.errors && result.errors.length) {
      error = new Error(
        `An error occurred while loading the categories: ${JSON.stringify(
          result.errors
        )}`
      );
      throw error;
    }
    isLoading = false;
    categories = result.data.tags;
  }

  onMount(async () => {
    await load();

    shellEventSubscription = window.o.events.subscribe(
      async (event: PlatformEvent) => {
        if (
          event.type != "shell.refresh" ||
          (<any>event).dapp != "marketplace:1"
        ) {
          return;
        }
        await load();
      }
    );

    return () => {
      shellEventSubscription.unsubscribe();
    };
  });

  function loadDetailPage(categoryId: string) {
    push("#/marketplace/offers/" + categoryId);
  }

</script>

<MarketplaceHeader />

<div class="mx-4 -mt-6">
  {#if isLoading}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>Loading offers...</div>
        </div>
      </div>
    </section>
  {:else if error}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>
            <b>An error occurred while loading the recent activities:</b>
          </div>
        </div>
      </div>
    </section>
  {:else if categories.length}
    <section class="flex items-center justify-center mb-1 ">
      <div
        class="flex flex-col w-full p-4 space-y-2 bg-white rounded-sm shadow"
      >
        <div class="text-xs font-bold text-left  ">Categories</div>
      </div>
    </section>
    {#each categories as category}
      <section
        class="flex items-center justify-center mb-1 "
        on:click|once={() => loadDetailPage(category.id)}
      >
        <div
          class="flex flex-col w-full p-4 space-y-2 bg-white rounded-sm shadow"
        >
          <div class="text-xs font-bold text-left  ">
            {category.value}
          </div>
        </div>
      </section>
    {/each}
  {:else}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>No offers</div>
        </div>
      </div>
    </section>
  {/if}
</div>
