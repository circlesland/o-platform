<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import {
  AggregatesDocument,
  AggregateType,
  Offer,
  Sale,
} from "../../../shared/api/data/types";
import { onMount } from "svelte";
import dayjs from "dayjs";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Subscription } from "rxjs";
import { me } from "../../../shared/stores/me";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { push } from "svelte-spa-router";
import { displayableName } from "../../../shared/functions/stringHelper";
import Icons from "../../../shared/molecules/Icons.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let isLoading: boolean;
let error: Error;
let sales: Sale[] = [];
let shellEventSubscription: Subscription;

async function load() {
  if (isLoading) return;

  const safeAddress = $me.circlesAddress;
  const apiClient = await window.o.apiClient.client.subscribeToResult();

  const salesResult = await apiClient.query({
    query: AggregatesDocument,
    variables: {
      types: [AggregateType.Sales],
      safeAddress: safeAddress,
    },
  });

  if (salesResult.errors?.length > 0) {
    throw new Error(`Couldn't read the offers for safe ${safeAddress}`);
  }

  const o = salesResult.data.aggregates.find(
    (o) => o.type == AggregateType.Sales
  );
  if (!o) {
    throw new Error(`Couldn't find the Sales in the query result.`);
  }

  sales = o.payload.sales;
  console.log(sales);
  isLoading = false;
}

onMount(async () => {
  await load();

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

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2">
  {#if isLoading}
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
  {:else if sales.length}
    {#each sales as sale}
      <section
        on:click="{() => push(`#/marketplace/my-sales/${sale.id}`)}"
        class="mb-3 cursor-pointer">
        <div
          class="flex items-center w-full space-x-2 bg-white rounded-lg shadow-sm">
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
                class:text-inactive="{!sale.invoices[0].paymentTransactionHash}"
                class:text-success="{sale.invoices[0].paymentTransactionHash}">
                <span>paid</span>
                {#if sale.invoices[0].paymentTransactionHash}
                  <Icons icon="check" size="{4}" customClass="inline" />
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
              <div class="text-xs text-inactive">
                <span>picked up</span>
                <!-- <Icons icon="check" size="{4}" customClass="inline" /> -->
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- <SimpleItemCard
        params="{{
          imageUrl: sale.lines[0].offer.pictureUrl,
          edgeless: true,

          title: `${displayableName(
            sale.buyerProfile.firstName,
            sale.buyerProfile.lastName
          )} - ${dayjs(sale.createdAt).format('DD.MM.YYYY')}`,
          action: () => push(`#/marketplace/my-sales/${sale.id}`),
          subTitle: `${sale.lines.map((line) => line.offer.title).join(', ')}`,
          endTextBig: '',
          endTextBigClass: 'text-2xl',
          endTextSmall: 'paid, not yet picked up',
          class: 'cursor-pointer',
        }}" /> -->
      <!-- <pre>{JSON.stringify(sale, null, 2)}</pre> -->
    {/each}
  {:else}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>No sales</div>
        </div>
      </div>
    </section>
  {/if}
</div>
