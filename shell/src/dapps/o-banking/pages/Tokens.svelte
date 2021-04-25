<script lang="ts">
  import BankingHeader from "../atoms/BankingHeader.svelte";
  import { mySafe } from "../stores/safe";
  import { BN } from "ethereumjs-util";
  import TokenCard from "../atoms/TokenCard.svelte";
  import { Token } from "../data/circles/types";

  let accountxDai: Token = {
    _id: "",
    firstBlock: 0,
    tokenAddress: "",
    tokenOwner: "",
  };
  let safexDai: Token = {
    _id: "",
    firstBlock: 0,
    tokenAddress: "",
    tokenOwner: "",
  };
  $: {
    if ($mySafe.xDaiBalance) {
      safexDai = {
        _id: "1",
        tokenOwner: $mySafe.safeAddress,
        balance: $mySafe.xDaiBalance,
        firstBlock: 0,
        tokenAddress: "",
      };
    }
    if ($mySafe.accountxDai) {
      accountxDai = {
        _id: "1",
        tokenOwner: localStorage.getItem("circlesAccount") ?? "",
        balance: $mySafe.accountxDai,
        firstBlock: 0,
        tokenAddress: "",
      };
    }
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
    {#each [$mySafe.token]
      .concat(Object.values($mySafe.acceptedTokens.tokens))
      .filter(
        (token) => !new BN(token.balance).eq(new BN("0"))
      ) as token (token._id)}
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

  {#each [accountxDai].filter((token) => !new BN(token.balance).eq(new BN("0"))) as token (token._id)}
    <TokenCard
      {token}
      label="ACCOUNT XDAI BALANCE (used to pay for transactions)"
      colorClass="text-light"
    />
  {/each}

  {#each [safexDai].filter((token) => !new BN(token.balance).eq(new BN("0"))) as token (token._id)}
    <TokenCard
      {token}
      label="SAFE XDAI BALANCE (used to invite new people)"
      colorClass="text-light"
    />
  {/each}
</div>
