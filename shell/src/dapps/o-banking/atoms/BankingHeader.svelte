<script lang="ts">
import TopNav from "src/shared/atoms/TopNav.svelte";
import PageHeader from "src/shared/atoms/PageHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { me } from "../../../shared/stores/me";

import { Currency } from "../../../shared/currency";
import { BN } from "ethereumjs-util";
import { assetBalances } from "../../../shared/stores/assetsBalances";
import Icons from "../../../shared/molecules/Icons.svelte";
import { Environment } from "../../../shared/environment";

export let balanceEuro: string = "0";
export let balanceTime: string = "0";
export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

$: {
  const sum = $assetBalances.crcBalances.reduce((p, c) => p.add(new BN(c.token_balance)), new BN("0")).toString();
  balanceEuro = Currency.instance().displayAmount(sum, null, "EURS", null).toString();
  balanceTime = Currency.instance().displayAmount(sum, null, "TIME_CRC", null).toString();
}
</script>

<TopNav runtimeDapp="{runtimeDapp}" routable="{routable}" />

<PageHeader heightClass=" relative h-60 sm:h-80" color="bg-banking" largeHeader="{true}">
  <div
    class="absolute w-4/5 h-full overflow-hidden -top-6 -right-8 blob bg-banking-light"
    style="border-radius:137% 1% 119% 38% / 99% 60% 86% 73%">
    <div class="pt-2 text-white"></div>
  </div>
  <div class="flex items-center w-full pt-2 text-white ">
    <span class="inline-block tracking-wide font-heading">
      <div class="self-center block mt-2 text-center">
        <div class="relative pt-2 text-center text-white">
          <span class="inline-block tracking-wide font-heading">
            <section class="m-4 -mb-4 text-center">
              {#if Environment.userLanguage !== "id"}
                <h1 class="text-5xl sm:text-7xl">
                  {balanceEuro}<span class=" font-enso">{Currency.currencySymbol["EURS"]}</span>
                </h1>
              {/if}
              <h2 class="text-3xl sm:text-5xl">
                {balanceTime}<Icons icon="timeCircle" size="{8}" customClass="inline inline-icon" />
              </h2>
              <span class="text-2xl text-right sm:text-3xl"> BALANCE </span>
            </section>
          </span>
        </div>
      </div>
    </span>
  </div>
</PageHeader>
