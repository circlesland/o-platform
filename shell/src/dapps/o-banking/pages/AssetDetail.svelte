<script lang="ts">
  import { Token } from "../data/circles/types";
  import { push } from "svelte-spa-router";
  import ItemCard from "../../../shared/atoms/ItemCard.svelte";
  import Web3 from "web3";
  import { INVITE_VALUE } from "src/dapps/o-passport/processes/invite/invite";
  import { mySafe } from "../stores/safe";
  import { BN } from "ethereumjs-util";
  import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
  import { me } from "../../../shared/stores/me";

  export let symbol: string;

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
  let presets = [10, 20, 50];

  $: {
    symbol = symbol;

    if (symbol == "xdai" && $mySafe && $mySafe.accountxDai) {
      accountxDai = {
        symbol: "xdai",
        icon: "",
        address: RpcGateway.get().eth.accounts.privateKeyToAccount(
          localStorage.getItem("circlesKey")
        ).address,
        title: "Owner",
        balance: parseFloat(
          RpcGateway.get()
            .utils.fromWei($mySafe.accountxDai, "ether")
            .toString()
        ).toFixed(2),
        variety: 1,
      };
    }
    if (symbol == "xdai" && $mySafe && $mySafe.xDaiBalance) {
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
      .filter(o => new BN(o.balance).gt(new BN("0")))
      .sort((a, b) =>
        new BN(a.balance).gt(new BN(b.balance))
          ? -1
          : new BN(a.balance).lt(new BN(b.balance))
          ? 1
          : 0
      );
  }

  function loadDetailPage(path) {
    push(`#/friends/${path}`);
  }
</script>

<div class="mx-4 mt-4">
  {#if !$mySafe || !$mySafe.token || !$mySafe.acceptedTokens}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>Loading Tokens...</div>
        </div>
      </div>
    </section>
  {:else if symbol == 'xdai'}
    <section class="justify-center mb-4">
      <div
        class="flex flex-col w-full p-4 space-y-2 rounded-sm shadow infocard">
        <div class="text-xs font-bold text-left text-info ">WHAT IS THIS?</div>

        <div class="text-sm md:text-base">
          Your xDAI is distributed between two accounts.
          <br />
          <br />
          On the safeowner account you have xDai to pay your transaction fees.
          <br />
          0,25xDAI gives you 1000+ transactions.
          <br />
          <br />
          On the safe account you store your invite credits, that you can use to
          onboard other people.
          <br />
          For each invite your need a minimum of 0,10xDAI..
        </div>
      </div>
    </section>
    <div class="w-full mb-4 text-center">
      <h1 class="uppercase font-heading">Xdai</h1>
    </div>

    {#each [accountxDai, safexDai].sort((a, b) =>
      parseFloat(a.balance) > parseFloat(b.balance)
        ? -1
        : parseFloat(a.balance) < parseFloat(b.balance)
        ? 1
        : 0
    ) as token}
      <ItemCard
        params="{{ edgeless: false, imageUrl: '/logos/xdai.png', title: token.title, subTitle: token.address, truncateMain: true }}">

        <div slot="itemCardEnd">
          <div class="self-end text-right text-success">
            <span>{Number.parseFloat(token.balance).toFixed(2)}</span>
          </div>

        </div>
      </ItemCard>
    {/each}
  {:else}
    <div class="w-full mb-4 text-center">
      <h1 class="uppercase font-heading">Individual Circles</h1>
    </div>
    {#each ($mySafe.token ? [$mySafe.token] : []).concat(tokens) as token}
      {#if token && token.balance > 0}
        <div on:click="{() => loadDetailPage(token.tokenOwner)}">
          <ItemCard
            params="{{ edgeless: false, imageUrl: token.ownerProfile ? token.ownerProfile.avatarUrl : '', title: token.ownerProfile ? token.ownerProfile.displayName : token.tokenOwner, subTitle: token.tokenOwner, truncateMain: true, shadowMedium: true }}">

            <div slot="itemCardEnd">
              <div class="self-end text-right text-success">
                <span>
                  {Number.parseFloat(Web3.utils.fromWei(token.balance ? token.balance : '0', 'ether')).toFixed(2)}
                </span>
              </div>

            </div>
          </ItemCard>
        </div>
      {/if}
    {/each}
  {/if}
</div>
