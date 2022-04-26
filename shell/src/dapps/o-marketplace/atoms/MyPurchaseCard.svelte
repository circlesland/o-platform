<script lang="ts">
import { push } from "svelte-spa-router";
import { ProfileEvent, Purchased } from "../../../shared/api/data/types";
import Icons from "../../../shared/molecules/Icons.svelte";
import { _ } from "svelte-i18n";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import relativeTimeString from "../../../shared/functions/relativeTimeString";
dayjs.extend(relativeTime);

export let event: ProfileEvent;
export let purchased: Purchased;

$: {
  if (event && event.payload?.__typename == "Purchased") {
    const purchasedEvent = event.payload as Purchased;
    purchased = purchasedEvent;
  }
}

function loadDetailPage(path) {
  push(`#/marketplace/my-purchases/${path}`);
}

function getTableNoFromMetadata(metadataJson:string|undefined) {
  if (!metadataJson) {
    return "";
  }

  const parsedJson = purchased.purchase.lines[0].metadata
          ? JSON.parse(purchased.purchase.lines[0].metadata)
          : {};

  if (!parsedJson.Table) {
    return "";
  }

  return parsedJson.Table;
}
</script>

<div on:click="{() => loadDetailPage(purchased.purchase.id)}">
  <section on:click="{() => push(`#/marketplace/my-purchases/${purchased.purchase.id}`)}" class="mb-3 cursor-pointer">
    <div class="flex items-center w-full space-x-2 bg-white rounded-lg shadow-md">
      <div>
        <div class="relative w-20 h-20 overflow-hidden rounded-l-lg image-wrapper">
          <img
            src="{purchased.purchase.lines[0].offer.pictureUrl}"
            alt="{purchased.purchase.lines[0].offer.title}"
            class="absolute object-cover w-20 h-20 rounded-l-lg" />
        </div>
      </div>

      <div class="flex-col flex-grow">
        <div class="flex flex-row items-center justify-between px-3 text-left">
          <div class="flex-grow min-w-0">
            <h2 class="overflow-hidden text-sm sm:text-lg overflow-ellipsis">
              {purchased.seller_profile.displayName}
            </h2>
          </div>
          <div class="text-xs text-right text-dark-lightest whitespace-nowrap leading-non">
            <span class="inline-block"> {relativeTimeString(purchased.purchase.createdAt, 1, true)}</span>
          </div>
        </div>
        <div class="flex flex-row items-center justify-between px-3 text-left">
          <div class="flex-grow leading-none">
            <h2 class="overflow-hidden text-sm overflow-ellipsis">
              {#if purchased.purchase.lines.length > 1}
                {purchased.purchase.lines[0].offer.title}..
              {:else}
                {purchased.purchase.lines[0].offer.title}
              {/if}
            </h2>
          </div>
          <div class="text-right">{getTableNoFromMetadata(purchased.purchase.lines[0].metadata)}</div>
        </div>
        <div class="flex flex-row items-center justify-between px-3 mt-2 text-left">
          <div
            class="inline-block text-xs"
            class:text-alert-dark="{purchased.purchase.invoices[0].cancelledAt}"
            class:text-success="{purchased.purchase.invoices[0].paymentTransactionHash &&
              !purchased.purchase.invoices[0].cancelledAt}"
            class:text-info="{!purchased.purchase.invoices[0].paymentTransactionHash &&
              !purchased.purchase.invoices[0].cancelledAt}">
            {#if purchased.purchase.invoices[0].paymentTransactionHash}
              <span>{$_("dapps.o-marketplace.pages.myPurchases.paid")}</span>
              <Icons icon="check" size="{4}" customClass="inline" />
            {:else if purchased.purchase.invoices[0].cancelledAt}
              <span>{$_("dapps.o-marketplace.pages.myPurchases.cancelled")}</span>
            {:else}
              <span>{$_("dapps.o-marketplace.pages.myPurchases.paymentPending")}</span>
            {/if}
          </div>
          <div
            class="inline-block text-xs "
            class:text-inactive="{!purchased.purchase.invoices[0].pickupCode}"
            class:text-success="{purchased.purchase.invoices[0].pickupCode}">
            <span>{$_("dapps.o-marketplace.pages.myPurchases.pickupCode")}</span>
            {#if purchased.purchase.invoices[0].pickupCode}
              <Icons icon="check" size="{4}" customClass="inline" />
            {/if}
          </div>
          <div
            class="inline-block text-xs"
            class:text-inactive="{!purchased.purchase.invoices[0].sellerSignature}"
            class:text-success="{purchased.purchase.invoices[0].sellerSignature}">
            <span>{$_("dapps.o-marketplace.pages.myPurchases.pickedUp")}</span>
            {#if purchased.purchase.invoices[0].sellerSignature}
              <Icons icon="check" size="{4}" customClass="inline" />
            {:else}
              <Icons icon="closex" size="{2}" customClass="inline" />
            {/if}
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
