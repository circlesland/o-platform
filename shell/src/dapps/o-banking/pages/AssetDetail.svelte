<script lang="ts">
  import { Token } from "../data/circles/types";
  import TokenCard from "../atoms/TokenCard.svelte";
  import XdaiAssetCard from "../atoms/XdaiAssetCard.svelte";

  import { mySafe } from "../stores/safe";
  import { BN } from "ethereumjs-util";
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
  import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
  import { me } from "../../../shared/stores/me";

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
        address: RpcGateway.get().eth.accounts.privateKeyToAccount(localStorage.getItem("circlesKey")).address,
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
        address: RpcGateway.get().utils.toChecksumAddress($me.circlesAddress),
        balance: parseFloat(
          RpcGateway.get()
            .utils.fromWei($mySafe.xDaiBalance, "ether")
            .toString()
        ).toFixed(2),
        variety: 1,
      };
    }

    tokens = Object.values($mySafe.acceptedTokens.tokens)
      .filter((o) => new BN(o.balance).gt(new BN("0")))
      .sort((a, b) =>
        new BN(a.balance).gt(new BN(b.balance))
          ? -1
          : new BN(a.balance).lt(new BN(b.balance))
          ? 1
          : 0
      );
  }
</script>

<SimpleHeader showBackArrow={true} />

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
    <section class="justify-center mb-4">
      <div
        class="flex flex-col infocard shadow p-4 w-full space-y-2 rounded-sm"
      >
        <div class="text-info text-xs font-circles font-bold text-left">
          WHAT IS THIS?
        </div>

        <div class="text-sm md:text-base">
          Your xDAI is distributed between two accounts. <br /><br />
          On the safeowner account you have xDai to pay your transaction fees.
          <br />
          0,25xDAI gives you 1000+ transactions.
          <br /><br />On the safe account you store your invite credits, that
          you can use to onboard other people.<br />
          For each invite your need a minimum of 0,10xDAI..
        </div>
      </div>
    </section>

    {#each [accountxDai, safexDai].sort( (a, b) => (parseFloat(a.balance) > parseFloat(b.balance) ? -1 : parseFloat(a.balance) < parseFloat(b.balance) ? 1 : 0) ) as token}
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
    {#each ($mySafe.token ? [$mySafe.token] : []).concat(tokens) as token}
      {#if token && token.balance > 0}
        <TokenCard
          {token}
          label="HOLDING CIRCLES FROM"
          colorClass="text-primary"
        />
      {/if}
    {/each}
  {/if}
</div>
