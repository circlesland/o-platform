<script lang="ts">
import {
  EventType,
  Invoice,
  InvoiceDocument,
  Profile,
  ProfileEvent,
  QueryInvoiceArgs,
  SaleEvent,
} from "../../../shared/api/data/types";
import { onMount } from "svelte";
import Icons from "../../../shared/molecules/Icons.svelte";
import { push } from "svelte-spa-router";
import UserImage from "src/shared/atoms/UserImage.svelte";

import DetailActionBar from "../../../shared/molecules/DetailActionBar.svelte";
import { saveBufferAs } from "../../../shared/saveBufferAs";
import { ApiClient } from "../../../shared/apiConnection";
import Label from "../../../shared/atoms/Label.svelte";
import { mySales } from "../../../shared/stores/mySales";
import { contacts } from "../../../shared/stores/contacts";
import relativeTimeString from "../../../shared/functions/relativeTimeString";

export let id: string;

let isLoading: boolean;
let loadingRequested: boolean;
let error: Error;
let buyerProfile: Profile;

let groupedItems;
let actions = [];

let saleEvent: ProfileEvent;
let invoice: Invoice;

async function load() {
  if (isLoading) {
    loadingRequested = true;
    return;
  }

  saleEvent = await mySales.findByPrimaryKey(EventType.SaleEvent, id);
  if (!saleEvent) {
    return;
  }

  invoice = (<SaleEvent>saleEvent.payload).invoice;
  buyerProfile = (<SaleEvent>saleEvent.payload).buyer_profile;

  actions = [
    {
      icon: "chat",
      title: window.o.i18n("dapps.o-marketplace.pages.mySaleDetail.chat"),
      action: () => push(`#/contacts/chat/${buyerProfile.circlesAddress}`),
    },
  ];

  if (invoice) {
    const pickUpAction = {
      icon: "cash",
      title:
        invoice.deliveryMethod.id == 2
          ? "mark order shipped"
          : window.o.i18n("dapps.o-marketplace.pages.mySaleDetail.iHandedOut"),
      action: async () => {
        const action = actions.find(
          (o) => o.title == window.o.i18n("dapps.o-marketplace.pages.mySaleDetail.iHandedOut")
        );
        actions = actions.splice(actions.indexOf(action) - 1, 1);
        await mySales.completeSale(invoice.id);
      },
    };

    const unPickUpAction = {
      icon: "cash",
      title:
        invoice.deliveryMethod.id == 2
          ? "mark order not shipped"
          : window.o.i18n("dapps.o-marketplace.pages.mySaleDetail.iHaventHandedOut"),
      action: async () => {
        const action = actions.find(
          (o) => o.title == window.o.i18n("dapps.o-marketplace.pages.mySaleDetail.iHaventHandedOut")
        );
        actions = actions.splice(actions.indexOf(action) - 1, 1);
        await mySales.revokeSale(invoice.id);
      },
    };
    if (!invoice.sellerSignature) {
      actions.push(pickUpAction);
    } else if (invoice.sellerSignature) {
      actions.push(unPickUpAction);
    }
    actions.push(
      {
        icon: "cash",
        title: window.o.i18n("dapps.o-marketplace.pages.mySaleDetail.transaction"),
        action: () => push(`#/banking/transactions/${invoice.paymentTransactionHash}`),
      }
      // {
      //   icon: "document-text",
      //   title: window.o.i18n("dapps.o-marketplace.pages.mySaleDetail.downloadInvoice"),
      //   action: async () => {
      //     //for (let invoice of invoice) {
      //     const invoiceData = await ApiClient.query<string, QueryInvoiceArgs>(InvoiceDocument, {
      //       invoiceId: invoice.id,
      //     });

      //     saveBufferAs(Buffer.from(invoiceData, "base64"), `invoice.pdf`);
      //     //}
      //   },
      // }
    );
  }
  groupedItems = invoice ? orderItems(invoice.lines) : {};
  isLoading = false;
  if (loadingRequested) {
    loadingRequested = false;
    await load();
  }
}

function orderItems(items) {
  const orderedCart = {};
  items.forEach((item) => {
    orderedCart[item.offer.id] = {
      item: item,
      qty: orderedCart[item.offer.id] ? orderedCart[item.offer.id].qty + 1 : 1,
    };
  });

  return Object.entries(orderedCart).map(([id, item]) => ({ id, item }));
}

function totalPrice(items) {
  let pricePerUnit = 0;
  if (items) {
    items.forEach((e) => (pricePerUnit = pricePerUnit + parseFloat(e.pricePerUnit)));
  }
  return pricePerUnit;
}

onMount(async () => {
  const contactsSub = contacts.subscribe((next) => {
    load();
  });
  const mySalesSub = mySales.subscribe((next) => {
    load();
  });

  return () => {
    contactsSub();
    mySalesSub();
  };
});
</script>

<div class="p-5">
  <header class="grid overflow-hidden bg-white ">
    <div class="w-full text-center">
      <h1 class="text-3xl uppercase font-heading">
        <Label key="dapps.o-marketplace.pages.mySaleDetail.saleDetails" />
      </h1>
    </div>
    <div class="w-full text-center">
      {#if invoice}
        <span class="text-dark-lightest"
          ><Label key="dapps.o-marketplace.pages.mySaleDetail.saleDate" />
          {relativeTimeString(invoice.createdAt, 1, true)}</span>
      {/if}
    </div>
    {#if invoice}
      <div class="flex flex-row items-center justify-between px-3 mt-2 text-left">
        <div
          class="inline-block text-xs "
          class:text-alert-dark="{!invoice.paymentTransactionHash}"
          class:text-success="{invoice.paymentTransactionHash}">
          {#if invoice.paymentTransactionHash}
            <Label key="dapps.o-marketplace.pages.mySales.paid" />
            <Icons icon="check" size="{4}" customClass="inline" />
          {:else if invoice.cancelledAt}
            <Label key="dapps.o-marketplace.pages.mySales.cancelled" />
          {:else}
            <Label key="dapps.o-marketplace.pages.mySales.paymentPending" />
          {/if}
        </div>

        <div
          class="inline-block text-xs "
          class:text-inactive="{!invoice.pickupCode}"
          class:text-success="{invoice.pickupCode}">
          {#if invoice.deliveryMethod.id == 2}
            <span>Delivery</span>
            {#if invoice.pickupCode}
              <Icons icon="check" size="{4}" customClass="inline" />
            {/if}
          {:else}
            <Label key="dapps.o-marketplace.pages.mySales.pickupCode" />
            {#if invoice.pickupCode}
              <Icons icon="check" size="{4}" customClass="inline" />
            {/if}
          {/if}
        </div>
        <div
          class="inline-block text-xs"
          class:text-inactive="{!invoice.sellerSignature}"
          class:text-success="{invoice.sellerSignature}">
          {#if invoice.deliveryMethod.id == 2}
            <span>Order shipped</span>
            {#if invoice.sellerSignature}
              <Icons icon="check" size="{4}" customClass="inline" />
            {:else}
              <Icons icon="closex" size="{2}" customClass="inline" />
            {/if}
          {:else}
            <Label key="dapps.o-marketplace.pages.mySales.pickedUp" />
            {#if invoice.sellerSignature}
              <Icons icon="check" size="{4}" customClass="inline" />
            {:else}
              <Icons icon="closex" size="{2}" customClass="inline" />
            {/if}
          {/if}
        </div>
      </div>
    {/if}
  </header>
  {#if isLoading}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div><Label key="dapps.o-marketplace.pages.mySaleDetail.loadingSales" /></div>
        </div>
      </div>
    </section>
  {:else if !isLoading && buyerProfile && groupedItems && invoice}
    <div class="mt-6">
      <div class="p-2 mb-6 bg-light-lighter">
        <div
          class="flex flex-row items-center content-start self-end space-x-2 text-base font-medium text-left cursor-pointer"
          on:click="{() => push(`#/contacts/profile/${buyerProfile.circlesAddress}`)}">
          <div class="inline-flex">
            <UserImage profile="{buyerProfile}" size="{5}" gradientRing="{false}" />
          </div>

          <div>
            {buyerProfile.displayName}
          </div>
        </div>
      </div>
      {#each groupedItems as groupSale, i}
        <div class="flex items-center justify-between w-full pb-6 mb-6 border-b">
          <div class="flex items-center w-full">
            <img
              src="{groupSale.item.item.offer.pictureUrl}"
              alt="{groupSale.item.item.offer.title}"
              class="w-20 rounded-full mask mask-circle" />
            <div class="flex flex-col items-start w-full ml-2 space-y-2">
              <div class="flex flex-row justify-between w-full">
                <div class="md:text-md">
                  <a href="#/marketplace/offer/{groupSale.item.item.offer.id}" alt="{groupSale.item.item.offer.title}">
                    {groupSale.item.item.offer.title}
                  </a>
                </div>
              </div>
              <div class="flex items-center justify-end w-full">
                <div class="flex-grow text-sm text-left text-dark-lightest">
                  1 {groupSale.item.item.offer.unitTag ? groupSale.item.item.offer.unitTag.value : "item"}
                </div>

                <div class="flex pr-8">
                  <input
                    type="text"
                    value="{groupSale.item.item.amount}"
                    disabled
                    class="w-8 h-6 px-2 mx-2 text-sm text-center bg-gray-100 border rounded focus:outline-none" />
                </div>
                <div class="items-center">
                  <span class="whitespace-nowrap">
                    {groupSale.item.item.offer.pricePerUnit} €
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
    {#if invoice.deliveryMethod.id == 2}
      <div class="mt-6">
        <strong>Ship to:</strong>
        <br />
        {invoice.deliveryAddress.name}
        <br />
        {#if invoice.deliveryAddress}
          {`${invoice.deliveryAddress.street} ${invoice.deliveryAddress.house}`}
          <br />
          {`${invoice.deliveryAddress.zip} ${invoice.deliveryAddress.city}`}
          <br />
          {invoice.deliveryAddress.country}
          <br />
          {invoice.deliveryAddress.notificationEmail
            ? invoice.deliveryAddress.notificationEmail
            : "no email address set"}
        {/if}
      </div>
    {/if}

    <DetailActionBar actions="{actions}" />
  {/if}
</div>
