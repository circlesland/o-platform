<script lang="ts">
  import BankingHeader from "../atoms/BankingHeader.svelte";
  import { mySafe } from "../stores/safe";
  import { BN } from "ethereumjs-util";
  import AssetCard from "../atoms/AssetCard.svelte";
  import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";

  let accountxDai = {
    symbol: "xdai",
    icon: "",
    balance: "0",
    variety: 1
  };
  let safexDai = {
    symbol: "xdai",
    icon: "",
    balance: "0",
    variety: 1
  };
  let circles = {
    symbol: "crc",
    icon: "",
    balance: "0",
    variety: 1
  };
  $: {
    accountxDai = {
      symbol: "xdai",
      icon: "",
      balance: parseFloat(RpcGateway.get().utils.fromWei($mySafe.accountxDai, "ether").toString()).toFixed(2),
      variety: 1
    };
    safexDai = {
      symbol: "xdai",
      icon: "",
      balance: parseFloat(RpcGateway.get().utils.fromWei($mySafe.xDaiBalance, "ether").toString()).toFixed(2),
      variety: 1
    };
    circles = {
      symbol: "crc",
      icon: "",
      balance: $mySafe.balance,
      variety: Object.values($mySafe.acceptedTokens.tokens).filter(o => new BN(o.balance).gt(new BN("0"))).length
    };
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
    {#each [accountxDai, safexDai, circles] as token}
      <AssetCard
        symbol={token.symbol}
        balance={token.balance}
        variety={token.variety}
        colorClass="text-primary"
      />
    {/each}
  {/if}
<!--
  {#if $mySafe && $mySafe.acceptedTokens && $mySafe.acceptedTokens.tokens}
    {#each [$mySafe.token].concat(Object.values($mySafe.acceptedTokens.tokens).filter((o) => o.limit > 0)) as token (token._id)}
      <TokenCard
        {token}
        label="ACCEPTING TOKENS FROM"
        colorClass="text-secondary"
      />
    {/each}
  {/if}
-->
  <!--
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
-->
</div>