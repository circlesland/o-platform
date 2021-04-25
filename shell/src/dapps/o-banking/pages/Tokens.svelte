<script lang="ts">
  import TokensHeader from "../atoms/TokensHeader.svelte";
  import { mySafe } from "../stores/safe";
  import { BN } from "ethereumjs-util";
  import TokenCard from "../atoms/TokenCard.svelte";
  import {Token} from "../data/circles/queries";

  let accountxDai:Token = {
    _id: "",
    firstBlock: 0,
    tokenAddress: "",
    tokenOwner: ""
  };
  let safexDai:Token = {
    _id: "",
    firstBlock: 0,
    tokenAddress: "",
    tokenOwner: ""
  };
  $: {
    if ($mySafe.xDaiBalance) {
      safexDai = {
        _id: "1",
        tokenOwner: $mySafe.safeAddress,
        balance: $mySafe.xDaiBalance,
        firstBlock: 0,
        tokenAddress: ""
      }
    }
    if ($mySafe.accountxDai) {
      accountxDai = {
        _id: "1",
        tokenOwner: localStorage.getItem("circlesAccount") ?? "",
        balance: $mySafe.accountxDai,
        firstBlock: 0,
        tokenAddress: ""
      }
    }
  }
</script>

<TokensHeader />

<div class="mx-4 -mt-6">
  <h1>Your account's xDai balance (used to pay for transactions)</h1>
  {#each [accountxDai].filter((token) => !new BN(token.balance).eq(new BN("0"))) as token(token._id)}
    <TokenCard {token} />
  {/each}

  <h1>Your safes's xDai balance (used to invite new people)</h1>
  {#each [safexDai].filter((token) => !new BN(token.balance).eq(new BN("0"))) as token(token._id)}
    <TokenCard {token} />
  {/each}

  {#if !$mySafe || !$mySafe.token || !$mySafe.acceptedTokens}
    <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
      <div class="flex items-center bg-white shadow p-4 w-full space-x-2 ">
        <div class="flex flex-col items-start">
          <div>Loading Tokens...</div>
        </div>
      </div>
    </section>
  {:else}
    <h1>You hold Circles from</h1>
    {#each [$mySafe.token].concat(Object.values($mySafe.acceptedTokens.tokens)).filter((token) => !new BN(token.balance).eq(new BN("0"))) as token(token._id)}
      <TokenCard {token} />
    {/each}
  {/if}

  <h1>You accept Circles from</h1>
  {#if $mySafe && $mySafe.acceptedTokens && $mySafe.acceptedTokens.tokens}
    {#each [$mySafe.token].concat(Object.values($mySafe.acceptedTokens.tokens).filter(o => o.limit > 0)) as token(token._id)}
      <TokenCard {token} />
    {/each}
  {/if}
</div>
