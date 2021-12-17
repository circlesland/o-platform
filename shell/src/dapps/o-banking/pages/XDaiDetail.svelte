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

let balances = [];

onMount(async () => {
  const safeAddress = $me.circlesAddress;
  const safeBalance = await RpcGateway.get().eth.getBalance(safeAddress);
  const km = new KeyManager(safeAddress);
  await km.load();
  const eoaBalance = await RpcGateway.get().eth.getBalance(km.torusKeyAddress);

  const safeBalanceBn = new BN(safeBalance);
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

  if (safeBalanceBn.gt(new BN("0"))) {
    balances = [accountxDai, safexDai];
  } else {
    balances = [accountxDai];
  }
});
</script>

<div class="p-5">
  <div class="w-full mb-4 text-center">
    <h1 class="uppercase font-heading">Xdai</h1>
  </div>

  {#each balances.sort( (a, b) => (parseFloat(a.balance) > parseFloat(b.balance) ? -1 : parseFloat(a.balance) < parseFloat(b.balance) ? 1 : 0) ) as token}
    <ItemCard
      params="{{
        edgeless: false,
        imageUrl: `/logos/xdai.png`,
        title: token.title,
        subTitle: token.address,
        truncateMain: true,
        endTextBig: Number.parseFloat(token.balance).toFixed(2),
        endTextSmall: '',
        noLink: true,
        mobileTextCutoff: 18,
      }}" />
  {/each}
</div>
