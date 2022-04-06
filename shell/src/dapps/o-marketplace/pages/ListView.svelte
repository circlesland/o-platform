<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import ListViewCard from "../atoms/ListViewCard.svelte";
import { onMount } from "svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Subscription } from "rxjs";

import { push } from "svelte-spa-router";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import { Offer, Organisation, Profile } from "../../../shared/api/data/types";

import { storeOffers } from "../../../shared/stores/storeOffers";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let storeCirclesAddress: string;

const listArguments = {};

let isLoading: boolean;
let error: Error;
let citites: {
  [name: string]: Offer[];
} = {};
let categories: string[] = [];
let shellEventSubscription: Subscription;
let offers: Offer[] = [];
let store: any;
let orga: Organisation | Profile;
const sortedOffersByCategory = {};

type OffersByCategory = {
  [category: string]: { order: Number; offers: Offer[] };
};

let offersByCategory: OffersByCategory = {};

function compare(a, b) {
  if (a.createdAt < b.createdAt) {
    return -1;
  }
  if (a.createdAt > b.createdAt) {
    return 1;
  }
  return 0;
}

function sortOrder(a, b) {
  if (a[1].order < b[1].order) {
    return -1;
  }
  if (a[1].order > b[1].order) {
    return 1;
  }
  return 0;
}

onMount(() => {
  store = storeOffers.getOffersFor(storeCirclesAddress);
  isLoading = true;

  return store.subscribe((data: any) => {
    offersByCategory = {}; // If i don't do this here, we sometimes get the offers twice...
    offers = data;

    offers.forEach((offer) => {
      if (offer.tags[0]) {
        let setOffers = [];
        if (offersByCategory[offer.tags[0].value]) {
          setOffers = offersByCategory[offer.tags[0].value].offers;
        }
        setOffers.push(offer);

        offersByCategory[offer.tags[0].value] = { order: offer.tags[0].order, offers: setOffers };
      }
    });

    Object.entries(offersByCategory)
      .sort(sortOrder)
      .forEach((i) => {
        const entry = i[1];
        sortedOffersByCategory[i[0]] = entry;
      });

    isLoading = false;
  });
});
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="mb-20 -mt-3 ">
  <!-- <div class="flex flex-wrap items-stretch space-x-4 space-y-8"> -->
  {#if orga}
    <section class="flex items-start px-4 mx-auto mb-4 md:w-2/3 xl:w-1/2 rounded-xl">
      <div class="flex flex-col w-full">
        <header class="rounded-xl">
          <div class="relative overflow-hidden bg-white rounded-xl image-wrapper">
            <img
              src="{orga.smallBannerUrl}"
              alt="{orga.displayName}"
              class="w-full rounded-xl opacity-60 object-position: center center;  " />
            <div
              class="absolute right-0 pt-1 pb-1 pl-4 pr-2 mt-2 text-xl rounded-l-full sm:pb-2 sm:pt-3 sm:text-3xl font-heading top-2 bg-light-lightest">
              <span class="inline-block">{orga.displayName}</span>
            </div>
          </div>
        </header>
      </div>
    </section>
  {/if}
  <div class="flex flex-col mb-20 space-y-4 gap-x-4 sm:grid-cols-2 ">
    {#if sortedOffersByCategory}
      <div class="flex flex-col space-y-4">
        {#each Object.keys(sortedOffersByCategory) as category, i}
          <div class="pt-4 pb-10" class:bg-gray-300="{i % 2 == 1}">
            <div class="mx-auto space-y-4 xl:w-1/2 md:w-2/3">
              <h1 class="px-4 mb-2 ml-2 ">{category}</h1>
              <div class="flex flex-col px-4 space-y-4">
                {#each sortedOffersByCategory[category].offers.sort(compare) as offer}
                  <ListViewCard param="{offer}" />
                {/each}
              </div>
            </div>
          </div>
        {/each}
        {#if orga}
          <div class="p-6 text-center text-2xs">
            Informationen über Zusatzstoffe und Allergene können auf der Physische Karte der {orga.displayName} eingesehen
            werden.
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
