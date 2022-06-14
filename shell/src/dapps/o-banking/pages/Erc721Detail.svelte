<script lang="ts">
import { onMount } from "svelte";

import {
  AggregatesDocument,
  AggregateType,
  Erc721Token,
  ProfileAggregate,
  QueryAggregatesArgs,
} from "../../../shared/api/data/types";

import UserImage from "../../../shared/atoms/UserImage.svelte";
import { ApiClient } from "../../../shared/apiConnection";
import { me } from "../../../shared/stores/me";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let loading = true;
let balances: Erc721Token[] = [];

onMount(async () => {
  const aggregates = await ApiClient.query<ProfileAggregate[], QueryAggregatesArgs>(AggregatesDocument, {
    types: [AggregateType.Erc721Tokens],
    safeAddress: $me.circlesAddress,
  });

  const erc721Balances: ProfileAggregate = aggregates.find((o) => o.type == AggregateType.Erc721Tokens);
  if (!erc721Balances || erc721Balances.payload.__typename !== AggregateType.Erc721Tokens) {
    throw new Error(`Couldn't find the Erc721Tokens in the query result.`);
  }

  balances = erc721Balances.payload.balances;
  loading = false;
});
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto -mt-3 lg:w-4/5 ">
  <div class="grid grid-cols-1 mb-10 gap-x-4 gap-y-8 auto-rows-fr sm:grid-cols-2 marketplace-grid">
    {#if balances}
      {#each balances as token}
        <section class="flex items-start pb-2 bg-white shadow-md rounded-xl">
          <div class="flex flex-col w-full ">
            <header class="cursor-pointer rounded-t-xl headerImageContainer" on:click="{() => {}}">
              <div class="relative rounded-t-xl image-wrapper">
                <img
                  src="{token.token_url ? token.token_url : '/images/market/circles-no-image.jpg'}"
                  alt="
          "
                  class="rounded-t-xl" />
                <div
                  class="absolute right-0 py-2 pt-3 pl-4 pr-2 mt-2 text-lg rounded-l-full font-enso top-2 bg-light-lightest">
                </div>
              </div>
            </header>
            <div
              class="relative flex flex-row items-center content-start p-2 space-x-4 text-base font-medium text-left bg-light-lighter">
              <div class="inline-flex">
                <UserImage profile="{$me}" size="{10}" gradientRing="{true}" />
              </div>
              <div>
                {token.token_name}
              </div>
            </div>
          </div>
        </section>
      {/each}
    {:else if !loading}
      No offers
    {/if}
  </div>
</div>

<style>
/* Ensure image is always 16:9 Ratio */
.headerImageContainer {
  max-width: none;
}

.image-wrapper {
  position: relative;
  /* padding-bottom: 56.2%;b 16:9 */
  padding-bottom: 100%; /* 4:3 */
}

.image-wrapper img {
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
