<script lang="ts">
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
  import Card from "src/shared/atoms/Card.svelte";
  import { BN } from "ethereumjs-util";
  import AssetCard from "../atoms/AssetCard.svelte";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import { onMount } from "svelte";
  import { me } from "../../../shared/stores/me";
  import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
  import { KeyManager } from "../../o-passport/data/keyManager";
  import { displayCirclesAmount } from "src/shared/functions/displayCirclesAmount";
  import Web3 from "web3";
  import {AggregatesDocument, BalancesByAssetDocument, CrcBalances} from "../../../shared/api/data/types";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;
  let loading: boolean = true;

  let xdai = {
    symbol: "xdai",
    icon: "",
    title: "xDAI",
    balance: "ß",
    variety: 1,
    description: "1 xDai  ~ 1 USD",
  };

  let circles = {
    symbol: "crc",
    icon: "",
    balance: "ß",
    variety: 0,
    title: "Circles",
    description: "1 Circle = 1€",
    details: [],
  };

  onMount(async () => {
    const safeAddress = $me.circlesAddress;
    const apiClient = await window.o.apiClient.client.subscribeToResult();

    const balancesResult = await apiClient.query({
      query: AggregatesDocument,
      variables: {
        types: ["CrcBalances"],
        safeAddress: safeAddress
      },
    });

    if (balancesResult.errors?.length > 0) {
      throw new Error(`Couldn't read the balance of safe ${safeAddress}`);
    }

    const crcBalances:CrcBalances = balancesResult.data.aggregates.find(o => o.type == "CrcBalances");
    if (!crcBalances) {
      throw new Error(`Couldn't find the CrcBalances in the query result.`)
    }

    circles.details = crcBalances.payload.balances;
    circles.balance = displayCirclesAmount(
      circles.details
        .reduce((p, c) => p.add(new BN(c.token_balance)), new BN("0"))
        .toString(),
      null,
      $me.displayTimeCircles || $me.displayTimeCircles === undefined
    );
    circles.variety = circles.details.length;

    const safeBalance = await RpcGateway.get().eth.getBalance(safeAddress);
    const km = new KeyManager(safeAddress);
    await km.load();
    const eoaBalance = await RpcGateway.get().eth.getBalance(
      km.torusKeyAddress
    );

    xdai.balance = Number.parseFloat(
      Web3.utils.fromWei(
        new BN(safeBalance).add(new BN(eoaBalance)).toString(),
        "ether"
      )
    ).toFixed(2);

    loading = false;
  });
</script>

<SimpleHeader {runtimeDapp} {routable} />

<div class="px-4 mx-auto -mt-3 md:w-2/3 xl:w-1/2">

  {#if loading}
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
        symbol="{token.symbol}"
        title="{token.title}"
        balance="{token.balance}"
        variety="{token.variety}"
        description="{token.description}"
        details="{token.details}" />
    {/each}
  {/if}
</div>
