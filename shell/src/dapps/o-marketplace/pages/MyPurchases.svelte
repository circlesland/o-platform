<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import dayjs from "dayjs";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { push } from "svelte-spa-router";
import { displayableName } from "../../../shared/functions/stringHelper";
import Icons from "../../../shared/molecules/Icons.svelte";
import { purchases } from "../../../shared/stores/purchases";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2">
  {#if !$purchases}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>Loading purchases...</div>
        </div>
      </div>
    </section>
  {:else if $purchases && $purchases.length === 0}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>No purchases</div>
        </div>
      </div>
    </section>
  {:else if $purchases && $purchases.length > 0}
    {#each $purchases as purchase}
      <section
        on:click="{() => push(`#/marketplace/my-purchases/${purchase.id}`)}"
        class="mb-3 cursor-pointer">
        <div
          class="flex items-center w-full space-x-2 bg-white rounded-lg shadow-md">
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
            <div
              class="flex flex-row items-center justify-between px-3 text-left">
              <div class="flex-grow min-w-0">
                <h2 class="overflow-hidden text-lg overflow-ellipsis">
                  {displayableName(
                    purchase.invoices[0].sellerProfile.firstName,
                    purchase.invoices[0].sellerProfile.lastName
                  )}
                </h2>
              </div>
              <div
                class="text-xs text-right text-dark-lightest whitespace-nowrap leading-non">
                <span class="inline-block">
                  {dayjs(purchase.createdAt).format("DD.MM.YY")}</span>
              </div>
            </div>
            <div
              class="flex flex-row items-center justify-between px-3 text-left">
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
            <div
              class="flex flex-row items-center justify-between px-3 mt-2 text-left">
              <div
                class="inline-block text-xs"
                class:text-alert-dark={purchase.invoices[0].cancelledAt}
                class:text-success={purchase.invoices[0].paymentTransactionHash && !purchase.invoices[0].cancelledAt}
                class:text-info={!purchase.invoices[0].paymentTransactionHash && !purchase.invoices[0].cancelledAt}>
                {#if purchase.invoices[0].paymentTransactionHash}
                  <span>paid</span>
                  <Icons icon="check" size="{4}" customClass="inline" />
                {:else if purchase.invoices[0].cancelledAt}
                  <span>cancelled</span>
                {:else}
                  <span>payment pending</span>
                {/if}
              </div>
              <div
                class="inline-block text-xs "
                class:text-inactive="{!purchase.invoices[0].pickupCode}"
                class:text-success="{purchase.invoices[0].pickupCode}">
                <span>pick-up code</span>
                {#if purchase.invoices[0].pickupCode}
                  <Icons icon="check" size="{4}" customClass="inline" />
                {/if}
              </div>
              <div
                class="inline-block text-xs"
                class:text-inactive="{!purchase.invoices[0].sellerSignature &&
                  !purchase.invoices[0].buyerSignature}"
                class:text-info="{(purchase.invoices[0].sellerSignature &&
                  !purchase.invoices[0].buyerSignature) ||
                  (!purchase.invoices[0].sellerSignature &&
                    purchase.invoices[0].buyerSignature)}"
                class:text-success="{purchase.invoices[0].buyerSignature &&
                  purchase.invoices[0].sellerSignature}">
                <span> picked up </span>
                {#if purchase.invoices[0].buyerSignature && purchase.invoices[0].sellerSignature}
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
