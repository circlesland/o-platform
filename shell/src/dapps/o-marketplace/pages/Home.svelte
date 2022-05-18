<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import OfferCard from "../atoms/OfferCard.svelte";
import { onMount } from "svelte";
import { Subscription } from "rxjs";

import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import { Shop, ShopCategoryEntry, ShopDocument, ShopQueryVariables } from "../../../shared/api/data/types";

import { ApiClient } from "../../../shared/apiConnection";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let shopId: number;

let shop: Shop | null = null;
let categoryEntries: ShopCategoryEntry[] = [];
let shellEventSubscription: Subscription;
let loading = true;

onMount(async () => {
  shop = await ApiClient.query<Shop, ShopQueryVariables>(ShopDocument, {
    id: parseInt(shopId.toString()),
  });
  if (!shop || !shop.categories) {
    loading = false;
    return;
  }
  categoryEntries = shop.categories.flatMap((o) => o.entries);
  loading = false;
});
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto -mt-3 lg:w-4/5 ">
  <section class="flex items-start mb-4 cursor-pointer rounded-xl">
    <div class="flex flex-col w-full">
      <header class=" rounded-xl">
        <div class="relative overflow-hidden bg-white rounded-xl image-wrapper">
          <img
            src="{shop ? shop.smallBannerUrl : ''}"
            alt="{shop ? shop.name : ''}"
            class="w-full rounded-xl opacity-60 object-position: center center;  " />
          <div
            class="absolute right-0 pt-1 pb-1 pl-4 pr-2 mt-2 text-xl rounded-l-full sm:pb-2 sm:pt-3 sm:text-3xl font-heading top-2 bg-light-lightest">
            <span class="inline-block">{shop ? shop.name : ""}</span>
          </div>
        </div>
      </header>
    </div>
  </section>
  <div class="grid grid-cols-1 mb-10 gap-x-4 gap-y-8 auto-rows-fr sm:grid-cols-2 marketplace-grid">
    {#if categoryEntries && categoryEntries.length}
      {#each categoryEntries as categoryEntry}
        <OfferCard entry="{categoryEntry}" shopId="{shopId}" deliveryMethods="{shop.deliveryMethods}" />
      {/each}
    {:else if !loading}
      No offers
    {/if}
  </div>
  {#if shop}
    <div class="mb-20 text-center text-2xs">
      <h4 class="mb-2">{shop.name}</h4>
      <div class="flex flex-row justify-center space-x-4">
        {#if shop.privacyPolicyLink}
          <a href="{shop.privacyPolicyLink}" target="_blank" class="link link-primary" alt="Privacy Policy"
            >Privacy Policy</a>
        {/if}
        {#if shop.tosLink}
          <a href="{shop.tosLink}" target="_blank" class="link link-primary" alt="Terms of Service">Terms of Service</a>
        {/if}

        {#if shop.healthInfosLink}
          <a href="{shop.healthInfosLink}" target="_blank" class="link link-primary" alt="Health Infos"
            >Health Information</a>
        {/if}
      </div>
    </div>
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
