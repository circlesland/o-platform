<script lang="ts">
  import ItemCard from "../../../shared/atoms/ItemCard.svelte";
  import { onMount } from "svelte";
  import { me } from "../../../shared/stores/me";
  import { BalancesByAssetDocument, AssetBalance } from "../data/api/types";
  import Card from "../../../shared/atoms/Card.svelte";
  import Web3 from "web3";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";
  import { push } from "svelte-spa-router";

  let loading = true;
  let balances: AssetBalance[] = [];

  onMount(async () => {
    const safeAddress = $me.circlesAddress;
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const balanceResult = await apiClient.query({
      query: BalancesByAssetDocument,
      variables: {
        safeAddress,
      },
    });
    if (balanceResult.errors?.length > 0) {
      throw new Error(`Couldn't read the balance of safe ${safeAddress}`);
    }
    balances = balanceResult.data.balancesByAsset;
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
        <div on:click="{() => push(`#/friends/${token.token_owner_address}`)}">
          <ItemCard
            params="{{ edgeless: false, imageUrl: !token.token_owner_profile || !token.token_owner_profile.avatarUrl ? AvataarGenerator.generate(token.token_owner_address) : token.token_owner_profile.avatarUrl, title: token.token_owner_profile ? `${token.token_owner_profile.firstName} ${token.token_owner_profile.lastName ? token.token_owner_profile.lastName : ''}` : token.tokenOwner, subTitle: token.token_owner_address, truncateMain: true, shadowMedium: true }}">

            <div slot="itemCardEnd">
              <div class="self-end text-right text-success">
                <span>
                  {Number.parseFloat(Web3.utils.fromWei(token.token_balance ? token.token_balance : '0', 'ether')).toFixed(2)}
                </span>
              </div>

            </div>
          </ItemCard>
        </div>
      {/if}
    {/each}
  {/if}
</div>
