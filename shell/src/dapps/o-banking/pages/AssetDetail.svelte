<script lang="ts">
  import { Token } from "../data/circles/types";
  import TokenCard from "../atoms/TokenCard.svelte";
  import XdaiAssetCard from "../atoms/XdaiAssetCard.svelte";

  import { mySafe } from "../stores/safe";
  import { BN } from "ethereumjs-util";
  import AssetsHeader from "../atoms/AssetsHeader.svelte";
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

    tokens = Object.values($mySafe.acceptedTokens.tokens)
      .concat($mySafe.token ? [$mySafe.token] : [])
      .filter((o) => new BN(o.balance).gt(new BN("0")));
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
    <section class="justify-center mb-2">
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

    <section class="mb-8">
      <div class="bg-white shadow px-2 pb-8 w-full rounded-sm">
        <div class="mr-4  px-4 py-2  text-center -ml-3 text-secondary" />
        <div class="text-center">
          <p
            class="text-2xl mt-2 font-bold font-circles text-gradient w-full sm:w-96 m-auto"
          >
            Grow the global UBI economy!
          </p>
          <p class="text-lg font-circles mt-4">
            xxxxxxx/1.000.000.000 Progress
          </p>
          <div class="w-full px-2 m-auto">
            <progress
              class="progress progress-accent h-1 "
              value={12}
              max="100"
            />
          </div>
          <p class="text mt-4">
            Help others to get aboard in our <a
              href="https://discord.gg/33bPcyF5JN"
              target="_blank"
              class="btn-link">Discord</a
            >
            or
            <a href="/#/dashboard/become-a-hub" class="btn-link">become a hub</a
            > and invite your family and friends
          </p>
          <div class="mr-1 text-primary" />
        </div>
      </div>
    </section>
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
