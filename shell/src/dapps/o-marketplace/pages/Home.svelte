<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import OfferCard from "../atoms/OfferCard.svelte";
import { onMount } from "svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Subscription } from "rxjs";

import { push } from "svelte-spa-router";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import List from "../../../shared/molecules/Lists/List.svelte";

import {
  Offer,
  TagsDocument,
} from "../../../shared/api/data/types";

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

  isLoading = true;
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const result = await apiClient.query({
    query: OffersDocument,
    variables: {},
  });
  if (result.errors && result.errors.length) {
    error = new Error(
      `An error occurred while the offer was loaded: ${JSON.stringify(
        result.errors
      )}`
    );
    throw error;
  }
  citites = result.data.offers.reduce((p, c) => {
    if (!p[c.city.name]) {
      p[c.city.name] = [];
    }
    p[c.city.name].push(c);
    return p;
  }, {});
  offers = result.data.offers;

  const categoryResult = await apiClient.query({
    query: TagsDocument,
    variables: {
      typeId_in: ["o-marketplace:offer:category:1"],
    },
  });
  if (categoryResult.errors && categoryResult.errors.length) {
    error = new Error(
      `An error occurred while loading the categories: ${JSON.stringify(
        categoryResult.errors
      )}`
    );
    throw error;
  }
  categories = categoryResult.data.tags;
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
  <div
    class="grid grid-cols-1 gap-x-4 gap-y-8 auto-rows-fr sm:grid-cols-2 marketplace-grid">
    <List
      listItemType="{Offer}"
      listItemComponent="{OfferCard}"
      fetchQuery="{OffersDocument}"
      fetchQueryArguments="{listArguments}"
      dataKey="offers"
      dataLimit="{100}" />
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
