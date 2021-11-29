<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import OfferCard from "../atoms/OfferCard.svelte";
import { onMount } from "svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Subscription } from "rxjs";

import { push } from "svelte-spa-router";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import {
  AggregateType,
  Offer,
  Offers, QueryTagsInput, Tag,
  TagsDocument,
} from "../../../shared/api/data/types";
import { me } from "../../../shared/stores/me";
import {ApiClient} from "../../../shared/apiConnection";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

const listArguments = {};

let isLoading: boolean;
let error: Error;
let offers: Offer[] = [];
let citites: {
  [name: string]: Offer[];
} = {};
let categories: string[] = [];
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

  /*
  citites = offers.reduce((p, c) => {
    if (!p[c.city.name]) {
      p[c.city.name] = [];
    }
    p[c.city.name].push(c);
    return p;
  }, {});
 */

  const categoryResult = await ApiClient.query<Tag[], QueryTagsInput>(TagsDocument, {
    typeId_in: ["o-marketplace:offer:category:1"]
  });
  categories = categoryResult.map(o => o.value);
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

function loadCategoryPage(category: any) {
  push("#/marketplace/categories/" + category.id + "/" + category.value);
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto -mt-3 lg:w-2/3 xl:w-1/2">
  <!-- <div class="flex flex-wrap items-stretch space-x-4 space-y-8"> -->
  <div
    class="grid grid-cols-1 mb-20 gap-x-4 gap-y-8 auto-rows-fr sm:grid-cols-2 marketplace-grid">
    <!--
    <List
      listItemType="{Offer}"
      listItemComponent="{OfferCard}"
      fetchQuery="{OffersDocument}"
      fetchQueryArguments="{listArguments}"
      dataKey="offers"
      dataLimit="{100}" />-->
    {#if offers}
      {#each offers as offer}
        <OfferCard param="{offer}" />
      {/each}
    {/if}
  </div>
</div>

<style>
.marketplace-grid {
  grid-template-columns: repeat(1, minmax(8rem, 1fr));
  grid-auto-rows: 1fr;
}

@media (min-width: 640px) {
  .marketplace-grid {
    grid-template-columns: repeat(2, minmax(8rem, 1fr));
  }
}

.marketplace-grid::before {
  content: "";
  width: 0;
  padding-bottom: 100%;
  grid-row: 1 / 1;
  grid-column: 1 / 1;
  display: none;
}

:global(.marketplace-grid > *:first-child) {
  grid-row: 1 / 1;
  grid-column: 1 / 1;
}
</style>
