<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import {
  AggregatesDocument,
  AggregateType,
  Offer,
  Purchase,
} from "../../../shared/api/data/types";
import { onMount } from "svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Subscription } from "rxjs";
import { me } from "../../../shared/stores/me";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import UserImage from "src/shared/atoms/UserImage.svelte";
import Date from "../../../shared/atoms/Date.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let id: number;

let isLoading: boolean;
let error: Error;
let purchase: Purchase;
let shellEventSubscription: Subscription;
let groupedItems;

async function load() {
  if (isLoading) return;

  // const safeAddress = $me.circlesAddress;
  // const apiClient = await window.o.apiClient.client.subscribeToResult();

  // const purchaseResult = await apiClient.query({
  //   query: AggregatesDocument,
  //   variables: {
  //     types: [AggregateType.Purchase],
  //     safeAddress: safeAddress,
  //     filter: {
  //       id: id,
  //     },
  //   },
  // });

  // if (purchaseResult.errors?.length > 0) {
  //   throw new Error(`Couldn't read the offers for safe ${safeAddress}`);
  // }

  // const o = purchaseResult.data.aggregates.find(
  //   (o) => o.type == AggregateType.Purchases
  // );
  // if (!o) {
  //   throw new Error(`Couldn't find the Purchases in the query result.`);
  // }

  // purchase = o.payload.purchase;

  purchase = {
    id: 11,
    createdAt: "2021-11-10T17:27:25.545Z",
    createdByAddress: "0x009626daded5e90aecee30ad3ebf2b3e510fe256",
    createdByProfile: {
      id: 258,
      firstName: "Hier, haste",
      lastName: "nen Namen",
      avatarCid: null,
      __typename: "Profile",
    },
    total: "0.02",
    lines: [
      {
        id: 12,
        amount: 1,
        offer: {
          id: 3,
          version: 2,
          title: "Mundgranate Energy Drink",
          description: "It's hot, it's cold, it's a piece of american freedom",
          pictureUrl: "/images/market/mundgranate_large.jpg",
          pricePerUnit: "0.01",
          __typename: "Offer",
        },
        __typename: "PurchaseLine",
      },
      {
        id: 13,
        amount: 1,
        offer: {
          id: 6,
          version: 1,
          title: "Chuckalina Weisswein",
          description: "Schmeckt",
          pictureUrl: "/images/market/Chuckalina_Large.jpg",
          pricePerUnit: "0.01",
          __typename: "Offer",
        },
        __typename: "PurchaseLine",
      },
    ],
    __typename: "Purchase",
  };

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

onMount(async () => {
  await load();

  groupedItems = purchase ? orderItems(purchase.lines) : {};
  console.log("PURCHASE: ", purchase);

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

<div class="p-5 pb-0">
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
    <!-- <pre>{JSON.stringify(groupedItems, null, 2)}</pre> -->

    <div class="mt-6">
      {#each groupedItems as item, i}
        <div
          class="flex items-center justify-between w-full pb-6 mb-6 border-b">
          <div class="flex items-center w-full">
            <img
              src="{item.item.item.offer.pictureUrl}"
              alt="{item.item.item.offer.title}"
              class="w-20 rounded-full mask mask-circle" />
            <div class="flex flex-col items-start w-full ml-2 space-y-2">
              <div class="flex flex-row justify-between w-full">
                <div class="md:text-md">
                  {item.item.item.offer.title}
                </div>
              </div>
              <div class="flex items-center justify-end w-full">
                <div class="flex-grow text-sm text-left text-dark-lightest">
                  1 {item.item.item.offer.unitTag
                    ? item.item.item.offer.unitTag.value
                    : "item"}
                </div>

                <div class="flex pr-8">
                  <input
                    type="text"
                    value="{item.item.item.amount}"
                    disabled
                    class="w-8 h-6 px-2 mx-2 text-sm text-center bg-gray-100 border rounded focus:outline-none" />
                </div>
                <div class="items-center">
                  <span class="whitespace-nowrap">
                    {item.item.item.offer.pricePerUnit} ⦿
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}

      <div class="flex flex-col p-2 bg-light-lighter ">
        <div
          class="flex flex-row items-center content-start space-x-4 text-base font-medium text-left ">
          <div class="inline-flex">
            <UserImage
              profile="{purchase.createdByProfile}"
              size="{10}"
              gradientRing="{false}" />
          </div>

          <div>
            {purchase.createdByProfile.firstName}
          </div>
        </div>
      </div>
    </div>
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
