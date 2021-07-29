<script lang="ts">
  import BankingHeader from "../atoms/BankingHeader.svelte";
  import { transfer } from "../processes/transfer";
  import TransactionCard from "../atoms/TransactionCard.svelte";
  import TopNav from "src/shared/atoms/TopNav.svelte";
  import { mySafe } from "../stores/safe";
  import { me } from "../../../shared/stores/me";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import { Transfer } from "../data/circles/types";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  $: me;

  let stopElement: HTMLDivElement;
  let firstElement: TransactionCard;
  let preparedRows: Transfer[] = [];
  let displayRows: Transfer[] = [];

  let scrollY;
  let oldRowCount = 0;

  const pageSize = 30;
  let currentPage = 0;
  let eof = false;

  function loadMore() {
    if ($mySafe.transfers.rows.length == 0) return;

    const maxPageSize =
      $mySafe.transfers.rows.length >= pageSize
        ? pageSize
        : $mySafe.transfers.rows.length;
    if (maxPageSize < pageSize) {
      // EOF
      eof = true;
    }
    const from = currentPage * pageSize;
    const to = from + pageSize;
    preparedRows = [...preparedRows, ...$mySafe.transfers.rows.slice(from, to)];
    console.log("Next page ..");
    currentPage++;
  }

  $: {
    if ($mySafe.transfers.rows.length != oldRowCount) {
      oldRowCount = $mySafe.transfers.rows.length;
      preparedRows = [];
      let oldPage = currentPage == 0 ? 1 : currentPage;
      currentPage = 0;
      while (oldPage > 0) {
        loadMore();
        oldPage--;
      }
      displayRows = preparedRows;
    } else {
      if (preparedRows.length == 0 && $mySafe.transfers.rows) {
        loadMore();
        displayRows = preparedRows;
      } else {
        const stopElementY = stopElement ? stopElement.offsetTop : -1;
        if (stopElementY - window.innerHeight - scrollY < 50 && !eof) {
          loadMore();
          displayRows = preparedRows;
        }
      }
    }
  }
</script>

<svelte:window bind:scrollY />

<BankingHeader
  {runtimeDapp}
  {routable}
  balance={$mySafe && $mySafe.balance ? $mySafe.balance : '0'}
/>

<div class="px-4 mx-auto -mt-3 md:w-2/3 xl:w-1/2">
  {#if $mySafe.ui && !$mySafe.ui.error && displayRows.length === 0}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>Loading Transactions...</div>
        </div>
      </div>
    </section>
  {:else if $mySafe.ui && $mySafe.ui.error}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>
            <b>An error occurred while loading the recent activities:</b>
            <br />
            {$mySafe.ui.error.message}
          </div>
        </div>
      </div>
    </section>
  {:else if displayRows.length > 0}
    {#each displayRows as transfer, i}
      {#if i === 0}
        <TransactionCard bind:this={firstElement} {transfer} message="" />
      {:else}
        <TransactionCard {transfer} message="" />
      {/if}
    {/each}
    <div bind:this={stopElement}>Stop</div>
  {:else}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>
            <span>No recent activities</span>
          </div>
        </div>
      </div>
    </section>
  {/if}
  <section class="justify-center mb-4">
    <div class="flex flex-col w-full p-4 space-y-2 rounded-sm shadow infocard">
      <div class="text-xs font-bold text-left text-info ">WHAT IS THIS?</div>

      <div class="text-sm md:text-base">
        This is your Circles banking account and you just got your first 50
        Circles as a welcome gift.
        <br />
        <br />
        From today on you will unconditionally receive 8 more Circles every day
        in the form of your personal universal basic income.
        <br />
        <br />

        <b>
          Have a look around and explore the navigation buttons below, to learn
          more about how Circles works in detail.
        </b>
      </div>
    </div>
  </section>
</div>
