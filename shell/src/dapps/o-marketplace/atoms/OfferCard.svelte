<script lang="ts">
import { push } from "svelte-spa-router";
import { Offer, ShopCategoryEntry } from "../../../shared/api/data/types";
import UserImage from "../../../shared/atoms/UserImage.svelte";
import Icons from "../../../shared/molecules/Icons.svelte";
import { truncateString } from "../../../shared/functions/truncateString";
import Label from "../../../shared/atoms/Label.svelte";
import { addToCart, AddToCartContextData } from "../processes/addToCart";
import { getTrustedByShop } from "../processes/getTrustedByShop";
import { trustFromContactMetadata } from "../../../shared/functions/trustFromContactMetadata";
import { contacts } from "../../../shared/stores/contacts";

export let entry: ShopCategoryEntry;
export let shopId: number;
export let deliveryMethods: any;

function loadDetailPage() {
  push("#/marketplace/detail/" + shopId + "/" + entry.id);
}

async function _addToCart(item: Offer & { shopId: number }) {
  console.log("entry", entry);
  const contact = await contacts.findBySafeAddress(entry.product.createdByProfile.circlesAddress);
  const { trustIn, trustOut } = trustFromContactMetadata(contact);

  if (trustIn > 0) {
    window.o.runProcess(addToCart, <AddToCartContextData>{
      offerId: parseInt(item.id.toString()),
      shopId: parseInt(item.shopId.toString()),
      redirectTo: `#/marketplace/cart`,
    });
  } else {
    window.o.runProcess(getTrustedByShop, {
      successAction: () => {
        window.o.runProcess(addToCart, <AddToCartContextData>{
          offerId: parseInt(item.id.toString()),
          shopId: parseInt(item.shopId.toString()),
          redirectTo: `#/marketplace/cart`,
        });
      },
    });
  }
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
        {#if entry.product.pricePerUnit}
          <div
            class="absolute right-0 py-2 pt-3 pl-4 pr-2 mt-2 text-lg rounded-l-full font-enso top-2 bg-light-lightest">
            <span class="inline-block">{entry.product.pricePerUnit}</span>
            <span class="inline-block">€</span>
          </div>
        {/if}

        {#if deliveryMethods}
          {#each deliveryMethods as deliveryMethod, i}
            <div
              class="absolute right-0 py-2 pl-4 pr-1 mt-2 text-xs rounded-l-full bg-alert-lightest"
              class:top-16="{i == 0}"
              class:top-28="{i > 0}">
              {deliveryMethod.name}
            </div>
          {/each}
        {/if}
        {#if entry.product.minAge}
          <div class="absolute right-0 py-2 pl-4 pr-2 mt-2 text-xs rounded-l-full bottom-4 bg-light-lightest">
            {#if entry.product.minAge < 18}
              <Icons icon="under16" customClass="inline" size="{10}" />
            {:else}
              <Icons icon="under18" customClass="inline" size="{10}" />
            {/if}
          </div>
        {/if}
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
          {#if entry.product.currentInventory !== null && entry.product.currentInventory < 1}
            <button type="submit" class="relative btn btn-disabled">
              <Label key="dapps.o-marketplace.pages.offerDetail.soldOut" />
            </button>
          {:else}
            <button
              type="submit"
              class="relative btn btn-primary btn-square"
              on:click="{() => _addToCart({ ...entry.product, shopId: shopId })}">
              <Icons icon="shopping-cart" class="w-6 h-6 heroicon smallicon" />
            </button>
          {/if}
        </div>
        <div class="flex-grow">
          <button type="submit" class="relative btn btn-primary btn-block" on:click="{() => loadDetailPage(shopId)}">
            <Label key="dapps.o-marketplace.atoms.offerCard.details" />
            <div class="absolute mr-1 right-2">
              <Icons icon="eye" customClass="w-6 h-6 heroicon smallicon" />
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
  padding-bottom: 100%; /* 4:3 */
}

.image-wrapper img {
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
