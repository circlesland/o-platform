<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import ListViewCard from "../atoms/ListViewCard.svelte";
import { onMount } from "svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Subscription } from "rxjs";

import { push } from "svelte-spa-router";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import { Offer } from "../../../shared/api/data/types";

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

type OffersByCategory = {
  [category: string]: Offer[];
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

onMount(() => {
  store = storeOffers.getOffersFor(storeCirclesAddress);
  isLoading = true;
  return store.subscribe((data: any) => {
    offers = data;

    offersByCategory = offers.reduce((p, c) => {
      const cat =
        c.tags?.filter((o) => o.typeId == "o-marketplace:offer:category:1") ??
        [];
      if (cat.length == 0) {
        if (p[""]) p[""].push(c);
        else p[""] = [c];
      } else {
        if (p[cat[0].value]) p[cat[0].value].push(c);
        else p[cat[0].value] = [c];
      }
      return p;
    }, offersByCategory);

    isLoading = false;
  });
});
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="mb-20 -mt-3 ">
  <!-- <div class="flex flex-wrap items-stretch space-x-4 space-y-8"> -->
  <section
    class="flex items-start px-4 mx-auto mb-4 md:w-2/3 xl:w-1/2 rounded-xl">
    <div class="flex flex-col w-full">
      <header class="rounded-xl">
        <div class="relative overflow-hidden bg-white rounded-xl image-wrapper">
          <img
            src="/images/market/uttingsm.jpg"
            alt="
                "
            class="w-full rounded-xl opacity-60 object-position: center center;  " />
          <div
            class="absolute right-0 pt-1 pb-1 pl-4 pr-2 mt-2 text-xl rounded-l-full sm:pb-2 sm:pt-3 sm:text-3xl font-heading top-2 bg-light-lightest">
            <span class="inline-block">Alte Utting</span>
          </div>
        </div>
      </header>
    </div>
  </section>
  <div class="flex flex-col mb-20 space-y-4 gap-x-4 sm:grid-cols-2 ">
    <!--
    <List
      listItemType="{Offer}"
      listItemComponent="{ListViewCard}"
      fetchQuery="{OffersDocument}"
      fetchQueryArguments="{listArguments}"
      dataKey="offers"
      dataLimit="{100}" />-->
    {#if offersByCategory}
      <div class="flex flex-col space-y-4">
        {#each Object.keys(offersByCategory).sort() as category, i}
          <div class="pt-4 pb-10" class:bg-gray-300="{i % 2 == 1}">
            <div class="mx-auto space-y-4 xl:w-1/2 md:w-2/3">
              <h1 class="px-4 mb-2 ml-2 ">{category}</h1>
              <div class="flex flex-col px-4 space-y-4">
                {#each offersByCategory[category].sort(compare) as offer}
                  <ListViewCard param="{offer}" />
                {/each}
              </div>
            </div>
          </div>
        {/each}
        <div class="p-6 text-center text-2xs">
          Informationen über Zusatzstoffe und Allergene können auf der Physische
          Karte der Alten Utting eingesehen werden.
        </div>
      </div>
    {/if}
  </div>
</div>
