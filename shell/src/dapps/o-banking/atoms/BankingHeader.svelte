<script lang="ts">
import TopNav from "src/shared/atoms/TopNav.svelte";
import PageHeader from "src/shared/atoms/PageHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { me } from "../../../shared/stores/me";
import { displayCirclesAmount } from "../../../shared/functions/displayCirclesAmount";
import { Currency } from "../../../shared/currency";
import { BN } from "ethereumjs-util";
import { assetsBalances } from "../../../shared/stores/assetsBalances";

export let balance: string = "0";
export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

  $: {
    const sum = $assetsBalances.crcBalances.reduce((p,c) => p.add(new BN(c.token_balance)), new BN("0")).toString();
    balance = displayCirclesAmount(sum, null, true, ($me && $me.displayTimeCircles !== undefined ? $me.displayTimeCircles : true) || ($me && $me.displayTimeCircles !== undefined ? $me.displayTimeCircles : true) === undefined).toString();
  }
}
</script>

<TopNav runtimeDapp="{runtimeDapp}" routable="{routable}" />

<PageHeader heightClass="h-60">
  <div class="self-center block text-center">
    <span class="inline-block tracking-wide text-7xl font-heading">
      {balance}
      <svg
        class="inline w-8 h-8 mt-2 -ml-3"
        viewBox="0 0 229 255"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M118.5 237C150.437 237 179.424 224.366 200.734 203.822C209.904
          197.627 215.933 187.136 215.933 175.236C215.933 156.198 200.499
          140.764 181.461 140.764C170.572 140.764 160.863 145.812 154.545
          153.695L154.457 153.627C145.313 163.112 132.476 169.012 118.261
          169.012C90.4957 169.012 67.9879 146.504 67.9879 118.739C67.9879
          90.9745 90.4957 68.4667 118.261 68.4667C132.339 68.4667 145.067 74.254
          154.193 83.5795L154.29 83.5037C160.581 90.2293 169.535 94.4328 179.471
          94.4328C198.51 94.4328 213.944 78.9988 213.944 59.9601C213.944 48.1884
          208.043 37.7949 199.039 31.5755C177.899 11.9794 149.599 0 118.5
          0C53.0543 0 0 53.0543 0 118.5C0 183.946 53.0543 237 118.5 237Z"
          fill="white"></path>
        <ellipse
          cx="118.979"
          cy="118.739"
          rx="26.5727"
          ry="26.3333"
          fill="white"></ellipse>
      </svg>
    </span>
  </div>
  <div
    class="self-end m-auto mt-2 space-y-2 text-center text-base-300 max-w-max">
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
