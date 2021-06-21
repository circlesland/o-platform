<script lang="ts">
  import MarketplaceHeader from "../atoms/MarketplaceHeader.svelte";
  import { Offer, OffersDocument } from "../data/api/types";
  import OfferCard from "../atoms/OfferCard.svelte";
  import { onMount } from "svelte";
  import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
  import { Subscription } from "rxjs";

  let isLoading: boolean;
  let error: Error;
  let citites: {
    [name: string]: Offer[];
  } = {};
  let shellEventSubscription: Subscription;

  async function load() {
    if (isLoading) return;

    isLoading = true;
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const result = await apiClient.query({
      query: OffersDocument,
      variables: {},
    });
    if (result.errors && result.errors.length) {
      error = new Error(
        `An error occurred while the offer was loaded: ${JSON.stringify(
          result.errors
        )}`
      );
      throw error;
    }
    citites = result.data.offers.reduce((p, c) => {
      if (!p[c.city.name]) {
        p[c.city.name] = [];
      }
      p[c.city.name].push(c);
      return p;
    }, {});
    isLoading = false;
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
  {:else if Object.keys(citites).length}
    <section class="flex items-center justify-center mb-1 ">
      <div
        class="flex flex-col w-full p-4 space-y-2 bg-white rounded-sm shadow"
      >
        <div class="text-xs font-bold text-left  ">Offers</div>
      </div>
    </section>
    {#each Object.keys(citites) as city}
      <section class="flex items-center justify-center mb-1 ">
        <div
          class="flex flex-col w-full p-4 space-y-2 bg-white rounded-sm shadow"
        >
          <div class="text-xs font-bold text-left  ">
            {city}
          </div>
        </div>
      </section>
      {#each citites[city] as offer}
        <OfferCard {offer} />
      {/each}
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
