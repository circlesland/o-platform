<script lang="ts">
  import {Token} from "../data/circles/types";
  import TokenCard from "../atoms/TokenCard.svelte";
  import {mySafe} from "../stores/safe";
  import {BN} from "ethereumjs-util";
  import BankingHeader from "../atoms/BankingHeader.svelte";

  export let params: {
    symbol: string
  };
  let tokens: Token[];
  $: {
    tokens = Object.values($mySafe.acceptedTokens.tokens).filter(o => new BN(o.balance).gt(new BN("0")))
  }
</script>

<BankingHeader balance={$mySafe && $mySafe.balance ? $mySafe.balance : "0"} />

<div class="mx-4 -mt-6">
  {#if !$mySafe || !$mySafe.token || !$mySafe.acceptedTokens}
    <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
      <div class="flex items-center bg-white shadow p-4 w-full space-x-2 ">
        <div class="flex flex-col items-start">
          <div>Loading Tokens...</div>
        </div>
      </div>
    </section>
  {:else}
    {#each tokens as token}
      <TokenCard
        {token}
        label="HOLDING TOKENS FROM"
        colorClass="text-primary"
      />
    {/each}
  {/if}

  {#if $mySafe && $mySafe.acceptedTokens && $mySafe.acceptedTokens.tokens}
    {#each [$mySafe.token].concat(Object.values($mySafe.acceptedTokens.tokens).filter((o) => o.limit > 0)) as token (token._id)}
      <TokenCard
        {token}
        label="ACCEPTING TOKENS FROM"
        colorClass="text-secondary"
      />
    {/each}
  {/if}
</div>
