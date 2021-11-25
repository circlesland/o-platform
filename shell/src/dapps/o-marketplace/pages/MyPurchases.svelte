<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import {
  AggregatesDocument,
  AggregateType,
  Offer,
  Purchase,
} from "../../../shared/api/data/types";
import { onMount } from "svelte";
import dayjs from "dayjs";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Subscription } from "rxjs";
import { me } from "../../../shared/stores/me";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import SimpleItemCard from "../atoms/SimpleItemCard.svelte";
import { push } from "svelte-spa-router";
import TransactionItemCard from "../atoms/TransactionItemCard.svelte";
import { displayableName } from "../../../shared/functions/stringHelper";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let isLoading: boolean;
let error: Error;
let purchases: Purchase[] = [];
let shellEventSubscription: Subscription;

async function load() {
  if (isLoading) return;

  const safeAddress = $me.circlesAddress;
  const apiClient = await window.o.apiClient.client.subscribeToResult();

  const purchasesResult = await apiClient.query({
    query: AggregatesDocument,
    variables: {
      types: [AggregateType.Purchases],
      safeAddress: safeAddress,
    },
  });

  if (purchasesResult.errors?.length > 0) {
    throw new Error(`Couldn't read the offers for safe ${safeAddress}`);
  }

  const o = purchasesResult.data.aggregates.find(
    (o) => o.type == AggregateType.Purchases
  );
  if (!o) {
    throw new Error(`Couldn't find the Purchases in the query result.`);
  }

  purchases = o.payload.purchases;
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
  {:else if purchases.length}
    {#each purchases as purchase}
      <section
        on:click="{() => push(`#/marketplace/my-purchases/${purchase.id}`)}"
        class="mb-3 cursor-pointer">
        <div
          class="flex items-center w-full space-x-2 bg-white rounded-lg shadow-sm">
          <div>
            <div
              class="relative w-16 h-16 overflow-hidden rounded-l-lg image-wrapper">
              <img
                src="{purchase.lines[0].offer.pictureUrl}"
                alt="{purchase.lines[0].offer.title}"
                class="absolute object-cover w-16 h-16 rounded-l-lg" />
            </div>
          </div>

          <div class="flex-col flex-grow">
            <div
              class="flex flex-row items-center justify-between px-3 text-left">
              <div class="flex-grow min-w-0">
                <h2 class="overflow-hidden text-base overflow-ellipsis">
                  {#if purchase.lines.length > 1}
                    {purchase.lines[0].offer.title} ..
                  {:else}
                    {purchase.lines[0].offer.title}
                  {/if}
                </h2>
              </div>
              <div
                class="text-xs text-right text-dark-lightest whitespace-nowrap leading-non">
                <span class="inline-block">
                  {dayjs(purchase.createdAt).format("DD.MM.YYYY")}</span>
              </div>
            </div>
            <div
              class="flex flex-row items-center justify-between px-3 text-left">
              <div class="flex-grow leading-none">
                <h2 class="overflow-hidden text-sm overflow-ellipsis">
                  {displayableName(
                    purchase.invoices[0].sellerProfile.firstName,
                    purchase.invoices[0].sellerProfile.lastName
                  )}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- 
      <SimpleItemCard
        params="{{
          imageUrl: purchase.lines[0].offer.pictureUrl,
          edgeless: true,

          title: `Purchase from ${dayjs(purchase.createdAt).format(
            'DD.MM.YYYY'
          )}`,
          action: () => push(`#/marketplace/my-purchases/${purchase.id}`),
          subTitle: `${purchase.lines
            .map((line) => line.offer.title)
            .join(', ')}`,
          endTextBig: `${purchase.total}  ⦿`,
          endTextBigClass: 'text-2xl',
          endTextSmall: 'paid, not yet picked up',
          class: 'cursor-pointer',
        }}" /> -->
      <!-- <pre>{JSON.stringify(purchase, null, 2)}</pre> -->
    {/each}
  {:else}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>No purchases</div>
        </div>
      </div>
    </section>
  {/if}
</div>
