<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import ListViewCard from "../atoms/ListViewCard.svelte";
import { onMount } from "svelte";
import { Subscription } from "rxjs";

import { push } from "svelte-spa-router";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import { Shop, ShopCategory, ShopDocument, ShopQueryVariables } from "../../../shared/api/data/types";

import { ApiClient } from "../../../shared/apiConnection";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let storeId: number;

let shop: Shop | null = null;
let categories: ShopCategory[] = [];
let shellEventSubscription: Subscription;

onMount(async () => {
  shop = await ApiClient.query<Shop, ShopQueryVariables>(ShopDocument, {
    id: parseInt(storeId.toString()),
  });

  if (!shop) {
    await push("/not-found");
    return;
  }

  categories = shop.categories;
  console.log("CATEGORIES", categories);
});
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="mb-20 -mt-3 ">
  <!-- <div class="flex flex-wrap items-stretch space-x-4 space-y-8"> -->
  {#if shop}
    <section class="flex items-start px-4 mx-auto mb-4 md:w-2/3 xl:w-1/2 rounded-xl">
      <div class="flex flex-col w-full">
        <header class="rounded-xl">
          <div class="relative overflow-hidden bg-white rounded-xl image-wrapper">
            <img
              src="{shop.smallBannerUrl}"
              alt="{shop.name}"
              class="w-full rounded-xl opacity-60 object-position: center center;  " />
            <div
              class="absolute right-0 pt-1 pb-1 pl-4 pr-2 mt-2 text-xl rounded-l-full sm:pb-2 sm:pt-3 sm:text-3xl font-heading top-2 bg-light-lightest">
              <span class="inline-block">{shop.name}</span>
            </div>
          </div>
        </header>
      </div>
    </section>
  {/if}
  <div class="flex flex-col mb-20 space-y-4 gap-x-4 sm:grid-cols-2 ">
    {#if categories.length > 0}
      <div class="flex flex-col space-y-4">
        {#each categories as category, i}
          {#if category.entries && category.enabled}
            <div class="pt-4 pb-10">
              <div class="mx-auto space-y-4 xl:w-1/2 md:w-2/3">
                {#if category.largeBannerUrl}
                  <div class="relative mx-4 overflow-hidden bg-white rounded-xl image-wrapper">
                    <img
                      src="{category.largeBannerUrl}"
                      alt="{category.name}"
                      class="w-full rounded-xl opacity-60 object-position: center center;  " />
                    <div
                      class="absolute left-0 pt-1 pb-1 pl-2 pr-4 mt-2 text-xl rounded-r-full sm:pb-2 sm:pt-3 sm:text-3xl font-heading bottom-4 bg-light-lightest">
                      <span class="inline-block">{category.name}</span>
                    </div>
                  </div>
                {:else}
                  <h1 class="px-4 mb-2 ml-2 ">{category.name}</h1>
                {/if}
                <div class="flex flex-col px-4 space-y-4">
                  {#each category.entries.map((o) => o.product) as offer}
                    <ListViewCard param="{offer}" storeId="{storeId}" />
                  {/each}
                </div>
              </div>
            </div>
          {/if}
        {/each}
        {#if shop}
          <div class="p-6 text-center text-2xs">
            Informationen über Zusatzstoffe und Allergene können auf der Physische Karte der {shop.name} eingesehen werden.
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
