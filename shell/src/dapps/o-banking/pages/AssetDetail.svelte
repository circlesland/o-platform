<script lang="ts">
  import { Token } from "../data/circles/types";
  import TokenCard from "../atoms/TokenCard.svelte";
  import XdaiAssetCard from "../atoms/XdaiAssetCard.svelte";

  import { mySafe } from "../stores/safe";
  import { BN } from "ethereumjs-util";
  import AssetsHeader from "../atoms/AssetsHeader.svelte";
  import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
  import {me} from "../../../shared/stores/me";

  export let params: {
    symbol: string;
  };

  let accountxDai = {
    symbol: "xdai",
    icon: "",
    balance: "0",
    address: "0",
    variety: 1,
    title: "",
  };
  let safexDai = {
    symbol: "xdai",
    icon: "",
    balance: "0",
    address: "0",
    variety: 1,
    title: "",
  };

  let tokens: Token[];

  $: {
    if (params.symbol == "xdai" && $mySafe && $mySafe.accountxDai) {
      accountxDai = {
        symbol: "xdai",
        icon: "",
        address: $me.circlesSafeOwner,
        title: "Safe owner",
        balance: parseFloat(
          RpcGateway.get()
            .utils.fromWei($mySafe.accountxDai, "ether")
            .toString()
        ).toFixed(2),
        variety: 1,
      };
    }
    if (params.symbol == "xdai" && $mySafe && $mySafe.xDaiBalance) {
      safexDai = {
        symbol: "xdai",
        icon: "",
        title: "Safe",
        address: $me.circlesAddress,
        balance: parseFloat(
          RpcGateway.get()
            .utils.fromWei($mySafe.xDaiBalance, "ether")
            .toString()
        ).toFixed(2),
        variety: 1,
      };
    }

    tokens = Object.values($mySafe.acceptedTokens.tokens).concat($mySafe.token ? [$mySafe.token] : []).filter((o) =>
      new BN(o.balance).gt(new BN("0"))
    );
  }
</script>

<AssetsHeader />

<div class="mx-4 -mt-6">
  {#if !$mySafe || !$mySafe.token || !$mySafe.acceptedTokens}
    <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
      <div class="flex items-center bg-white shadow p-4 w-full space-x-2 ">
        <div class="flex flex-col items-start">
          <div>Loading Tokens...</div>
        </div>
      </div>
    </section>
  {:else if params && params.symbol == "xdai"}
    {#each [accountxDai, safexDai] as token}
      <XdaiAssetCard
        address={token.address}
        title={token.title}
        symbol={token.symbol}
        balance={token.balance}
        variety={token.variety}
        colorClass="text-primary"
      />
    {/each}
  {:else}
    {#each tokens as token}
      {#if token && token.balance > 0}
        <TokenCard
          {token}
          label="HOLDING TOKENS FROM"
          colorClass="text-primary"
        />
      {/if}
    {/each}
  {/if}
</div>
