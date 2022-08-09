<script lang="ts">
import { push } from "svelte-spa-router";
import {
  Profile,
  ProfileEvent,
  Purchase,
  Purchased,
} from "../../../../shared/api/data/types";
import { JumplistItem } from "@o-platform/o-interfaces/dist/routables/jumplist";
import { onMount } from "svelte";

import dayjs from "dayjs";


export let event: ProfileEvent;

let purchase: Purchase;
let sellerProfile: Profile;

if (event && event.payload.__typename == "Purchased") {
  purchase = (<Purchased>event.payload).purchase;
  sellerProfile = (<Purchased>event.payload).seller_profile;
}
</script>

{#if purchase}
  <section
    on:click="{() => push(`#/marketplace/my-purchases/${purchase.id}`)}"
    class="mb-3 cursor-pointer">
    <div
      class="flex items-center w-full space-x-2 bg-white border rounded-lg shadow-md">
      <div>
        <div
          class="relative w-20 h-20 overflow-hidden rounded-l-lg image-wrapper">
          <img
            src="{purchase.lines[0].offer.pictureUrl}"
            alt="{purchase.lines[0].offer.title}"
            class="absolute object-cover w-20 h-20 rounded-l-lg" />
        </div>
      </div>

      <div class="flex-col flex-grow">
        <div class="flex flex-row items-center justify-between px-3 text-left">
          <div class="flex-grow min-w-0">
            <h2 class="overflow-hidden text-sm sm:text-lg overflow-ellipsis">
              Purchase
            </h2>
          </div>
          <div
            class="text-xs text-right text-dark-lightest whitespace-nowrap leading-non">
            <span class="inline-block">
              {dayjs(purchase.createdAt).format("DD.MM.YY")}</span>
          </div>
        </div>
        <div class="flex flex-row items-center justify-between px-3 text-left">
          <div class="flex-grow leading-none">
            <h2 class="overflow-hidden text-sm overflow-ellipsis">
              {#if purchase.lines.length > 1}
                {purchase.lines[0].offer.title}..
              {:else}
                {purchase.lines[0].offer.title}
              {/if}
            </h2>
          </div>
        </div>
        <!-- <div
        class="flex flex-row items-center justify-between px-3 mt-2 text-left">
        <div
          class="inline-block text-xs"
          class:text-alert-dark="{purchase.cancelledAt}"
          class:text-success="{purchase.paymentTransactionHash &&
            !purchase.cancelledAt}"
          class:text-info="{!purchase.paymentTransactionHash &&
            !purchase.cancelledAt}">
          {#if purchase.paymentTransactionHash}
            <span><Label key="dapps.o-marketplace.pages.myPurchases.paid"  /></span>
            <Icons icon="check" size="{4}" customClass="inline" />
          {:else if purchase.cancelledAt}
            <span><Label key="dapps.o-marketplace.pages.myPurchases.cancelled"  /></span>
          {:else}
            <span
              >{$_(
                "dapps.o-marketplace.pages.myPurchases.paymentPending"
              )}</span>
          {/if}
        </div>
        <div
          class="inline-block text-xs "
          class:text-inactive="{!purchase.pickupCode}"
          class:text-success="{purchase.pickupCode}">
          <span><Label key="dapps.o-marketplace.pages.myPurchases.pickupCode"  /></span>
          {#if purchase.pickupCode}
            <Icons icon="check" size="{4}" customClass="inline" />
          {/if}
        </div>
        <div
          class="inline-block text-xs"
          class:text-inactive="{!purchase.sellerSignature}"
          class:text-success="{purchase.sellerSignature}">
          <span><Label key="dapps.o-marketplace.pages.myPurchases.pickedUp"  /></span>
          {#if purchase.sellerSignature}
            <Icons icon="check" size="{4}" customClass="inline" />
          {:else}
            <Icons icon="closex" size="{2}" customClass="inline" />
          {/if}
        </div>
      </div> -->
      </div>
    </div>
  </section>
{/if}
