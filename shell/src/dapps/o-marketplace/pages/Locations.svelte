<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import { push } from "svelte-spa-router";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { contacts } from "../../../shared/stores/contacts";
import { ApiClient } from "../../../shared/apiConnection";
import { CapabilityType, Organisation, Shop, ShopsDocument, ShopsQueryVariables } from "../../../shared/api/data/types";
import { onMount } from "svelte";
import { trustFromContactMetadata } from "../../../shared/functions/trustFromContactMetadata";
import { inbox } from "../../../shared/stores/inbox";
import { getTrustedByShop } from "../processes/getTrustedByShop";
import { me } from "../../../shared/stores/me";
import { getTrusted } from "../processes/getTrusted";
import ShopMetadata from "../../../shared/molecules/ShopMetadata.svelte";

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
        enabled: isMyShop(o.id) || trustIn > 0,
        productListingType: o.productListingStyle == "LIST" ? "list" : "market",
      };
    })
  );
}

onMount(async () => await load());

async function locationClicked(orga) {
  const alreadyVerified = (await me.getSessionInfo()).capabilities.find(
    (o) => o.type == CapabilityType.VerifiedByHumanode
  );

  if (orga.enabled) {
    loadLocationPage(`${orga.productListingType}/${orga.shopId}`);
  } else if (!alreadyVerified) {
    await window.o.runProcess(getTrustedByShop, {}, {});
  } else {
    await window.o.runProcess(getTrusted, {}, {});
  }
}

function isMyShop(shopId) {
  if ($me.shops && $me.shops.find((o) => o.id == shopId)) {
    return true;
  }
  return false;
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="mx-auto md:w-2/3 xl:w-1/2">
  <div class="flex flex-col pb-20 space-y-10">
    <section class="m-4 -mb-4 text-center">
      <h1>Welcome to the Market</h1>
      <span>Please choose your location</span>
    </section>

    {#each orgas as orga}
      {#if !orga.shop.private || isMyShop(orga.shop.id)}
        <section
          class="flex items-start m-4 rounded-xl"
          class:cursor-pointer="{orga.shop.enabled}"
          on:click="{() => locationClicked(orga)}">
          <div class="flex flex-col w-full ">
            <header class=" rounded-xl headerImageContainer">
              <div class="relative rounded-xl image-wrapper">
                <img src="{orga.shop.largeBannerUrl}" alt="" class="w-full rounded-xl" />
                <div
                  class="absolute right-0 py-2 pt-3 pl-4 pr-2 mt-2 text-3xl rounded-l-full font-heading top-2 bg-light-lightest">
                  <span class="inline-block">{orga.shop.name}</span>
                </div>
                <div
                  class="absolute right-0 py-2 pl-4 pr-1 mt-2 text-xs rounded-l-full cursor-pointer bottom-4 bg-alert-lightest has-tooltip"
                  class:hidden="{orga.shop.enabled}">
                  <span class="px-2 mt-12 text-sm bg-white rounded shadow-sm right-20 tooltip bottom-10">
                    <!--Find one of our friendly circlesland people to trust you for
                  this shop.-->
                  </span>
                  You need to get trusted by this shop.
                </div>
              </div>
            </header>
          </div>
        </section>
      {/if}
    {/each}
  </div>
</div>
