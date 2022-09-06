<script lang="ts">
import { push } from "svelte-spa-router";
import { Offer } from "../../../shared/api/data/types";
import UserImage from "src/shared/atoms/UserImage.svelte";
import Icons from "../../../shared/molecules/Icons.svelte";
import { me } from "../../../shared/stores/me";
import { truncateString } from "../../../shared/functions/truncateString";
import Label from "../../../shared/atoms/Label.svelte";
import {addToCart, AddToCartContextData} from "../processes/addToCart";
import Label from "../../../shared/atoms/Label.svelte";

export let param: Offer = <any>{
  categoryTag: {
    value: "",
    id: 0,
  },
  categoryTagId: 0,
  deliveryTermsTag: {
    value: "",
    id: 0,
  },
  description: "",
  unitTag: {
    value: "",
    id: 0,
  },
  pricePerUnit: "",
  id: 0,
  title: "",
  geonameid: 0,
  createdBy: {},
};

let offer = param;

export let allowEdit: boolean = false;

let isEditable: boolean = false;
$: {
  isEditable = allowEdit && $me && offer && $me.id == offer.createdByProfileId;
}

function loadDetailPage() {
  push("#/marketplace/detail/" + shopId + "/" + offer.id);
}

export let shopId: Number;

function _addToCart(item: Offer, shopId: number) {
  window.o.runProcess(addToCart, <AddToCartContextData>{
    offerId: parseInt(item.id.toString()),
    shopId: parseInt(shopId.toString()),
    redirectTo: `#/marketplace/cart`
  });
}

let displayName = `${offer.createdByProfile.displayName}`;
displayName = displayName.length >= 22 ? displayName.substring(0, 22) + "..." : displayName;
</script>

<section class="flex items-start pb-2 bg-white shadow-md rounded-xl">
  <div class="flex flex-col w-full ">
    <header class="cursor-pointer rounded-t-xl headerImageContainer" on:click="{() => loadDetailPage()}">
      <div class="relative rounded-t-xl image-wrapper">
        <img
          src="{offer.pictureUrl ? offer.pictureUrl : '/images/market/circles-no-image.jpg'}"
          alt="
          "
          class="rounded-t-xl" />
        <div class="absolute right-0 py-2 pt-3 pl-4 pr-2 mt-2 text-lg rounded-l-full font-enso top-2 bg-light-lightest">
          <span class="inline-block">{offer.pricePerUnit}</span>
          <span class="inline-block">€</span>
        </div>

        <div class="absolute right-0 py-2 pl-4 pr-1 mt-2 text-xs rounded-l-full top-16 bg-alert-lightest">
          <Label key="dapps.o-marketplace.atoms.offerCard.pickUpOnly"></Label>
        </div>
      </div>
    </header>
    <div
      class="relative flex flex-row items-center content-start p-2 space-x-4 text-base font-medium text-left bg-light-lighter">
      <div class="inline-flex">
        <UserImage profile="{offer.createdByProfile}" size="{10}" gradientRing="{true}" />
      </div>
      <div>
        {displayName}
      </div>
    </div>
    <div class="flex flex-col w-full px-4 pb-2 mt-2 space-y-4 ">
      <div class="h-32">
        <div class="text-4xl leading-tight text-left uppercase break-word font-heading">
          {offer.title}
        </div>

        {#if offer.description}
          <div class="text-sm text-dark-lightest">
            {@html truncateString(offer.description, 70)}
          </div>
        {/if}
      </div>

      <div class="flex flex-row space-x-4">
        <div class="">
          <button type="submit" class="relative btn btn-primary btn-square" on:click="{() => _addToCart(offer, shopId)}">
            <Icons icon="cart" />
          </button>
        </div>
        <div class="flex-grow">
          <button type="submit" class="relative btn btn-primary btn-block" on:click="{() => loadDetailPage()}">
            <Label key="dapps.o-marketplace.atoms.offerCard.details"></Label>
            <div class="absolute mr-1 right-2">
              <Icons icon="eye" />
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
