<script lang="ts">
import {
  EventType,
  InvoiceDocument,
  Profile,
  Purchase,
  Purchased,
  QueryInvoiceArgs,
} from "../../../shared/api/data/types";
import { onMount } from "svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Subscription } from "rxjs";
import { me } from "../../../shared/stores/me";

import { push } from "svelte-spa-router";
import { saveBufferAs } from "../../../shared/saveBufferAs";
import { ApiClient } from "../../../shared/apiConnection";

import UserImage from "../../../shared/atoms/UserImage.svelte";
import formatShippingAddress from "../../../shared/functions/formatPostAddress";

import DetailActionBar from "../../../shared/molecules/DetailActionBar.svelte";
import Label from "../../../shared/atoms/Label.svelte";
import { myPurchases } from "../../../shared/stores/myPurchases";
import relativeTimeString from "../../../shared/functions/relativeTimeString";
import QrCode from "../../../shared/molecules/QrCode/QrCode.svelte";
import Label from "../../../shared/atoms/Label.svelte";

export let id: string;

let isLoading: boolean;
let error: Error;
let sellerProfile: Profile;
let purchase: Purchase;
let shellEventSubscription: Subscription;
let groupedItems;
let actions = [];

async function load() {
  if (isLoading) return;

  if (!$me.circlesAddress) {
    isLoading = false;
    purchase = null;
    return;
  }

  const cachedEvent = await myPurchases.findByPrimaryKey(EventType.Purchased, parseInt(id).toString());
  if (cachedEvent && cachedEvent.type == EventType.Purchased) {
    purchase = (<Purchased>cachedEvent.payload).purchase;
    sellerProfile = (<Purchased>cachedEvent.payload).seller_profile;
  }
  if (!purchase) {
    const loadedEvent = await myPurchases.findSingleItemFallback([EventType.Purchased], parseInt(id).toString());
    if (loadedEvent && loadedEvent.type == EventType.Purchased) {
      purchase = (<Purchased>loadedEvent.payload).purchase;
      sellerProfile = (<Purchased>loadedEvent.payload).seller_profile;
    }
  }

  groupedItems = purchase ? orderItems(purchase.lines) : {};
  isLoading = false;
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
  await load();
  actions = [
    {
      icon: "chat",
      title: window.i18n("dapps.o-marketplace.pages.myPurchaseDetail.chat"),
      action: () => push(`#/contacts/chat/${sellerProfile.circlesAddress}`),
    },
  ];

  if (purchase.invoices && purchase.invoices.length) {
    const pickUpAction = {
      icon: "cash",
      title: window.i18n("dapps.o-marketplace.pages.myPurchaseDetail.iPickedUp"),
      action: async () => {
        const action = actions.find(
          (o) => o.title == window.i18n("dapps.o-marketplace.pages.myPurchaseDetail.iPickedUp")
        );
        actions = actions.splice(actions.indexOf(action) - 1, 1);
        await myPurchases.completePurchase(purchase.invoices[0].id);
        actions.push(unPickUpAction);
      },
    };
    const unPickUpAction = {
      icon: "cash",
      title: window.i18n("dapps.o-marketplace.pages.myPurchaseDetail.iHaventPickedUp"),
      action: async () => {
        const action = actions.find(
          (o) => o.title == window.i18n("dapps.o-marketplace.pages.myPurchaseDetail.iHaventPickedUp")
        );
        actions = actions.splice(actions.indexOf(action) - 1, 1);
        await myPurchases.revokeCompletionStatus(purchase.invoices[0].id);
        actions.push(pickUpAction);
      },
    };

    if (
      purchase.invoices[0].paymentTransactionHash &&
      !purchase.invoices[0].paymentTransactionHash.startsWith("0x0000000000000000")
    ) {
      actions.push(
        {
          icon: "cash",
          title: window.i18n("dapps.o-marketplace.pages.myPurchaseDetail.transaction"),
          action: () => push(`#/banking/transactions/${purchase.invoices[0].paymentTransactionHash}`),
        }
        // {
        //   icon: "document",
        //   title: window.i18n("dapps.o-marketplace.pages.myPurchaseDetail.downloadInvoice"),
        //   action: async () => {
        //     for (let invoice of purchase.invoices) {
        //       const invoiceData = await ApiClient.query<string, QueryInvoiceArgs>(InvoiceDocument, {
        //         invoiceId: invoice.id,
        //       });
        //       saveBufferAs(Buffer.from(invoiceData, "base64"), `invoice.pdf`);
        //     }
        //   },
        // }
        // {
        //   icon: "document",
        //   title: window.i18n(
        //     "dapps.o-marketplace.pages.myPurchaseDetail.downloadInvoice"
        //   ),
        //   action: async () => {
        //     for (let invoice of purchase.invoices) {
        //       const invoiceData = await ApiClient.query<string, QueryInvoiceArgs>(
        //         InvoiceDocument,
        //         {
        //           invoiceId: invoice.id,
        //         }
        //       );
        //       saveBufferAs(Buffer.from(invoiceData, "base64"), `invoice.pdf`);
        //     }
        //   },
        // }
      );
    }
  }

  shellEventSubscription = window.o.events.subscribe(async (event: PlatformEvent) => {
    if (event.type != "shell.refresh" || (<any>event).dapp != "marketplace:1") {
      return;
    }
    await load();
  });

  return () => {
    shellEventSubscription.unsubscribe();
  };
});
</script>

<div class="p-5">
  <header class="grid overflow-hidden bg-white ">
    <div class="w-full text-center">
      <h1 class="text-3xl uppercase font-heading">
        <Label key="dapps.o-marketplace.pages.myPurchaseDetail.purchaseDetails" />
      </h1>
    </div>
    <div class="w-full text-center">
      {#if purchase}
        <span class="text-dark-lightest"
          ><Label key="dapps.o-marketplace.pages.myPurchaseDetail.purchaseDate" />
          {relativeTimeString(purchase.createdAt, 1, true)}</span>
      {/if}
    </div>
  </header>
  {#if isLoading}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>
            <Label key="dapps.o-marketplace.pages.myPurchaseDetail.loadingPurchases" />
          </div>
        </div>
      </div>
    </section>
  {:else if groupedItems && sellerProfile}
    <!-- <CartItems cartContents="{purchase.lines}" editable="{false}" /> -->
    <!-- <pre>{JSON.stringify(purchase, null, 2)}</pre> -->

    <div class="mt-6">
      <div class="flex flex-row items-stretch p-2 mb-6 bg-light-lighter">
        <div
          class="flex flex-row items-center content-start self-end space-x-2 text-base font-medium text-left cursor-pointer"
          on:click="{() => push(`#/contacts/profile/${sellerProfile.circlesAddress}`)}">
          <div class="inline-flex">
            <UserImage profile="{sellerProfile}" size="{5}" gradientRing="{false}" />
          </div>

          <div>
            {sellerProfile.firstName}
          </div>
        </div>
      </div>
      {#each groupedItems as groupPurchase, i}
        <div class="flex items-center justify-between w-full pb-6 mb-6 border-b">
          <div class="flex items-center w-full">
            <img
              src="{groupPurchase.item.item.offer.pictureUrl}"
              alt="{groupPurchase.item.item.offer.title}"
              class="w-20 rounded-full mask mask-circle" />
            <div class="flex flex-col items-start w-full ml-2 space-y-2">
              <div class="flex flex-row justify-between w-full">
                <div class="md:text-md">
                  <a
                    href="#/marketplace/offer/{groupPurchase.item.item.offer.id}"
                    alt="{groupPurchase.item.item.offer.title}">
                    {groupPurchase.item.item.offer.title}
                  </a>
                </div>
              </div>
              <div class="flex items-center justify-end w-full">
                <div class="flex-grow text-sm text-left text-dark-lightest">
                  1 {groupPurchase.item.item.offer.unitTag ? groupPurchase.item.item.offer.unitTag.value : "item"}
                </div>

                <div class="flex pr-8">
                  <input
                    type="text"
                    value="{groupPurchase.item.item.amount}"
                    disabled
                    class="w-8 h-6 px-2 mx-2 text-sm text-center bg-gray-100 border rounded focus:outline-none" />
                </div>
                <div class="items-center">
                  {#if groupPurchase.item.item.offer.pricePerUnit > 0}
                    <span class="whitespace-nowrap">
                      {groupPurchase.item.item.offer.pricePerUnit} €
                    </span>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
    {#each purchase.invoices as invoice}
      {#if invoice.deliveryMethod.id == 2}
        <div class="flex flex-col w-full mb-6 space-y-2 text-left ">
          <div class="pb-1 bg-gradient-to-r from-gradient1 to-gradient2">
            <h1
              class="p-2 text-center text-white uppercase"
              class:bg-dark-dark="{!invoice.sellerSignature}"
              class:bg-success-dark="{invoice.sellerSignature}">
              {#if invoice.sellerSignature}
                Your order has been shipped
              {:else if invoice.simplePickupCode}
                <Label key="dapps.o-marketplace.pages.myPurchaseDetail.yourPickupNumber" />
                {invoice.simplePickupCode}
              {/if}
            </h1>
          </div>
          <div class="w-full text-center">Your Order will be delivered to:</div>
          <div class="w-full text-center">
            {@html formatShippingAddress(purchase.deliveryAddress, true)}
          </div>
        </div>
      {/if}
      {#if invoice.deliveryMethod.id == 1}
        <div class="flex flex-col w-full mb-6 space-y-2 text-left ">
          <div class="pb-1 bg-gradient-to-r from-gradient1 to-gradient2">
            <h1 class="p-2 text-center text-white uppercase bg-dark-dark">
              {#if invoice.simplePickupCode}
                <Label key="dapps.o-marketplace.pages.myPurchaseDetail.yourPickupNumber" />
                {invoice.simplePickupCode}
              {/if}
            </h1>
          </div>

          <div class="w-full text-center">
            {#if !invoice.pickupCode}
              <h1 class="text-3xl uppercase font-heading">
                <Label key="dapps.o-marketplace.pages.myPurchaseDetail.noCode" />
              </h1>
            {:else}
              <div class="container mt-6">
                <center>
                  <QrCode value="{invoice.pickupCode}" size="{250}" />
                </center>
              </div>
            {/if}
          </div>

          <!-- <div class="pt-2 text-sm">
          <Label key="dapps.o-marketplace.pages.myPurchaseDetail.location" />
        </div>
        <div class="pt-2 text-sm">
          <span class="font-bold">Basic Income Lab GmbH</span><br />
          Reifenstuelstrasse 6<br />
          80469 München<br />
          <span class="text-sm font-thin"
            >Shop hours: Mo - Fr&nbsp;&nbsp;&nbsp;14:00 - 20:00</span>
        </div> -->
        </div>

        <div class="flex flex-col mt-8 space-y-2 text-center">
          {#if purchase.lines[0].shop && purchase.lines[0].shop.pickupAddress}
            <div>Please pick your order up at:</div>

            <div class="font-bold">{@html formatShippingAddress(purchase.lines[0].shop.pickupAddress, true)}</div>
          {/if}
          {#if purchase.lines[0].shop && purchase.lines[0].shop.openingHours}
            <div class="pt-2">Our Opening Hours are:</div>

            <div>{@html purchase.lines[0].shop.openingHours}</div>
          {/if}
        </div>
      {/if}
    {/each}
    <!-- <div class="flex flex-col mt-4 space-y-2 text-center">
      {#if context.data.shop.pickupAddress}
        <div>You can pick up your order at:</div>

        <div class="font-bold">{@html formatShippingAddress(context.data.shop.pickupAddress, true)}</div>
      {/if}
      {#if context.data.shop.openingHours}
        <div class="pt-2">Our Opening Hours are:</div>

        <div>{context.data.shop.openingHours}</div>
      {/if}
    </div> -->

    <DetailActionBar actions="{actions}" />
  {/if}
</div>

<!-- {#if isLoading}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>Loading purchases...</div>
        </div>
      </div>
    </section>
  {:else if error}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>
            <b>An error occurred while loading the recent activities:</b>
          </div>
        </div>
      </div>
    </section>
  {:else if purchase}
    <pre>{JSON.stringify(purchase, null, 2)}</pre> -->
<!-- {#each purchases as purchase}
      <SimpleItemCard
        params="{{
          imageUrl: purchase.lines[0].offer.pictureUrl,
          edgeless: true,

          title: `Purchase from ${dayjs(purchase.createdAt).format(
            'DD.MM.YYYY'
          )}`,
          action: () => push(`#/marketplace/purchase/${purchase.id}`),
          subTitle: `${purchase.lines
            .map((line) => line.offer.title)
            .join(', ')}`,
          endTextBig: `${purchase.total}  ⦿`,
          endTextBigClass: 'text-2xl',
          endTextSmall: 'paid, not yet picked up',
          class: 'cursor-pointer',
        }}" />
     <pre>{JSON.stringify(purchase, null, 2)}</pre>
    {/each} -->
<!-- {:else}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>No purchases</div>
        </div>
      </div>
    </section>
  {/if}
</div> -->
