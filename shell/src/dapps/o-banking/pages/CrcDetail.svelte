<script lang="ts">
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import { onMount } from "svelte";
import { me } from "../../../shared/stores/me";
import Card from "../../../shared/atoms/Card.svelte";

import { push } from "svelte-spa-router";
import { displayCirclesAmount } from "src/shared/functions/displayCirclesAmount";
import {
  AssetBalance,
  AggregatesDocument,
  CrcBalances,
} from "../../../shared/api/data/types";

let loading = true;
let balances: AssetBalance[] = [];

onMount(async () => {
  const safeAddress = $me.circlesAddress;
  const apiClient = await window.o.apiClient.client.subscribeToResult();

  const balancesResult = await apiClient.query({
    query: AggregatesDocument,
    variables: {
      types: ["CrcBalances"],
      safeAddress: safeAddress,
    },
  });

  if (balancesResult.errors?.length > 0) {
    throw new Error(`Couldn't read the balance of safe ${safeAddress}`);
  }

  const crcBalances: CrcBalances = balancesResult.data.aggregates.find(
    (o) => o.type == "CrcBalances"
  );
  if (!crcBalances) {
    throw new Error(`Couldn't find the CrcBalances in the query result.`);
  }
  balances = crcBalances.payload.balances;
  loading = false;
});
</script>

<div class="p-5">
  <div class="w-full mb-4 text-center">
    <h1 class="uppercase font-heading">Individual Circles</h1>
  </div>
  {#if loading}
    <section class="flex items-center justify-center mb-2 ">
      <Card>
        <div class="flex flex-col items-start">
          <div>Loading Tokens...</div>
        </div>
      </Card>
    </section>
  {:else}
    {#each balances as token}
      {#if token && token.token_balance > 0}
        <div>
          <ItemCard
            params="{{
              edgeless: false,
              imageProfile: token.token_owner_profile
                ? token.token_owner_profile
                : {
                    circlesAddress: token.token_owner_address,
                  },
              title: token.token_owner_profile
                ? `${token.token_owner_profile.firstName} ${
                    token.token_owner_profile.lastName
                      ? token.token_owner_profile.lastName
                      : ''
                  }`
                : token.token_owner_address,
              subTitle: token.token_owner_profile
                ? token.token_owner_address
                : '',

              shadowSmall: true,
              noLink: true,
              endTextBig: displayCirclesAmount(
                token.token_balance ? token.token_balance : '0',
                null,
                true,
                $me.displayTimeCircles || $me.displayTimeCircles === undefined
              ),
            }}" />
        </div>
      {/if}
    {/each}
  {/if}
</div>
