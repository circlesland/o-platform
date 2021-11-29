<script lang="ts">
  import {
    AggregateType, CompletePurchaseDocument, InvoiceDocument, Profile,
    Purchase, Purchases, QueryInvoiceArgs,
  } from "../../../shared/api/data/types";
import { onMount } from "svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Subscription } from "rxjs";
import { me } from "../../../shared/stores/me";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { push } from "svelte-spa-router";
import {saveBufferAs} from "../../../shared/saveBufferAs";
import {ApiClient} from "../../../shared/apiConnection";

import UserImage from "src/shared/atoms/UserImage.svelte";
import Date from "../../../shared/atoms/Date.svelte";
import DetailActionBar from "../../../shared/molecules/DetailActionBar.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
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
  const result = await ApiClient.queryAggregate<Purchases>(AggregateType.Purchases, $me.circlesAddress,{
    purchases: {
      purchaseIds: [parseInt(id)],
    },
  });

  if (!result.purchases?.length) {
    throw new Error(`Couldn't find a purchase with id ${id}`);
  }
  purchase = result.purchases[0];
  isLoading = false;
}

function orderItems(items) {
  const orderedCart = {};
  items.forEach((item) => {
    console.log("ITI: ", item);
    orderedCart[item.id] = {
      item: item,
      qty: orderedCart[item.id] ? orderedCart[item.id].qty + 1 : 1,
    };
  });

  return Object.entries(orderedCart).map(([id, item]) => ({ id, item }));
}

function totalPrice(items) {
  let pricePerUnit = 0;
  if (items) {
    items.forEach(
      (e) => (pricePerUnit = pricePerUnit + parseFloat(e.pricePerUnit))
    );
  }
  return pricePerUnit;
}

onMount(async () => {
  await load();

  groupedItems = purchase ? orderItems(purchase.lines) : {};
  sellerProfile = purchase?.lines[0].offer.createdByProfile;

  actions = [
    {
      icon: "chat",
      title: "Chat",
      action: () => push(`#/friends/chat/${sellerProfile.circlesAddress}`),
    },
  ];


  if (purchase.invoices && purchase.invoices.length) {
    const pickUpAction = {
      icon: "transactions",
      title: "I picked up the order",
      action: async () => {
        const action = actions.find(o => o.title == "I picked up the order");
        actions = actions.splice(actions.indexOf(action) - 1, 1);

        const apiClient = await window.o.apiClient.client.subscribeToResult();
        await apiClient.mutate({
          mutation: CompletePurchaseDocument,
          variables: {
            invoiceId: purchase.invoices[0].id
          }
        });
      }
    };
    if (!purchase.invoices[0].buyerSignature) {
      actions.push(pickUpAction);
    }
    actions.push(
      {
        icon: "transactions",
        title: "Transaction",
        action: () =>
          push(
            `#/banking/transactions/${purchase.invoices[0].paymentTransactionHash}`
          ),
      },
      {
        icon: "document",
        title: "Download Invoice",
        action: async () => {
          for(let invoice of purchase.invoices) {
            const invoiceData = await ApiClient.query<string, QueryInvoiceArgs>(InvoiceDocument, {
              invoiceId: invoice.id
            });
            saveBufferAs(Buffer.from(invoiceData, "base64"), `invoice.pdf`);
          }
        }
      }
    );
  }

  shellEventSubscription = window.o.events.subscribe(
    async (event: PlatformEvent) => {
      if (
        event.type != "shell.refresh" ||
        (<any>event).dapp != "marketplace:1"
      ) {
        return;
      }
      await load();
    }
  );

  return () => {
    shellEventSubscription.unsubscribe();
  };
});
</script>

<div class="p-5">
  <header class="grid overflow-hidden bg-white ">
    <div class="w-full text-center">
      <h1 class="text-3xl uppercase font-heading">Purchase Details</h1>
    </div>
    <div class="w-full text-center">
      {#if purchase}
        <span class="text-dark-lightest"
          >Purchase Date: <Date time="{purchase.createdAt}" /></span>
      {/if}
    </div>
  </header>
  {#if isLoading}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>Loading purchases...</div>
        </div>
      </div>
    </section>
  {:else if groupedItems}
    <!-- <CartItems cartContents="{purchase.lines}" editable="{false}" /> -->
    <!-- <pre>{JSON.stringify(purchase, null, 2)}</pre> -->

    <div class="mt-6">
      <div class="flex flex-row items-stretch p-2 mb-6 bg-light-lighter">
        <div
          class="flex flex-row items-center content-start self-end space-x-2 text-base font-medium text-left cursor-pointer"
          on:click="{() => push(`#/friends/${sellerProfile.circlesAddress}`)}">
          <div class="inline-flex">
            <UserImage
              profile="{sellerProfile}"
              size="{5}"
              gradientRing="{false}" />
          </div>

          <div>
            {sellerProfile.firstName}
          </div>
        </div>
      </div>
      {#each groupedItems as groupPurchase, i}
        <div
          class="flex items-center justify-between w-full pb-6 mb-6 border-b">
          <div class="flex items-center w-full">
            <img
              src="{groupPurchase.item.item.offer.pictureUrl}"
              alt="{groupPurchase.item.item.offer.title}"
              class="w-20 rounded-full mask mask-circle" />
            <div class="flex flex-col items-start w-full ml-2 space-y-2">
              <div class="flex flex-row justify-between w-full">
                <div class="md:text-md">
                  <a
                    href="#/marketplace/offer/{groupPurchase.item.item.offer
                      .id}"
                    alt="{groupPurchase.item.item.offer.title}">
                    {groupPurchase.item.item.offer.title}
                  </a>
                </div>
              </div>
              <div class="flex items-center justify-end w-full">
                <div class="flex-grow text-sm text-left text-dark-lightest">
                  1 {groupPurchase.item.item.offer.unitTag
                    ? groupPurchase.item.item.offer.unitTag.value
                    : "item"}
                </div>

                <div class="flex pr-8">
                  <input
                    type="text"
                    value="{groupPurchase.item.item.amount}"
                    disabled
                    class="w-8 h-6 px-2 mx-2 text-sm text-center bg-gray-100 border rounded focus:outline-none" />
                </div>
                <div class="items-center">
                  <span class="whitespace-nowrap">
                    {groupPurchase.item.item.offer.pricePerUnit} ⦿
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
    {#each purchase.invoices as invoice}
      <div class="flex flex-col w-full mb-6 space-y-2 text-left ">
        <div class="pb-1 bg-gradient-to-r from-gradient1 to-gradient2">
          <h1 class="p-2 text-center text-white uppercase bg-dark-dark">
            Your Pick-Up Code
            <div class="text-sm text-center">
              show this code to the seller when you pick up your Order at the
              Store.
            </div>
          </h1>
        </div>

        <div class="w-full text-center">
          {#if !invoice.pickupCode}
            <h1 class="text-3xl uppercase font-heading">
              No pickup code yet ..
            </h1>
          {:else}
            <h1 class="text-6xl uppercase font-heading">
              {invoice.pickupCode}
            </h1>
          {/if}
        </div>

        <div class="pt-2 text-sm">Pick-Up Location for this Order is:</div>
        <div class="pt-2 text-sm">
          <span class="font-bold">Homo Circulus, Basic Income Lab GmbH</span
          ><br />
          Reifenstühlstrasse 6<br />
          80469 München<br />
          <span class="text-sm font-thin"
            >Shop hours: Mo - Fr&nbsp;&nbsp;&nbsp;14:00 - 20:00</span>
        </div>
      </div>
    {/each}
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
