<script lang="ts">
  import MarketplaceHeader from "../atoms/MarketplaceHeader.svelte";
  import { Offer, OffersDocument } from "../data/api/types";
  import OfferCard from "../atoms/OfferCard.svelte";
  import { onMount } from "svelte";
  import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
  import { Subscription } from "rxjs";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";

  export let runtimeDapp:RuntimeDapp<any>;
  export let routable:Routable;
  export let params: {
    category: number;
    categoryName: string;
  };

  let isLoading: boolean;
  let error: Error;
  let offers: Offer[] = [];
  let shellEventSubscription: Subscription;

  async function load() {
    if (isLoading || !params || !params.category) return;

    isLoading = true;
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const result = await apiClient.query({
      query: OffersDocument,
      variables: {
        categoryTagId: parseInt(params.category.toString()),
      },
    });
    if (result.errors && result.errors.length) {
      error = new Error(
        `An error occurred while the offer was loaded: ${JSON.stringify(
          result.errors
        )}`
      );
      throw error;
    }
    isLoading = false;
    offers = result.data.offers;
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
</script>

<MarketplaceHeader  {runtimeDapp} {routable} header={params.categoryName} />

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
  {:else if offers.length}
    <div
      class="grid grid-cols-1 gap-x-4 gap-y-8 auto-rows-fr sm:grid-cols-2 marketplace-grid svelte-hq9rde"
    >
      {#each offers as offer}
        <OfferCard {offer} />
      {/each}
    </div>
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
