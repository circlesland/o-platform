<script lang="ts">
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
  import { mySafe } from "../stores/safe";
  import { BN } from "ethereumjs-util";
  import AssetCard from "../atoms/AssetCard.svelte";
  import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";

  export let runtimeDapp:RuntimeDapp<any>;
  export let routable:Routable;

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

<SimpleHeader {runtimeDapp} {routable} />

<div class="mx-4 -mt-6">
  <section class="justify-center mb-2">
    <div class="flex flex-col w-full p-4 space-y-2 rounded-sm shadow infocard">
      <div class="text-xs font-bold text-left text-info ">WHAT IS THIS?</div>

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
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
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
      />
    {/each}
  {/if}
</div>
