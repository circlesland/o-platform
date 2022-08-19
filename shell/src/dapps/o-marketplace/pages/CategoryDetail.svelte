<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import { Offer } from "../../../shared/api/data/types";
import OfferCard from "../atoms/OfferCard.svelte";
import { onMount } from "svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Subscription } from "rxjs";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { _ } from "svelte-i18n";
import Label from "../../../shared/atoms/Label.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

export let category: number;
export let categoryName: string;

let isLoading: boolean;
let error: Error;
let offers: Offer[] = [];
let shellEventSubscription: Subscription;

async function load() {
  if (isLoading || !category) return;

  isLoading = true;
}

onMount(async () => {
  await load();

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

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" headerString="{categoryName}" />

<div class="px-4 mx-auto -mt-3 lg:w-2/3 xl:w-1/2">
  {#if isLoading}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>{$_("dapps.o-marketplace.pages.categoryDetail.loadingOffers" )}</div>
        </div>
      </div>
    </section>
  {:else if error}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>
            <b>{$_("dapps.o-marketplace.pages.categoryDetail.error" )}</b>
          </div>
        </div>
      </div>
    </section>
  {:else if offers.length}
    <div class="grid grid-cols-1 gap-x-4 gap-y-8 auto-rows-fr sm:grid-cols-2 marketplace-grid svelte-hq9rde">
      {#each offers as offer}
        <OfferCard offer="{offer}" />
      {/each}
    </div>
  {:else}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>{$_("dapps.o-marketplace.pages.categoryDetail.noOffers" )}</div>
        </div>
      </div>
    </section>
  {/if}
</div>
