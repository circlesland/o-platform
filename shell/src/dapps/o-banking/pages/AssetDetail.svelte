<script lang="ts">
  import { Token } from "../data/circles/types";
  import TokenCard from "../atoms/TokenCard.svelte";
  import XdaiAssetCard from "../atoms/XdaiAssetCard.svelte";
  import { INVITE_VALUE } from "src/dapps/o-passport/processes/invite/invite";
  import { mySafe } from "../stores/safe";
  import { BN } from "ethereumjs-util";
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
  import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
  import { me } from "../../../shared/stores/me";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;
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
  let presets = [10, 20, 50];
  let symbol: string;

  $: {
    symbol = params.symbol;

    if (symbol == "xdai" && $mySafe && $mySafe.accountxDai) {
      accountxDai = {
        symbol: "xdai",
        icon: "",
        address: RpcGateway.get().eth.accounts.privateKeyToAccount(
          localStorage.getItem("circlesKey")
        ).address,
        title: "Safe owner",
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
        class="flex flex-col w-full p-4 space-y-2 rounded-sm shadow infocard"
      >
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

    {#each [accountxDai, safexDai].sort((a, b) =>
      parseFloat(a.balance) > parseFloat(b.balance)
        ? -1
        : parseFloat(a.balance) < parseFloat(b.balance)
        ? 1
        : 0
    ) as token}
      <XdaiAssetCard
        address={token.address}
        title={token.title}
        symbol={token.symbol}
        balance={token.balance}
        variety={token.variety}
        colorClass="text-primary"
      />
    {/each}
    <section class="flex items-center justify-center mt-4 mb-2">
      <div
        class="flex flex-col w-full p-4 space-y-2 bg-white rounded-sm shadow"
      >
        <div class="text-xs font-bold text-left text-primary ">
          BUY MORE XDAI
        </div>
        <div
          class="flex items-center justify-center w-full space-x-2 sm:space-x-6"
        >
          <div class="flex flex-row mt-4 space-x-4">
            {#each presets as preset}
              <a
                href="https://buy.ramp.network/?userAddress={accountxDai.address}&swapAsset=XDAI&swapAmount={preset}000000000000000000"
                target="_blank"
                class="cursor-pointer"
              >
                <div
                  class="text-white cursor-pointer card compact side bg-primary "
                >
                  <div
                    class="flex-row items-center space-x-4 cursor-pointer card-body"
                  >
                    <label for="input" class="flex-0">
                      <div
                        class="text-sm font-bold tracking-wider text-center sm:text-lg"
                      >
                        {Math.floor(preset / INVITE_VALUE)} INVITES
                      </div>
                      <p class="text-xs text-center sm:text-l ">
                        ({preset} xDai)
                      </p>
                    </label>
                  </div>
                </div>
              </a>
            {/each}
          </div>
        </div>
      </div>
    </section>
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
