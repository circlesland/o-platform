<script lang="ts">
import { push } from "svelte-spa-router";
import { Offer, ShopCategoryEntry } from "../../../shared/api/data/types";
import UserImage from "src/shared/atoms/UserImage.svelte";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";
import { cartContents } from "../stores/shoppingCartStore";
import { truncateString } from "../../../shared/functions/truncateString";
import { _ } from "svelte-i18n";

export let entry: ShopCategoryEntry;
export let shopId: number;

function loadDetailPage() {
  push("#/marketplace/detail/" + shopId + "/" + entry.id);
}

function addToCart(item: Offer & { shopId: number }) {
  $cartContents = $cartContents ? [...$cartContents, item] : [item];
  push(`#/marketplace/cart`);
}

let now = new Date();
let displayName = `${entry.product.createdByProfile.displayName}`;

displayName = displayName.length >= 22 ? displayName.substr(0, 22) + "..." : displayName;
</script>

<section class="flex items-start pb-2 bg-white shadow-md rounded-xl">
  <div class="flex flex-col w-full ">
    <header class="cursor-pointer rounded-t-xl headerImageContainer" on:click="{() => loadDetailPage()}">
      <div class="relative rounded-t-xl image-wrapper">
        <img
          src="{entry.product.pictureUrl ? entry.product.pictureUrl : '/images/market/circles-no-image.jpg'}"
          alt="
          "
          class="rounded-t-xl" />
        <div class="absolute right-0 py-2 pt-3 pl-4 pr-2 mt-2 text-lg rounded-l-full font-enso top-2 bg-light-lightest">
          <span class="inline-block">{entry.product.pricePerUnit}</span>
          <span class="inline-block">€</span>
        </div>

        <div class="absolute right-0 py-2 pl-4 pr-1 mt-2 text-xs rounded-l-full top-16 bg-alert-lightest">
          {$_("dapps.o-marketplace.atoms.offerCard.pickUpOnly")}
        </div>
      </div>
    </header>
    <div
      class="relative flex flex-row items-center content-start p-2 space-x-4 text-base font-medium text-left bg-light-lighter">
      <div class="inline-flex">
        <UserImage profile="{entry.product.createdByProfile}" size="{10}" gradientRing="{true}" />
      </div>
      <div>
        {displayName}
      </div>
    </div>
    <div class="flex flex-col w-full px-4 pb-2 mt-2 space-y-4 ">
      <div class="h-32">
        <div class="text-4xl leading-tight text-left uppercase break-word font-heading">
          {entry.product.title}
        </div>

        {#if entry.product.description}
          <div class="text-sm text-dark-lightest">
            {@html truncateString(entry.product.description, 70)}
          </div>
        {/if}
      </div>

      <div class="flex flex-row space-x-4">
        <div class="">
          <button
            type="submit"
            class="relative btn btn-primary btn-square"
            on:click="{() => addToCart({ ...entry.product, shopId: shopId })}">
            <Icon name="shopping-cart" class="w-6 h-6 heroicon smallicon" />
          </button>
        </div>
        <div class="flex-grow">
          <button type="submit" class="relative btn btn-primary btn-block" on:click="{() => loadDetailPage(shopId)}">
            {$_("dapps.o-marketplace.atoms.offerCard.details")}
            <div class="absolute mr-1 right-2">
              <Icon name="eye" class="w-6 h-6 heroicon smallicon" />
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
/* Ensure image is always 16:9 Ratio */
.headerImageContainer {
  max-width: none;
}

.image-wrapper {
  position: relative;
  /* padding-bottom: 56.2%;b 16:9 */
  padding-bottom: 75%; /* 4:3 */
}

.image-wrapper img {
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
