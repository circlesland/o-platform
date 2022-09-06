<script lang="ts">
import Icons from "../../../shared/molecules/Icons.svelte";
import { push } from "svelte-spa-router";
import relativeTimeString from "../../../shared/functions/relativeTimeString";
import { Invoice, ProfileEvent, SaleEvent } from "../../../shared/api/data/types";
import Label from "../../../shared/atoms/Label.svelte";
import UserImage from "../../../shared/atoms/UserImage.svelte";
import Button from "../../../shared/atoms/button/Button.svelte";
import ButtonContext from "../../../shared/atoms/button/buttonContext";
import { mySales } from "../../../shared/stores/mySales";

export let event: ProfileEvent;
export let sale: SaleEvent;

let invoice: Invoice;
let buttonContext: ButtonContext;
let action;

$: {
  if (event && event.payload?.__typename == "SaleEvent") {
    const saleEvent = event.payload as SaleEvent;
    sale = saleEvent;
    invoice = sale.invoice;

    console.log("SALEEVENT", sale);
  }

  const pickUpAction = {
    icon: "",
    color: "primary-lighter",
    title: "Mark as served",
    action: async () => {
      await mySales.completeSale(invoice.id);
      action = unPickUpAction;
    },
  };
  const unPickUpAction = {
    icon: "check",
    color: "outline btn-success",
    title: "Not served",
    action: async () => {
      await mySales.revokeSale(invoice.id);
      action = pickUpAction;
    },
  };
  if (!invoice.sellerSignature) {
    action = pickUpAction;
  } else if (invoice.sellerSignature) {
    action = unPickUpAction;
  }

  buttonContext = {
    label: null,
    icon: action.icon,
    color: action.color,
    style: "square",
    action: action.action,
  };
}

function getTableNoFromMetadata(metadataJson: string | undefined) {
  if (!sale || !sale.invoice || !metadataJson) {
    return "";
  }

  const parsedJson = sale.invoice.lines[0].metadata ? JSON.parse(sale.invoice.lines[0].metadata) : {};

  if (!parsedJson?.Table) {
    return "";
  }

  return "Table: " + parsedJson.Table;
}
</script>

<!--  -->

{#if sale}
  <section class="mb-3 cursor-pointer">
    <div class="relative flex items-center w-full space-x-2 bg-white rounded-lg shadow-md cardborder ">
      <div
        class="absolute top-0 left-0 w-2 h-full rounded-tl-lg rounded-bl-lg bg-primary-lighter"
        class:bg-white="{!sale.invoice.sellerSignature}"
        class:bg-success="{sale.invoice.sellerSignature}"
        class:bg-alert="{sale.invoice.cancelledAt}">
      </div>

      <div class="flex-col flex-grow">
        <div
          class="flex flex-row items-center justify-between px-3 text-left"
          on:click="{() => push(`#/marketplace/my-sales/${sale.invoice.id}`)}">
          <div class="flex flex-row flex-grow min-w-0 mt-2 space-x-2">
            <div class="inline-flex self-center">
              <UserImage profile="{sale.buyer_profile}" size="{5}" gradientRing="{false}" />
            </div>
            <h2 class="self-center inline overflow-hidden text-base text-lg break-all overflow-ellipsis">
              {sale.buyer_profile.displayName}
            </h2>
          </div>
          <div class="pt-1 text-xs text-right text-dark-light whitespace-nowrap leading-non">
            <span class="inline-block">
              {relativeTimeString(sale.invoice.createdAt, 1, true)}
            </span>

            <div class="mt-2 mb-2 text-lg font-bold text-right">
              {getTableNoFromMetadata(sale.invoice.lines[0].metadata)}
            </div>
          </div>
        </div>
        <div class="flex flex-row items-center justify-between px-3 mt-2 text-left">
          <div class="flex-grow leading-none" on:click="{() => push(`#/marketplace/my-sales/${sale.invoice.id}`)}">
            <table>
              {#each sale.invoice.lines as item}
                <tr>
                  <td>
                    <div class="mb-2 text-center ">{item.amount}</div>
                  </td>
                  <td>
                    <div class="mb-2 text-xs">&nbsp;x&nbsp;</div>
                  </td>
                  <td>
                    <h2 class="mb-2 overflow-hidden text-sm overflow-ellipsis">
                      {item.offer.title}
                      {#if item.offer.currentInventory !== null}
                        <small class="text-alert-light">iv: {item.offer.currentInventory}</small>
                      {/if}
                    </h2>
                  </td>
                </tr>
              {/each}
            </table>
          </div>
          <div>
            {#if !sale.invoice.cancelledAt}
              {#if !invoice.sellerSignature}
                {#if invoice.deliveryMethod.id == 2}
                  <Button context="{buttonContext}">
                    <Icons icon="truck" size="{6}" customClass="inline smallicon" />
                  </Button>
                {:else if sale.invoice.simplePickupCode}
                  <Button context="{buttonContext}">
                    {sale.invoice.simplePickupCode}
                  </Button>
                {:else}
                  <Button context="{buttonContext}" />
                {/if}
              {:else}
                <Button context="{buttonContext}" />
              {/if}
            {/if}
          </div>
        </div>
        <div
          class="flex flex-row items-center justify-between px-3 mt-2 text-left"
          on:click="{() => push(`#/marketplace/my-sales/${sale.invoice.id}`)}">
          <div
            class="inline-block mb-2 text-xs"
            class:text-alert-dark="{!sale.invoice.paymentTransactionHash}"
            class:text-success="{sale.invoice.paymentTransactionHash}">
            {#if sale.invoice.paymentTransactionHash}
              <Label key="dapps.o-marketplace.pages.mySales.paid" />
              <Icons icon="check" size="{4}" customClass="inline" />
            {:else if sale.invoice.cancelledAt}
              <Label key="dapps.o-marketplace.pages.mySales.cancelled" />
            {:else}
              <Label key="dapps.o-marketplace.pages.mySales.paymentPending" />
            {/if}
          </div>

          {#if sale.invoice.deliveryMethod.id == 1}
            <div
              class="inline-block mb-2 text-xs"
              class:text-primary-lighter="{!sale.invoice.sellerSignature}"
              class:text-success="{sale.invoice.sellerSignature}">
              {#if !sale.invoice.sellerSignature}
                <Label key="dapps.o-marketplace.pages.mySales.notPickedUp" />
              {:else}
                <Label key="dapps.o-marketplace.pages.mySales.pickedUp" />
              {/if}
              {#if sale.invoice.sellerSignature}
                <Icons icon="check" size="{4}" customClass="inline" />
              {:else}
                <Icons icon="closex" size="{2}" customClass="inline" />
              {/if}
            </div>
          {:else if sale.invoice.deliveryMethod.id == 2}
            <div
              class="inline-block mb-2 text-xs"
              class:text-primary-lighter="{!sale.invoice.sellerSignature}"
              class:text-success="{sale.invoice.sellerSignature}">
              {#if !sale.invoice.sellerSignature}
                <span>Not yet shipped</span>
              {:else}
                <span>Items have been shipped</span>
              {/if}
              {#if sale.invoice.sellerSignature}
                <Icons icon="check" size="{4}" customClass="inline" />
              {:else}
                <Icons icon="closex" size="{2}" customClass="inline" />
              {/if}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </section>
{:else}
  nope
{/if}
