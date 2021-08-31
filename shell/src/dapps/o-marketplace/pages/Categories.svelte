<script lang="ts">
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
  import { TagsDocument } from "../data/api/types";
  import { onMount } from "svelte";
  import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
  import { Subscription } from "rxjs";
  import { push } from "svelte-spa-router";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import ItemCard from "../../../shared/atoms/ItemCard.svelte";
  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

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

  function loadCategoryPage(category: any) {
    push("#/marketplace/categories/" + category.id + "/" + category.value);
  }
</script>

<SimpleHeader {runtimeDapp} {routable} />

<div class="px-4 mx-auto -mt-3 lg:w-2/3 xl:w-1/2">
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
    {#each categories as category}
      <div on:click="{() => loadCategoryPage(category)}">
        <ItemCard
          params="{{ edgeless: false, imageUrl: `/images/market/circles-no-image.jpg`, title: category.value }}">

          <div
            slot="itemCardText"
            class="relative flex-grow h-8 px-3 py-1 text-left title">
            <div class="absolute w-full h-4">
              <h2 class="text-base">{category.value}</h2>
            </div>

          </div>
          <div slot="itemCardEnd"></div>
        </ItemCard>
      </div>
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
