<script lang="ts">
import { onMount } from "svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Subscription } from "rxjs";
import Icons from "../../../shared/molecules/Icons.svelte";
import { push } from "svelte-spa-router";
import UserImage from "../../../shared/atoms/UserImage.svelte";
import { offers } from "../../../shared/stores/offers";
import Label from "../../../shared/atoms/Label.svelte";
import { Offer, Shop, ShopDocument, ShopQueryVariables } from "../../../shared/api/data/types";
import { ApiClient } from "../../../shared/apiConnection";
import { addToCart, AddToCartContextData } from "../processes/addToCart";

let isLoading: boolean;
let error: Error;
let offer: Offer[] = [];
let shellEventSubscription: Subscription;
let shop: Shop | null = null;

export let id: number;

async function load() {
  if (!id) {
    offer = [];
    return;
  }

  const o = await offers.findById(parseInt(id.toString()));
  offer = o ? [o] : [];

  shop = await ApiClient.query<Shop, ShopQueryVariables>(ShopDocument, {
    id: 30,
  });

  isLoading = false;
}

export let shopId: Number; // ATTENTION SHOPID IS HARDCODED BELOW AT THE API CALL!!!!!!!

function _addToCart(item: Offer, shopId: number) {
  window.o.runProcess(addToCart, <AddToCartContextData>{
    offerId: parseInt(item.id.toString()),
    shopId: parseInt(shopId.toString()),
    redirectTo: `#/marketplace/cart`,
  });
}

onMount(async () => {
  isLoading = true;

  await load();

  shellEventSubscription = window.o.events.subscribe(async (event: PlatformEvent) => {
    if (event.type != "shell.refresh" || (<any>event).dapp != "marketplace:1") {
      return;
    }
    await load();
  });

  return () => {
    shellEventSubscription.unsubscribe();
  };
});
</script>

<div class="">
  {#if isLoading}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div><Label key="dapps.o-marketplace.pages.offerDetail.loadingOffers" /></div>
        </div>
      </div>
    </section>
  {:else if error}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>
            <b><Label key="dapps.o-marketplace.pages.offerDetail.error" /></b>
          </div>
        </div>
      </div>
    </section>
  {:else if offer.length}
    {#each offer as o}
      <section class="flex items-start rounded-xl">
        <div class="flex flex-col w-full ">
          <header class=" rounded-t-xl headerImageContainer">
            <div class="relative rounded-t-xl image-wrapper">
              <img
                src="{o.pictureUrl ? o.pictureUrl : '/images/market/circles-no-image.jpg'}"
                alt="
                "
                class="w-full rounded-t-xl" />
              {#if o.pricePerUnit > 0}
                <div
                  class="absolute right-0 py-2 pt-3 pl-4 pr-2 mt-2 text-lg rounded-l-full font-enso top-2 bg-light-lightest">
                  <span class="inline-block">{o.pricePerUnit}</span>
                  <span class="inline-block">€</span>
                </div>
              {/if}

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
              <UserImage profile="{o.createdByProfile}" size="{10}" gradientRing="{false}" />
            </div>
            <div>
              {o.createdByProfile.displayName}
            </div>
          </div>

          <div class="flex flex-col w-full px-6 mt-2 space-y-4 bg-white">
            <div class="text-4xl text-left uppercase font-heading">
              {o.title}
            </div>

            {#if o.description}
              <div class="text-sm text-dark-lightest">
                {@html o.description}
              </div>
            {/if}

            <!-- {#if o.deliveryTermsTag} -->
            {#if o.pricePerUnit > 0}
              <div class="flex flex-col space-y-1 text-right">
                <div class="pt-2 text-sm">
                  <div class="">
                    <span class="text-xs"
                      >Available for delivery <Icon
                        icon="heroicon:truck"
                        class="inline w-5 h-5 heroicon smallicon" /></span>
                  </div>
                  <div class="pb-2 ">
                    <span class="text-xs"
                      >Available for in-Store pickup
                      <Icons icon="home" customClass="inline w-5 h-5 heroicon smallicon" /></span>
                    <br />
                    <br />
                    Basic Income Lab GmbH<br />
                    Reifenstuelstrasse 6<br />
                    80469 München<br />
                    {#if shop && shop.openingHours}
                      <span class="text-xs text-dark-lightest">Shop hours: {shop.openingHours}</span>
                    {/if}
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </section>

      <div class="sticky bottom-0 left-0 right-0 w-full px-4 pb-4 mt-4 bg-white rounded-xl">
        <div class="flex flex-row space-x-4">
          <div>
            <button
              class="btn btn-square btn-primary btn-outline"
              on:click="{() => push(`#/contacts/chat/${o.createdByProfile.circlesAddress}`)}">
              <Icons icon="chat" customClass="w-6 h-6 heroicon smallicon" />
            </button>
          </div>
          <div class="flex-grow">
            {#if o.pricePerUnit > 0}
              <button type="submit" class="relative btn btn-primary btn-block" on:click="{() => _addToCart(o, shopId)}">
                <Label key="dapps.o-marketplace.pages.offerDetail.addToCart" />
                <div class="absolute mr-1 right-2">
                  <Icons icon="shopping-cart" customClass="w-6 h-6 heroicon smallicon" />
                </div>
              </button>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  {:else}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div><Label key="dapps.o-marketplace.pages.offerDetail.notFound" /></div>
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
