<script lang="ts">
import { push } from "svelte-spa-router";
import { Offer } from "../../../shared/api/data/types";
import { purchase } from "../processes/purchase";
import OfferCardField from "./OfferCardField.svelte";
import UserImage from "src/shared/atoms/UserImage.svelte";
import Icons from "../../../shared/molecules/Icons.svelte";
import { me } from "../../../shared/stores/me";
import { cartContents } from "../stores/shoppingCartStore";
import { truncateString } from "../../../shared/functions/truncateString";
import Time from "svelte-time";
import { _ } from "svelte-i18n";

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

function edit(dirtyFlags: { [field: string]: boolean }) {
  // console.log("edit: dirtyFlags:", dirtyFlags);
  // window.o.runProcess(upsertOffer, offer, dirtyFlags, true);
}

function loadDetailPage() {
  push("#/marketplace/offer/" + offer.id);
}

function buy() {
  window.o.runProcess(purchase, {});
}

function addToCart(item) {
  $cartContents = $cartContents ? [...$cartContents, item] : [item];
  push(`#/marketplace/cart`);
}

let now = new Date();
let sevendaysago = now.setDate(now.getDate() - 7);

function dateOlderThanSevenDays(unixTime: number) {
  return sevendaysago > unixTime * 1000;
}

let displayName = `${offer.createdByProfile.displayName}`;

displayName =
  displayName.length >= 22 ? displayName.substr(0, 22) + "..." : displayName;
</script>

<section class="flex items-start bg-white shadow-md rounded-xl">
  <div class="flex flex-col w-full ">
    <div
      class="relative flex flex-col items-stretch w-full px-4 py-4 space-y-4 ">
      <div class="flex flex-row space-x-2">
        <div class="flex-grow" on:click="{() => loadDetailPage()}">
          <div class="text-lg leading-tight text-left uppercase break-word">
            <span class="cursor-pointer">{offer.title}</span>
          </div>
          <div>
            <div class="text-sm text-dark-lightest">
              {#if offer.description}
                {@html truncateString(offer.description, 40)}
                -
              {/if}
              <span class="inline-block text-dark-dark"
                >{offer.pricePerUnit}</span>
              <span class="inline-block text-dark-dark">€</span>
            </div>
          </div>
        </div>
        <div
          class="flex flex-col self-start justify-end cursor-pointer text-primary"
          on:click="{() => addToCart(offer)}">
          <Icons icon="cart" />
        </div>
      </div>
    </div>
  </div>
</section>
