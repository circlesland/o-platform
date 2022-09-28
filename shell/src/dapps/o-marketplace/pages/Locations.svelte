<script lang="ts">
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import { push } from "svelte-spa-router";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { contacts } from "../../../shared/stores/contacts";
import { ApiClient } from "../../../shared/apiConnection";
import { Organisation, Shop, ShopsDocument, ShopsQueryVariables } from "../../../shared/api/data/types";
import { onMount } from "svelte";
import { trustFromContactMetadata } from "../../../shared/functions/trustFromContactMetadata";
import { inbox } from "../../../shared/stores/inbox";
import { me } from "../../../shared/stores/me";
import MarketplaceHeader from "../atoms/MarketplaceHeader.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

function loadLocationPage(route: string) {
  push(`#/marketplace/${route}`);
}

let orgas: { shopId: number; orga: Organisation; enabled: boolean; productListingType: string }[] = [];

$: {
  if ($inbox.length) {
    load();
  }
}

async function load() {
  const allShops = await ApiClient.query<Shop[], ShopsQueryVariables>(ShopsDocument, {});
  orgas = await Promise.all(
    allShops.map(async (o) => {
      const contact = await contacts.findBySafeAddress(o.owner.circlesAddress);
      const { trustIn, trustOut } = trustFromContactMetadata(contact);
      return {
        shopId: o.id,
        shop: o,
        orga: {
          ...o.owner,
          largeBannerUrl: o.largeBannerUrl,
          smallBannerUrl: o.smallBannerUrl,
        },
        enabled: o.enabled,
        productListingType: o.productListingStyle == "LIST" ? "list" : "market",
      };
    })
  );
}

onMount(async () => await load());

async function locationClicked(orga) {
  loadLocationPage(`${orga.productListingType}/${orga.shopId}`);
}

function isMyShop(shopId) {
  if ($me.shops && $me.shops.find((o) => o.id == shopId)) {
    return true;
  }
  return false;
}
</script>

<MarketplaceHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="mx-auto md:w-2/3 xl:w-1/2">
  <div class="flex flex-col pb-20 space-y-10">
    {#each orgas as orga}
      {#if (orga.shop.enabled && !orga.shop.private) || isMyShop(orga.shop.id)}
        <section
          class="flex items-start m-4 rounded-xl"
          class:cursor-pointer="{orga.shop.enabled}"
          on:click="{() => locationClicked(orga)}">
          <div class="flex flex-col w-full ">
            <header class=" rounded-xl headerImageContainer">
              <div class="relative rounded-xl image-wrapper">
                <img src="{orga.shop.largeBannerUrl}" alt="" class="w-full rounded-xl" />
                <div
                  class="absolute right-0 py-2 pt-3 pl-4 pr-2 mt-2 text-3xl bg-white rounded-l-full font-heading top-2">
                  <span class="inline-block">{orga.shop.name}</span>
                </div>
              </div>
            </header>
          </div>
        </section>
      {/if}
    {/each}
  </div>
</div>
