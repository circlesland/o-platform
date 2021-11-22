<script lang="ts">
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import { onMount } from "svelte";
import { me } from "../../../shared/stores/me";
import Card from "../../../shared/atoms/Card.svelte";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";

import {
  AssetBalance,
  AggregatesDocument,
  Erc20Balances,
} from "../../../shared/api/data/types";

let loading = true;
let balances: AssetBalance[] = [];

onMount(async () => {
  const safeAddress = $me.circlesAddress;
  const apiClient = await window.o.apiClient.client.subscribeToResult();

  const balancesResult = await apiClient.query({
    query: AggregatesDocument,
    variables: {
      types: ["Erc20Balances"],
      safeAddress: safeAddress,
    },
  });

  if (balancesResult.errors?.length > 0) {
    throw new Error(`Couldn't read the balance of safe ${safeAddress}`);
  }

  const erc20Balances: Erc20Balances = balancesResult.data.aggregates.find(
    (o) => o.type == "Erc20Balances"
  );
  if (!erc20Balances) {
    throw new Error(`Couldn't find the Erc20Balances in the query result.`);
  }
  balances = erc20Balances.payload.balances;
  loading = false;
});
</script>

<div class="p-5">
  <div class="w-full mb-4 text-center">
    <h1 class="uppercase font-heading">ERC-20 tokens</h1>
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
            params={{
              edgeless: false,
              imageProfile: {
                circlesAddress: token.token_address,
              },
              title: 'ERC-20',
              subTitle: token.token_address,
              shadowSmall: true,
              noLink: true,
              endTextBig: RpcGateway.get().utils.fromWei(token.token_balance, "ether")
          }} />
        </div>
      {/if}
    {/each}
  {/if}
</div>
