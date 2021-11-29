<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import {
  AggregateType,
  Offer, Offers
} from "../../../shared/api/data/types";
import { onMount } from "svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import {of, Subscription} from "rxjs";
import { me } from "../../../shared/stores/me";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import TransactionItemCard from "../atoms/TransactionItemCard.svelte";
import {ApiClient} from "../../../shared/apiConnection";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let isLoading: boolean;
let error: Error;
let offers: Offer[] = [];
let shellEventSubscription: Subscription;

async function load() {
  if (isLoading) return;
  if (!$me.circlesAddress) {
    isLoading = false;
    offers = [];
    return;
  }
  const result = await ApiClient.queryAggregate<Offers>(AggregateType.Offers, $me.circlesAddress);
  offers = result.offers;
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
          <div>Loading offers...</div>
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
  {:else if offers.length}
    {#each offers as offer}
      <TransactionItemCard offer="{offer}" />
    {/each}
  {:else}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>No offers</div>
        </div>
      </div>
    </section>
  {/if}
</div>
