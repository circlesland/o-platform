<script lang="ts">
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
  import Card from "src/shared/atoms/Card.svelte";
  import AssetCard from "../atoms/AssetCard.svelte";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import {me} from "../../../shared/stores/me";
  import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
  import {KeyManager} from "../../o-passport/data/keyManager";
  import {displayCirclesAmount} from "src/shared/functions/displayCirclesAmount";
  import Web3 from "web3";
  import {
    AssetBalance
  } from "../../../shared/api/data/types";
  import ItemCard from "../../../shared/atoms/ItemCard.svelte";
  import {assetsBalances} from "../../../shared/stores/assetsBalances";
  import {BN} from "ethereumjs-util";

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

  async function updateXdaiBalance() {
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
  }

  $: {
    const balances = $assetsBalances;

    circles.details = balances.crcBalances;
    circles.balance = displayCirclesAmount(
      circles.details
        .reduce((p, c) => p.add(new BN(c.token_balance)), new BN("0"))
        .toString(),
      null,
      ($me && $me.displayTimeCircles !== undefined ? $me.displayTimeCircles : true) || ($me && $me.displayTimeCircles !== undefined ? $me.displayTimeCircles : true) === undefined
    );
    circles.variety = circles.details.length;

    erc20DisplayBalances = <any>balances.erc20Balances
      .map((o: any) => {
        const copy = JSON.parse(JSON.stringify(o));
        if (copy.token_address == "0x9ee40742182707467f78344f6b287be8704f27e2") {
          copy.token_symbol = "EURS";
          copy.token_image = "/logos/eurs.png";
        } else if (copy.token_address == "0x63e62989d9eb2d37dfdb1f93a22f063635b07d51") {
          copy.token_symbol = "MIVA";
          copy.token_image = "/logos/miva.png";
        } else if (copy.token_address == "0x62f5caa239a97b21aa61502963cf8c33f8182e79") {
          copy.token_symbol = "ARTIS";
          copy.token_image = "/logos/artis.png";
        } else if (copy.token_address == "0x5227e8810281482f25454a8f00ea871589fc040e") {
          copy.token_symbol = "HUMAN";
          copy.token_image = "/logos/hmn.png";
        } else if (copy.token_address == "0x04e7c72a70975b3d2f35ec7f6b474451f43d4ea0") {
          copy.token_symbol = "HUMAN (Test token)";
          copy.token_image = "/logos/hmn.png";
        }
        return copy;
      });

    erc20DisplayBalances = erc20DisplayBalances.sort((a,b) => {
      const bnA = new BN(a.token_balance);
      const bnB = new BN(b.token_balance);
      return bnA.gt(bnB) ? -1 : bnA.lt(bnB) ? 1 : 0;
    }).map(o => {
      if (o.token_symbol == "EURS") {
        return {
          ...o,
          token_balance: o.token_balance = (parseFloat(o.token_balance) / 100).toFixed(2)
        }
      } else {
        return {
          ...o,
          token_balance: o.token_balance = parseFloat(RpcGateway.get().utils.fromWei(o.token_balance, "ether")).toFixed(2)
        }
      }
    })

    updateXdaiBalance().then(o => {
      if (loading) {
        loading = false;
      }
    });
  }

  loading = false;
</script>

<SimpleHeader {runtimeDapp} {routable}/>

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
                    details="{token.details}"/>
        {/each}


        <!-- all other ERC20s -->
        {#each erc20DisplayBalances as token}
            {#if token}
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
          }}/>
                </div>
            {/if}
        {/each}

    {/if}
</div>
