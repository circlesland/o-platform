<script lang="ts">
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
  import Card from "src/shared/atoms/Card.svelte";
  import { mySafe } from "../stores/safe";
  import { BN } from "ethereumjs-util";
  import AssetCard from "../atoms/AssetCard.svelte";
  import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  let xdai: { [x: string]: any } = {
    symbol: "xdai",
    icon: "",
    title: "xDAI",
    balance: "0",
    variety: 1,
    description: "1 xDai  ~ 1 USD",
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
    description: "1 Circle = 1€",
  };
  $: {
    if ($mySafe && $mySafe.accountxDai) {
      xdai = {
        symbol: "xdai",
        icon: "",
        title: "xDAI",
        balance: "ß",
        variety: 1,
        description: "1 xDai  ~ 1 USD",
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
        description: "1 Circle = 1€",
      };
    }
  }
</script>

<SimpleHeader {runtimeDapp} {routable} />

<div class="px-4 mx-auto -mt-3 md:w-2/3 xl:w-1/2">

  {#if !$mySafe || !$mySafe.token || !$mySafe.acceptedTokens}
    <section class="flex items-center justify-center mb-2 ">
      <Card>
        <div class="flex flex-col items-start">
          <div>Loading Tokens...</div>
        </div>
      </Card>
    </section>
  {:else}
    {#each [circles, xdai] as token}
      <AssetCard
        symbol={token.symbol}
        title={token.title}
        balance={token.balance}
        variety={token.variety}
        description={token.description}
      />
    {/each}
  {/if}
</div>
