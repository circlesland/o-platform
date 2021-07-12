<script lang="ts">
  import MarketplaceHeader from "../atoms/MarketplaceHeader.svelte";
  import { Offer, OffersDocument, TagsDocument } from "../data/api/types";
  import OfferCard from "../atoms/OfferCard.svelte";
  import { onMount } from "svelte";
  import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
  import { Subscription } from "rxjs";
  import { Swiper, SwiperSlide } from "swiper/svelte";
  import { push } from "svelte-spa-router";
  import "swiper/swiper-bundle.min.css";

  import "swiper/components/navigation/navigation.min.css";
  import "swiper/components/pagination/pagination.min.css";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";

  export let runtimeDapp:RuntimeDapp<any>;
  export let routable:Routable;

  let isLoading: boolean;
  let error: Error;
  let offers: Offer[] = [];
  let citites: {
    [name: string]: Offer[];
  } = {};
  let categories: string[] = [];
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
    offers = result.data.offers;

    const categoryResult = await apiClient.query({
      query: TagsDocument,
      variables: {
        typeId_in: ["o-marketplace:offer:category:1"],
      },
    });
    if (categoryResult.errors && categoryResult.errors.length) {
      error = new Error(
        `An error occurred while loading the categories: ${JSON.stringify(
          categoryResult.errors
        )}`
      );
      throw error;
    }
    categories = categoryResult.data.tags;
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

  function loadCategoryPage(category: any) {
    push("#/marketplace/categories/" + category.id + "/" + category.value);
  }
</script>

<MarketplaceHeader  {runtimeDapp} {routable} />

<div class="p-2 bg-light-lightest">
  {#if isLoading}
    <section class="flex items-center justify-center mx-4 mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>Loading offers...</div>
        </div>
      </div>
    </section>
  {:else if error}
    <section class="flex items-center justify-center mx-4 mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>
            <b>An error occurred while loading the recent activities:</b>
          </div>
        </div>
      </div>
    </section>
  {:else if offers.length}
    <!-- <section class="flex items-center justify-center mb-1 ">
      <div
        class="flex flex-col w-full p-4 space-y-2 bg-white rounded-sm shadow"
      >
        <div class="text-xs font-bold text-left ">Offers</div>
      </div>
    </section> -->

    <div class="p-2 mt-4 mb-4">
      <Swiper
        slidesPerView={4.1}
        spaceBetween={10}
        grabCursor={true}
        pagination={{
          clickable: true,
        }}
        on:slideChange={() => console.log("slide change")}
        on:swiper={(e) => console.log(e.detail[0])}
      >
        <!-- {#each Object.keys(citites) as city} -->
        {#each categories as category}
          <SwiperSlide>
            <div
              class="p-2 rounded-full cursor-pointer bg-light-lighter text-2xs"
              on:click={() => loadCategoryPage(category)}
            >
              <!-- {city} -->
              {category.value}
            </div>
          </SwiperSlide>
        {/each}
      </Swiper>
    </div>

    <div
      class="grid grid-cols-1 gap-x-4 gap-y-8 auto-rows-fr sm:grid-cols-2 marketplace-grid svelte-hq9rde"
    >
      {#each offers as offer}
        <OfferCard {offer} />
      {/each}
    </div>

    <!-- {#each Object.keys(citites) as city}
      <section class="flex items-center justify-center mx-4 mb-1 ">
        <div class="flex flex-col w-full p-4 space-y-2 ">
          <div class="text-xs font-bold text-left ">
            {city}
          </div>
        </div>
      </section>

      {#each citites[city] as offer}
        <OfferCard {offer} />
      {/each}
    {/each} -->
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

<style>
  .marketplace-grid {
    grid-template-columns: repeat(1, minmax(8rem, 1fr));
    grid-auto-rows: 1fr;
  }

  @media (min-width: 640px) {
    .marketplace-grid {
      grid-template-columns: repeat(2, minmax(8rem, 1fr));
    }
  }

  .marketplace-grid::before {
    content: "";
    width: 0;
    padding-bottom: 100%;
    grid-row: 1 / 1;
    grid-column: 1 / 1;
    display: none;
  }

  .marketplace-grid > *:first-child {
    grid-row: 1 / 1;
    grid-column: 1 / 1;
  }
</style>
