<script lang="ts">
import {
  AggregatesDocument,
  AggregateType,
  Profile,
  Sale,
} from "../../../shared/api/data/types";
import { onMount } from "svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Subscription } from "rxjs";
import { me } from "../../../shared/stores/me";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import dayjs from "dayjs";
import UserImage from "src/shared/atoms/UserImage.svelte";
import Date from "../../../shared/atoms/Date.svelte";
import { displayableName } from "../../../shared/functions/stringHelper";
export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let id: string;

let isLoading: boolean;
let error: Error;
let buyerProfile: Profile;
let sale: Sale;
let shellEventSubscription: Subscription;
let groupedItems;
let invoiceData;

async function load() {
  if (isLoading) return;

  const safeAddress = $me.circlesAddress;
  const apiClient = await window.o.apiClient.client.subscribeToResult();

  const saleResult = await apiClient.query({
    query: AggregatesDocument,
    variables: {
      types: [AggregateType.Sales],
      safeAddress: safeAddress,
      filter: {
        sales: {
          salesIds: [parseInt(id)],
        },
      },
    },
  });

  if (saleResult.errors?.length > 0) {
    throw new Error(`Couldn't read the offers for safe ${safeAddress}`);
  }

  const o = saleResult.data.aggregates.find(
    (o) => o.type == AggregateType.Sales
  );
  if (!o) {
    throw new Error(`Couldn't find the Sales in the query result.`);
  }

  sale = o.payload.sales[0];
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

  groupedItems = sale ? orderItems(sale.lines) : {};
  buyerProfile = sale?.buyerProfile;

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
      <h1 class="text-3xl uppercase font-heading">Sale Details</h1>
    </div>
    <div class="w-full text-center">
      {#if sale}
        <span class="text-dark-lightest"
          >Sale Date: <Date time="{sale.createdAt}" /></span>
      {/if}
    </div>
  </header>
  {#if isLoading}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>Loading sales...</div>
        </div>
      </div>
    </section>
  {:else if groupedItems}
    <!-- <CartItems cartContents="{sale.lines}" editable="{false}" /> -->
    <!-- <pre>{JSON.stringify(sale, null, 2)}</pre> -->

    <div class="mt-6">
      <div class="flex flex-row items-stretch p-2 mb-6 bg-light-lighter">
        <div
          class="flex flex-row items-center content-start self-end space-x-2 text-base font-medium text-left ">
          <div class="inline-flex">
            <UserImage
              profile="{buyerProfile}"
              size="{5}"
              gradientRing="{false}" />
          </div>

          <div>
            {buyerProfile.firstName}
          </div>
        </div>
      </div>
      {#each groupedItems as groupSale, i}
        <div
          class="flex items-center justify-between w-full pb-6 mb-6 border-b">
          <div class="flex items-center w-full">
            <img
              src="{groupSale.item.item.offer.pictureUrl}"
              alt="{groupSale.item.item.offer.title}"
              class="w-20 rounded-full mask mask-circle" />
            <div class="flex flex-col items-start w-full ml-2 space-y-2">
              <div class="flex flex-row justify-between w-full">
                <div class="md:text-md">
                  <a
                    href="#/marketplace/offer/{groupSale.item.item.offer
                      .id}"
                    alt="{groupSale.item.item.offer.title}">
                    {groupSale.item.item.offer.title}
                  </a>
                </div>
              </div>
              <div class="flex items-center justify-end w-full">
                <div class="flex-grow text-sm text-left text-dark-lightest">
                  1 {groupSale.item.item.offer.unitTag
                    ? groupSale.item.item.offer.unitTag.value
                    : "item"}
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
                    {groupSale.item.item.offer.pricePerUnit} ⦿
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
    {#each sale.invoices as invoice}
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
            <h1 class="uppercase text-8xl font-heading">
              No pickup code yet ..
            </h1>
          {:else}
            <h1 class="uppercase text-8xl font-heading">
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
  {/if}
</div>

<!-- {#if isLoading}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>Loading sales...</div>
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
  {:else if sale}
    <pre>{JSON.stringify(sale, null, 2)}</pre> -->
<!-- {#each sales as sale}
      <SimpleItemCard
        params="{{
          imageUrl: sale.lines[0].offer.pictureUrl,
          edgeless: true,

          title: `Sale from ${dayjs(sale.createdAt).format(
            'DD.MM.YYYY'
          )}`,
          action: () => push(`#/marketplace/sale/${sale.id}`),
          subTitle: `${sale.lines
            .map((line) => line.offer.title)
            .join(', ')}`,
          endTextBig: `${sale.total}  ⦿`,
          endTextBigClass: 'text-2xl',
          endTextSmall: 'paid, not yet picked up',
          class: 'cursor-pointer',
        }}" />
     <pre>{JSON.stringify(sale, null, 2)}</pre>
    {/each} -->
<!-- {:else}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>No sales</div>
        </div>
      </div>
    </section>
  {/if}
</div> -->
