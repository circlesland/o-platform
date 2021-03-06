<script lang="ts">
import { Offer, Shop, ShopDocument, ShopQueryVariables } from "../../../shared/api/data/types";
import { onMount } from "svelte";
import { Subscription } from "rxjs";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";
import { push } from "svelte-spa-router";
import UserImage from "../../../shared/atoms/UserImage.svelte";
import { _ } from "svelte-i18n";
import { ApiClient } from "../../../shared/apiConnection";
import { cartContents } from "../stores/shoppingCartStore";

let isLoading: boolean;
let error: Error;
let shellEventSubscription: Subscription;

export let shopId: number;
export let entryId: number;

let loading = true;
let shop: Shop;
let offer: Offer;

onMount(async () => {
  isLoading = true;
  shop = await ApiClient.query<Shop, ShopQueryVariables>(ShopDocument, {
    id: parseInt(shopId.toString()),
  });

  if (!shop || !shop.categories) {
    loading = false;
    return;
  }

  if (shop) {
    const products = shop.categories.flatMap((o) =>
      o.entries ? o.entries.filter((q) => q.id == entryId).flatMap((p) => p.product) : null
    );

    if (products.length > 0) {
      offer = products[0];
    }

    loading = false;
  }
});

function addToCart(item: Offer & { shopId: number }) {
  item.shopId = shopId;
  $cartContents = $cartContents ? [...$cartContents, item] : [item];
  push(`#/marketplace/cart`);
}
</script>

<div class="">
  {#if isLoading && !offer}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>{$_("dapps.o-marketplace.pages.offerDetail.loadingOffers")}</div>
        </div>
      </div>
    </section>
  {:else if error}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>
            <b>{$_("dapps.o-marketplace.pages.offerDetail.error")}</b>
          </div>
        </div>
      </div>
    </section>
  {:else if offer}
    <section class="flex items-start rounded-xl">
      <div class="flex flex-col w-full ">
        <header class=" rounded-t-xl headerImageContainer">
          <div class="relative rounded-t-xl image-wrapper">
            <img
              src="{offer.pictureUrl ? offer.pictureUrl : '/images/market/circles-no-image.jpg'}"
              alt="
            "
              class="w-full rounded-t-xl" />
            <div
              class="absolute right-0 py-2 pt-3 pl-4 pr-2 mt-2 text-lg rounded-l-full font-enso top-2 bg-light-lightest">
              <span class="inline-block">{offer.pricePerUnit}</span>
              <span class="inline-block">€</span>
            </div>

            {#if shop && shop.deliveryMethods}
              {#each shop.deliveryMethods as deliveryMethod, i}
                <div
                  class="absolute right-0 py-2 pl-4 pr-1 mt-2 text-xs rounded-l-full bg-alert-lightest"
                  class:top-16="{i == 0}"
                  class:top-28="{i > 0}">
                  {deliveryMethod.name}
                </div>
              {/each}
            {/if}
          </div>
        </header>
        <div
          class="flex flex-row items-center content-start p-4 space-x-4 text-base font-medium text-left bg-light-lighter">
          <div class="inline-flex">
            <UserImage profile="{offer.createdByProfile}" size="{10}" gradientRing="{false}" />
          </div>
          <div>
            {offer.createdByProfile.displayName}
          </div>
        </div>

        <div class="flex flex-col w-full px-6 mt-2 space-y-4 bg-white">
          <div class="text-4xl text-left uppercase font-heading">
            {offer.title}
          </div>

          {#if offer.description}
            <div class="text-sm text-dark-lightest">
              {@html offer.description}
            </div>
          {/if}

          <div class="flex flex-col space-y-1 text-right">
            <div class="pt-2 text-sm">
              {#if shop.deliveryMethods}
                {#each shop.deliveryMethods as deliveryMethod, i}
                  <div class="">
                    <span class="text-xs"
                      >Available for {deliveryMethod.name}
                      {#if deliveryMethod.id == 1}
                        <Icon name="home" class="inline w-5 h-5 heroicon smallicon" />
                      {/if}
                      {#if deliveryMethod.id == 2}
                        <Icon name="truck" class="inline w-5 h-5 heroicon smallicon" />
                      {/if}
                    </span>
                    {#if deliveryMethod.id == 1}
                      <br />

                      Basic Income Lab GmbH<br />
                      Reifenstuelstrasse 6<br />
                      80469 München<br />
                      {#if shop.openingHours}
                        <span class="text-xs text-dark-lightest">Shop hours: {shop.openingHours}</span>
                      {/if}
                      <br />
                    {/if}
                  </div>
                {/each}
              {/if}
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="sticky bottom-0 left-0 right-0 w-full px-4 pb-4 mt-4 bg-white rounded-xl">
      <div class="flex flex-row space-x-4">
        <div>
          <button
            class="btn btn-square btn-light"
            on:click="{() => push(`#/contacts/chat/${offer.createdByProfile.circlesAddress}`)}">
            <Icon name="chat" class="w-6 h-6 heroicon smallicon" />
          </button>
        </div>
        <div class="flex-grow">
          <button type="submit" class="relative btn btn-primary btn-block" on:click="{() => addToCart(offer)}">
            {$_("dapps.o-marketplace.pages.offerDetail.addToCart")}
            <div class="absolute mr-1 right-2">
              <Icon name="shopping-cart" class="w-6 h-6 heroicon smallicon" />
            </div>
          </button>
        </div>
      </div>
    </div>
  {:else if !loading && !offer}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>{$_("dapps.o-marketplace.pages.offerDetail.notFound")}</div>
        </div>
      </div>
    </section>
  {/if}
</div>

<style>
/* Ensure image is always 16:9 Ratio */
.headerImageContainer {
  max-width: none;
}

.image-wrapper {
  position: relative;
  /* padding-bottom: 56.2%;b 16:9 */
  padding-bottom: 100%; /* 4:3 */
}

.image-wrapper img {
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
