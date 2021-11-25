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
import SimpleItemCard from "../atoms/SimpleItemCard.svelte";
import { push } from "svelte-spa-router";
import TransactionItemCard from "../atoms/TransactionItemCard.svelte";
import { displayableName } from "../../../shared/functions/stringHelper";

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

<div class="px-4 mx-auto -mt-3 md:w-2/3 xl:w-1/2">
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
      <SimpleItemCard
        params="{{
          imageUrl: sale.lines[0].offer.pictureUrl,
          edgeless: true,

          title: `Sale to ${displayableName(
            sale.buyerProfile.firstName,
            sale.buyerProfile.lastName
          )} - ${dayjs(sale.createdAt).format('DD.MM.YYYY')}`,
          action: () => push(`#/marketplace/my-sales/${sale.id}`),
          subTitle: `${sale.lines.map((line) => line.offer.title).join(', ')}`,
          endTextBig: `${sale.total}  ⦿`,
          endTextBigClass: 'text-2xl',
          endTextSmall: 'paid, not yet picked up',
          class: 'cursor-pointer',
        }}" />
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
