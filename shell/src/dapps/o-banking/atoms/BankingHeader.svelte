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

<PageHeader heightClass="h-80" color="bg-banking" largeHeader="{true}">
  <div
    style="position: absolute; left: 41%; border-radius: 32% 26% 118% 46% / 99% 69% 103% 73%"
    class="bg-banking-light h-72">
    <div
      class="flex items-center pl-40 bg-banking-light h-72"
      style="position: relative; left: -41%;  border-radius: 32% 1% 51% 46% / 99% 69% 103% 73%">
      <span class="inline-block tracking-wide text-7xl font-enso">
        {balanceEuro}<span class="text-7xl font-enso">{Currency.currencySymbol["EURS"]}</span>
        <br />
        <span>{balanceTime}<Icons icon="timeCircle" size="{16}" customClass="inline inline-icon" /></span>
      </span>
    </div>
  </div>

  <!-- <div class="w-4/5 blob bg-banking-light h-72" style="border-radius: 32% 1% 118% 46% / 99% 69% 103% 73%">
    <div class="flex items-center h-full pt-2 pl-10 text-white">
      <span class="inline-block tracking-wide text-7xl font-enso">
        {balanceEuro} <span class="text-7xl font-enso">{Currency.currencySymbol["EURS"]}</span>
        <br />
        {balanceTime}<Icons icon="timeCircle" size="{16}" customClass="inline inline-icon" />
      </span>

      
    {#if !$mySafe.ui.loadingText || $mySafe.ui.loadingText === ''}
      <small class="block whitespace-nowrap">
        {$mySafe.transfers && $mySafe.transfers.rows ? $mySafe.transfers.rows.length : ''}
        transactions
      </small>
    {/if}
      <small class="block whitespace-nowrap">
        {$mySafe.ui.loadingPercent ? $mySafe.ui.loadingText : ''}
      </small>
    <progress
      class="progress progress-accent transaction-update-progress"
      value={$mySafe.ui.loadingPercent ? $mySafe.ui.loadingPercent : 0}
      max="100"
    />
    
    </div> 
  </div>-->
</PageHeader>

<style>
.blob {
  position: absolute;
  right: -30px;
  top: -30px;
}
</style>
