<script lang="ts">
import TopNav from "src/shared/atoms/TopNav.svelte";
import PageHeader from "src/shared/atoms/PageHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { me } from "../../../shared/stores/me";

import { Currency } from "../../../shared/currency";
import { BN } from "ethereumjs-util";
import { assetsBalances } from "../../../shared/stores/assetsBalances";
import Icons from "../../../shared/molecules/Icons.svelte";

export let balanceEuro: string = "0";
export let balanceTime: string = "0";
export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

$: {
  const sum = $assetsBalances.crcBalances
    .reduce((p, c) => p.add(new BN(c.token_balance)), new BN("0"))
    .toString();
  balanceEuro = Currency.instance()
    .displayAmount(sum, null, "EURS", null)
    .toString();
  balanceTime = Currency.instance()
    .displayAmount(sum, null, "TIME_CRC", null)
    .toString();
}
</script>

<TopNav runtimeDapp="{runtimeDapp}" routable="{routable}" />

<PageHeader heightClass="h-60">
  <div class="self-center block text-center">
    <span class="inline-block tracking-wide text-7xl font-enso">
      {balanceEuro}
    </span>
    <span class="text-7xl font-enso">{Currency.currencySymbol["EURS"]}</span>
  </div>
  <div class="self-end m-auto mt-2 space-y-2 text-center max-w-max">
    {balanceTime}
    <span class=" font-primary">{Currency.currencySymbol["TIME_CRC"]}</span>
    <!--
    {#if !$mySafe.ui.loadingText || $mySafe.ui.loadingText === ''}
      <small class="block whitespace-nowrap">
        {$mySafe.transfers && $mySafe.transfers.rows ? $mySafe.transfers.rows.length : ''}
        transactions
      </small>
    {/if}
    -->
    <small class="block whitespace-nowrap">
      <!--{$mySafe.ui.loadingPercent ? $mySafe.ui.loadingText : ''}-->
    </small>
    <!--
    <progress
      class="progress progress-accent transaction-update-progress"
      value={$mySafe.ui.loadingPercent ? $mySafe.ui.loadingPercent : 0}
      max="100"
    />
    -->
  </div>
</PageHeader>
