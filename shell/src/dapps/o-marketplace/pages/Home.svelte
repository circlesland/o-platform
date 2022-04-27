<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import OfferCard from "../atoms/OfferCard.svelte";
import { onMount } from "svelte";
import { Subscription } from "rxjs";

import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import { offers } from "../../../shared/stores/offers";

import {
  Offer,
  Shop,
  ShopDocument, ShopQueryVariables,
} from "../../../shared/api/data/types";

import {ApiClient} from "../../../shared/apiConnection";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let storeId:number;

let shop: Shop|null = null;
let offers: Offer[] = [];
let shellEventSubscription: Subscription;

onMount(async () => {
  shop = await ApiClient.query<Shop, ShopQueryVariables>(
          ShopDocument,
          {
            id: parseInt(storeId.toString())
          }
  );
  if (!shop || !shop.categories) {
    return;
  }
  offers = shop.categories.flatMap(o => o.entries.flatMap(o => o.product));
});
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto -mt-3 lg:w-4/5 ">
  <section class="flex items-start mb-4 cursor-pointer rounded-xl">
    <div class="flex flex-col w-full">
      <header class=" rounded-xl">
        <div class="relative overflow-hidden bg-white rounded-xl image-wrapper">
          <img
            src="/images/market/circlesShopsm.jpg"
            alt="
                "
            class="w-full rounded-xl opacity-60 object-position: center center;  " />
          <div
            class="absolute right-0 pt-1 pb-1 pl-4 pr-2 mt-2 text-xl rounded-l-full sm:pb-2 sm:pt-3 sm:text-3xl font-heading top-2 bg-light-lightest">
            <span class="inline-block">CIRCLES.LAND SHOP</span>
          </div>
        </div>
      </header>
    </div>
  </section>
  <!-- <div class="flex flex-wrap items-stretch space-x-4 space-y-8"> -->
  <div
    class="grid grid-cols-1 mb-20 gap-x-4 gap-y-8 auto-rows-fr sm:grid-cols-2 marketplace-grid">
    <!--
    <List
      listItemType="{Offer}"
      listItemComponent="{OfferCard}"
      fetchQuery="{OffersDocument}"
      fetchQueryArguments="{listArguments}"
      dataKey="offers"
      dataLimit="{100}" />-->
    {#if offers && offers.length}
      {#each offers as offer}
        <OfferCard param="{offer}" />
      {/each}
    {:else}
      No offers
    {/if}
  </div>
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

@media (min-width: 1300px) {
  .marketplace-grid {
    grid-template-columns: repeat(3, minmax(8rem, 1fr));
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

:global(.marketplace-grid > *:first-child) {
  grid-row: 1 / 1;
  grid-column: 1 / 1;
}
</style>
