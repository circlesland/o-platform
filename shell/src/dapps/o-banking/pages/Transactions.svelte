<script lang="ts">
  import BankingHeader from "../atoms/BankingHeader.svelte";
  import { push } from "svelte-spa-router";
  import TransactionCard from "../atoms/TransactionCard.svelte";
  import {mySafe} from "../stores/safe";

  let timestampSevenDays = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;

  function loadDetailPage(path) {
    push("#/banking/transactions/" + path);
  }

  function dateOlderThanSevenDays(unixTime: number) {
    return timestampSevenDays > unixTime;
  }
</script>

<BankingHeader balance={$mySafe && $mySafe.balance ? $mySafe.balance : "0"} />

<div class="mx-4 -mt-6">
  {#if $mySafe.loading}
    <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
      <div class="flex items-center bg-white shadow p-4 w-full space-x-2 ">
        <div class="flex flex-col items-start">
          <div>Loading Transactions...</div>
        </div>
      </div>
    </section>
  {:else if $mySafe.error}
    <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
      <div class="flex items-center bg-white shadow p-4 w-full space-x-2 ">
        <div class="flex flex-col items-start">
          <div>
            <b>An error occurred while loading the recent activities:</b>
            <br />{$mySafe.error.message}
          </div>
        </div>
      </div>
    </section>
  {:else if $mySafe.transfers && $mySafe.transfers.rows && $mySafe.transfers.rows.length > 0}
    {#each $mySafe.transfers.rows as transfer}
      {#if transfer.direction === "in"}
        <TransactionCard
          displayName={transfer.from}
          direction="transactionnegative"
          amount={transfer.amount}
          message="WURST"
          time={transfer.time}
        />
      {:else}
        <TransactionCard
          displayName={transfer.to}
          direction="transactionpositive"
          amount={transfer.amount}
          message="WURST"
          time={transfer.time}
        />
      {/if}
    {/each}
  {:else}
    <span>No recent activities</span>
  {/if}
</div>
