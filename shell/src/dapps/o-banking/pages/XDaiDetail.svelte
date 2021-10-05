<script lang="ts">
  import ItemCard from "../../../shared/atoms/ItemCard.svelte";
  import { onMount } from "svelte";
  import { KeyManager } from "../../o-passport/data/keyManager";
  import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
  import { BN } from "ethereumjs-util";
  import { me } from "../../../shared/stores/me";
  import Web3 from "web3";

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

  onMount(async () => {
    const safeAddress = $me.circlesAddress;
    const safeBalance = await RpcGateway.get().eth.getBalance(safeAddress);
    const km = new KeyManager(safeAddress);
    await km.load();
    const eoaBalance = await RpcGateway.get().eth.getBalance(
      km.torusKeyAddress
    );

    const safeBalanceAmount = Number.parseFloat(
      Web3.utils.fromWei(new BN(safeBalance).toString(), "ether")
    ).toFixed(2);

    safexDai.balance = safeBalanceAmount;
    safexDai.title = "Safe";
    safexDai.address = safeAddress;

    const eoaBalanceAmount = Number.parseFloat(
      Web3.utils.fromWei(new BN(eoaBalance).toString(), "ether")
    ).toFixed(2);

    accountxDai.balance = eoaBalanceAmount;
    accountxDai.title = "Safe Owner";
    accountxDai.address = km.torusKeyAddress;
  });
</script>

<section class="justify-center mb-4">
  <div class="flex flex-col w-full p-4 space-y-2 rounded-sm shadow infocard">
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
<div class="px-5 pb-5">
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
</div>
