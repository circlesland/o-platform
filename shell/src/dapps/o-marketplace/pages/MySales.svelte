<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import dayjs from "dayjs";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { push } from "svelte-spa-router";
import { displayableName } from "../../../shared/functions/stringHelper";
import Icons from "../../../shared/molecules/Icons.svelte";
import { sales } from "../../../shared/stores/sales";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2">
  {#if !$sales}
    <section class="flex items-center justify-center mb-2 ">
      <div
        class="flex items-center w-full p-4 space-x-2 bg-white rounded-lg shadow-md ">
        <div class="flex flex-col items-start">
          <div>Loading sales...</div>
        </div>
      </div>
    </section>
  {:else if $sales && $sales.length === 0}
    <section class="flex items-center justify-center mb-2 ">
      <div
        class="flex items-center w-full p-4 space-x-2 bg-white rounded-lg shadow-md ">
        <div class="flex flex-col items-start">
          <div>No sales</div>
        </div>
      </div>
    </section>
  {:else if $sales && $sales.length > 0}
    {#each $sales as sale}
      <section
        on:click="{() => push(`#/marketplace/my-sales/${sale.id}`)}"
        class="mb-3 cursor-pointer">
        <div
          class="flex items-center w-full space-x-2 bg-white rounded-lg shadow-md">
          <div>
            <div
              class="relative w-20 h-20 overflow-hidden rounded-l-lg image-wrapper">
              <img
                src="{sale.lines[0].offer.pictureUrl}"
                alt="{sale.lines[0].offer.title}"
                class="absolute object-cover w-20 h-20 rounded-l-lg" />
            </div>
          </div>

          <div class="flex-col flex-grow">
            <div
              class="flex flex-row items-center justify-between px-3 text-left">
              <div class="flex-grow min-w-0">
                <h2 class="overflow-hidden text-base text-lg overflow-ellipsis">
                  {displayableName(
                    sale.buyerProfile.firstName,
                    sale.buyerProfile.lastName
                  )}
                </h2>
              </div>
              <div
                class="text-xs text-right text-dark-lightest whitespace-nowrap leading-non">
                <span class="inline-block">
                  {dayjs(sale.createdAt).format("DD.MM.YYYY")}</span>
              </div>
              <!-- <div
                  class="self-end text-right pl-2 {params.endTextBigClass} whitespace-nowrap"
                  class:text-success="{!params.endTextBigClass}">
                  <span>{params.endTextBig ? params.endTextBig : ""}</span>
                </div> -->
            </div>
            <div
              class="flex flex-row items-center justify-between px-3 text-left">
              <div class="flex-grow leading-none">
                <h2 class="overflow-hidden text-sm overflow-ellipsis">
                  {#if sale.lines.length > 1}
                    {sale.lines[0].offer.title} ..
                  {:else}
                    {sale.lines[0].offer.title}
                  {/if}
                </h2>
              </div>
            </div>
            <div
              class="flex flex-row items-center justify-between px-3 mt-2 text-left">
              <div
                class="inline-block text-xs "
                class:text-alert-dark="{!sale.invoices[0].paymentTransactionHash}"
                class:text-success="{sale.invoices[0].paymentTransactionHash}">
                 {#if sale.invoices[0].paymentTransactionHash}
                  <span>paid</span>
                    <Icons icon="check" size="{4}" customClass="inline" />
                  {:else}
                  <span>payment pending</span>
                  {/if}
              </div>
              <div
                class="inline-block text-xs "
                class:text-inactive="{!sale.invoices[0].pickupCode}"
                class:text-success="{sale.invoices[0].pickupCode}">
                <span>pick-up code</span>
                {#if sale.invoices[0].pickupCode}
                  <Icons icon="check" size="{4}" customClass="inline" />
                {/if}
              </div>
              <div
                class="inline-block text-xs"
                class:text-inactive="{!sale.invoices[0].sellerSignature &&
                  !sale.invoices[0].buyerSignature}"
                class:text-info="{(sale.invoices[0].sellerSignature &&
                  !sale.invoices[0].buyerSignature) ||
                  (!sale.invoices[0].sellerSignature &&
                    sale.invoices[0].buyerSignature)}"
                class:text-success="{sale.invoices[0].buyerSignature &&
                  sale.invoices[0].sellerSignature}">
                <span> picked up </span>
                {#if sale.invoices[0].buyerSignature && sale.invoices[0].sellerSignature}
                  <Icons icon="check" size="{4}" customClass="inline" />
                {:else}
                  <Icons icon="closex" size="{2}" customClass="inline" />
                {/if}
              </div>
            </div>
          </div>
        </div>
      </section>
    {/each}
  {/if}
</div>
