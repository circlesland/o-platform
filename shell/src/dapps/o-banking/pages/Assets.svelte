<script lang="ts">
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
  import { mySafe } from "../stores/safe";
  import { BN } from "ethereumjs-util";
  import AssetCard from "../atoms/AssetCard.svelte";
  import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";

  let xdai: { [x: string]: any } = {
    symbol: "xdai",
    icon: "",
    title: "xDAI",
    balance: "0",
    variety: 1,
  };
  /*
  let safexDai = {
    symbol: "xdai",
    icon: "",
    balance: "0",
    variety: 1,
  };
   */
  let circles = {
    symbol: "crc",
    icon: "",
    title: "Circles",
    balance: "0",
    variety: 1,
  };
  $: {
    if ($mySafe && $mySafe.accountxDai) {
      xdai = {
        symbol: "xdai",
        icon: "",
        title: "xDAI",
        balance: "ß",
        variety: 1,
      };
      xdai.balance =
        parseFloat(
          RpcGateway.get()
            .utils.fromWei($mySafe.accountxDai, "ether")
            .toString()
        ) +
        parseFloat(
          RpcGateway.get()
            .utils.fromWei($mySafe.xDaiBalance, "ether")
            .toString()
        );
    }
    if ($mySafe && $mySafe.acceptedTokens) {
      circles = {
        symbol: "crc",
        icon: "",
        title: "Circles",
        balance: $mySafe.balance,
        variety: Object.values($mySafe.acceptedTokens.tokens).filter((o) =>
          new BN(o.balance).gt(new BN("0"))
        ).length,
      };
    }
  }
</script>

<SimpleHeader />

<div class="mx-4 -mt-6">
  <section class="justify-center mb-2">
    <div class="flex flex-col infocard shadow p-4 w-full space-y-2 rounded-sm">
      <div class="text-info text-xs font-circles font-bold text-left">
        WHAT IS THIS?
      </div>

      <div class="text-sm md:text-base">
        Since everyone has their own personalized Circles money, you will always
        only be able to receive and hold Circles of those you directly trust.
        <br /><br />To see which personalized Circles you are currently holding,
        click onto the Circles Card.
        <br /><br />xDai is the currency that is used to invite others and pay
        transaction fees.
      </div>
    </div>
  </section>

  {#if !$mySafe || !$mySafe.token || !$mySafe.acceptedTokens}
    <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
      <div class="flex items-center bg-white shadow p-4 w-full space-x-2 ">
        <div class="flex flex-col items-start">
          <div>Loading Tokens...</div>
        </div>
      </div>
    </section>
  {:else}
    {#each [circles, xdai] as token}
      <AssetCard
        symbol={token.symbol}
        title={token.title}
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
  {#each [xdai].filter((token) => !new BN(token.balance).eq(new BN("0"))) as token (token._id)}
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
