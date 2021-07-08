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

  function loadCategoryPage(categoryId: string) {
    push("#/marketplace/offers/" + categoryId);
  }
</script>

<MarketplaceHeader />

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

    <div class="p-2">
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
              on:click|once={() => loadCategoryPage(category.id)}
            >
              <!-- {city} -->
              {category.value}
            </div>
          </SwiperSlide>
        {/each}
      </Swiper>
    </div>

    {#each offers as offer}
      <OfferCard {offer} />
    {/each}

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
