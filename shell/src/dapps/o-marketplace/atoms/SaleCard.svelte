<script lang="ts">
import Icons from "../../../shared/molecules/Icons.svelte";
import { push } from "svelte-spa-router";
import relativeTimeString from "../../../shared/functions/relativeTimeString";
import {
  ProfileEvent,
  Purchased,
  SaleEvent,
} from "../../../shared/api/data/types";
import dayjs from "dayjs";
import { _ } from "svelte-i18n";

export let event: ProfileEvent;
export let sale: SaleEvent;

$: {
  if (event && event.payload?.__typename == "SaleEvent") {
    const saleEvent = event.payload as SaleEvent;
    sale = saleEvent;
  }
}
</script>

{#if sale}
  <section
    on:click="{() => push(`#/marketplace/my-sales/${sale.invoice.id}`)}"
    class="mb-3 cursor-pointer">
    <div
      class="flex items-center w-full space-x-2 bg-white rounded-lg shadow-md">
      <div>
        <div
          class="relative w-20 h-20 overflow-hidden rounded-l-lg image-wrapper">
          <img
            src="{sale.invoice.lines[0].offer.pictureUrl}"
            alt="{sale.invoice.lines[0].offer.title}"
            class="absolute object-cover w-20 h-20 rounded-l-lg" />
        </div>
      </div>

      <div class="flex-col flex-grow">
        <div class="flex flex-row items-center justify-between px-3 text-left">
          <div class="flex-grow min-w-0">
            <h2 class="overflow-hidden text-base text-lg overflow-ellipsis">
              {sale.buyer_profile.displayName}
            </h2>
          </div>
          <div
            class="text-xs text-right text-dark-lightest whitespace-nowrap leading-non">
            <span class="inline-block">
              {relativeTimeString(sale.invoice.createdAt, 1, true)}
              <!-- {dayjs(sale.invoice.createdAt).format("DD.MM.YYYY HH:mm")}Uhr -->
            </span>
          </div>
          <!-- <div
                    class="self-end text-right pl-2 {params.endTextBigClass} whitespace-nowrap"
                    class:text-success="{!params.endTextBigClass}">
                    <span>{params.endTextBig ? params.endTextBig : ""}</span>
                  </div> -->
        </div>
        <div class="flex flex-row items-center justify-between px-3 text-left">
          <div class="flex-grow leading-none">
            {#each sale.invoice.lines as item}
              <h2 class="overflow-hidden text-sm overflow-ellipsis">
                {item.amount}x {item.offer.title}
              </h2>
            {/each}
            <!-- <h2 class="overflow-hidden text-sm overflow-ellipsis">
                        {#if sale.invoice.lines.length > 1}
                            {sale.invoice.lines[0].offer.title} ..
                        {:else}
                            {sale.invoice.lines[0].offer.title}
                        {/if}
                    </h2> -->
          </div>
        </div>
        <div
          class="flex flex-row items-center justify-between px-3 mt-2 text-left">
          <div
            class="inline-block text-xs "
            class:text-alert-dark="{!sale.invoice.paymentTransactionHash}"
            class:text-success="{sale.invoice.paymentTransactionHash}">
            {#if sale.invoice.paymentTransactionHash}
              <span>{$_("dapps.o-marketplace.pages.mySales.paid")}</span>
              <Icons icon="check" size="{4}" customClass="inline" />
            {:else if sale.invoice.cancelledAt}
              <span>{$_("dapps.o-marketplace.pages.mySales.cancelled")}</span>
            {:else}
              <span
                >{$_("dapps.o-marketplace.pages.mySales.paymentPending")}</span>
            {/if}
          </div>
          <div
            class="inline-block text-xs "
            class:text-inactive="{!sale.invoice.pickupCode}"
            class:text-success="{sale.invoice.pickupCode}">
            <span>{$_("dapps.o-marketplace.pages.mySales.pickupCode")}</span>
            {#if sale.invoice.pickupCode}
              <Icons icon="check" size="{4}" customClass="inline" />
            {/if}
          </div>
          <div
            class="inline-block text-xs"
            class:text-inactive="{!sale.invoice.sellerSignature}"
            class:text-success="{sale.invoice.sellerSignature}">
            <span>{$_("dapps.o-marketplace.pages.mySales.pickedUp")}</span>
            {#if sale.invoice.sellerSignature}
              <Icons icon="check" size="{4}" customClass="inline" />
            {:else}
              <Icons icon="closex" size="{2}" customClass="inline" />
            {/if}
          </div>
        </div>
      </div>
    </div>
  </section>
{:else}
  nope
{/if}
