<script lang="ts">
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
  import Card from "src/shared/atoms/Card.svelte";
  import {BN} from "ethereumjs-util";
  import AssetCard from "../atoms/AssetCard.svelte";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import {onMount} from "svelte";
  import {me} from "../../../shared/stores/me";
  import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
  import {KeyManager} from "../../o-passport/data/keyManager";
  import {displayCirclesAmount} from "src/shared/functions/displayCirclesAmount";
  import Web3 from "web3";
  import {
    AggregatesDocument,
    AggregateType, AssetBalance,
    CrcBalances,
    Erc20Balances,
    ProfileAggregate
  } from "../../../shared/api/data/types";
  import ItemCard from "../../../shared/atoms/ItemCard.svelte";

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

  let erc20DisplayBalances: AssetBalance[] = [];

  async function getBalances(safeAddress: string) {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const balancesResult = await apiClient.query({
      query: AggregatesDocument,
      variables: {
        types: [AggregateType.CrcBalances, AggregateType.Erc20Balances],
        safeAddress: safeAddress
      },
    });

    if (balancesResult.errors?.length > 0) {
      throw new Error(`Couldn't read the balance of safe ${safeAddress}`);
    }

    const crcBalances: ProfileAggregate = balancesResult.data.aggregates.find(o => o.type == "CrcBalances");
    if (!crcBalances) {
      throw new Error(`Couldn't find the CrcBalances in the query result.`)
    }

    let erc20Balances: ProfileAggregate = balancesResult.data.aggregates.find(o => o.type == "Erc20Balances");
    if (!erc20Balances) {
      erc20Balances = {
        safe_address: safeAddress,
        type: "Erc20Balances",
        payload: <any>{
          balances: []
        }
      };
    }

    return {
      crcBalances,
      erc20Balances
    };
  }

  onMount(async () => {
    const balances = await getBalances($me.circlesAddress);

    circles.details = balances.crcBalances.payload.balances;
    circles.balance = displayCirclesAmount(
            circles.details
                    .reduce((p, c) => p.add(new BN(c.token_balance)), new BN("0"))
                    .toString(),
            null,
            $me.displayTimeCircles || $me.displayTimeCircles === undefined
    );
    circles.variety = circles.details.length;

    erc20DisplayBalances = <any>Object.values(balances.erc20Balances.payload.balances)
    .map(o => {
      if (o.token_address == "0x9ee40742182707467f78344f6b287be8704f27e2") {
        o.token_symbol = "EURS";
        o.token_image = "/logos/eurs.png";
        o.token_balance = (parseFloat(o.token_balance) / 100).toFixed(2);
      } else if (o.token_address == "0x63e62989d9eb2d37dfdb1f93a22f063635b07d51") {
        o.token_symbol = "MIVA";
        o.token_image = "/logos/miva.png";
        o.token_balance = parseFloat(RpcGateway.get().utils.fromWei(o.token_balance, "ether")).toFixed(2);
      }  else if (o.token_address == "0x62f5caa239a97b21aa61502963cf8c33f8182e79") {
        o.token_symbol = "ARTIS";
        o.token_image = "/logos/artis.png";
        o.token_balance = parseFloat(RpcGateway.get().utils.fromWei(o.token_balance, "ether")).toFixed(2);
      }  else if (o.token_address == "0x5227e8810281482f25454a8f00ea871589fc040e") {
        o.token_symbol = "HUMAN";
        o.token_image = "/logos/hmn.png";
        o.token_balance = parseFloat(RpcGateway.get().utils.fromWei(o.token_balance, "ether")).toFixed(2);
      } else {
        o.token_balance = parseFloat(RpcGateway.get().utils.fromWei(o.token_balance, "ether")).toFixed(2);
      }
      return o;
    });

    const safeBalance = await RpcGateway.get().eth.getBalance($me.circlesAddress);
    const km = new KeyManager($me.circlesAddress);
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


    <!-- all other ERC20s -->
    {#each erc20DisplayBalances as token}
      {#if token && token.token_balance > 0}
        <div>
          <ItemCard
                  params={{
              edgeless: false,
              imageProfile: {
                avatarUrl: token.token_image,
                circlesAddress: token.token_address,
              },
              title: token.token_symbol ? token.token_symbol : "ERC-20",
              subTitle: token.token_address,
              shadowSmall: true,
              noLink: true,
              endTextBig: token.token_balance
          }} />
        </div>
      {/if}
    {/each}

  {/if}
</div>
