<script lang="ts">
  import BankingHeader from "../atoms/BankingHeader.svelte";
  import { push } from "svelte-spa-router";
  import gql from "graphql-tag";
  import Time from "svelte-time";
  import TransactionCard from "../atoms/TransactionCard.svelte";

  import { query } from "svelte-apollo";
  import { setClient } from "svelte-apollo";
  import { me } from "../../../shared/stores/me";

  setClient(<any>window.o.theGraphClient);

  $: transactions = query(
    gql`
      query notifications($safe: String!) {
        notifications(
          where: { type: "HUB_TRANSFER", safe: $safe }
          orderBy: time
          orderDirection: desc
        ) {
          time
          transactionHash
          hubTransfer {
            from
            to
            amount
          }
        }
      }
    `,
    {
      variables: {
        safe: $me.circlesAddress ? $me.circlesAddress.toLowerCase() : "",
      },
    }
  );

  console.log("ME", $me.circlesAddress);
</script>

<BankingHeader />

<div class="mx-4 -mt-6">
  {#if $transactions.loading}
    <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
      <div class="flex items-center bg-white shadow p-4 w-full space-x-2 ">
        <div class="flex flex-col items-start">
          <div>Loading Transactions...</div>
        </div>
      </div>
    </section>
  {:else if $transactions.error}
    <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
      <div class="flex items-center bg-white shadow p-4 w-full space-x-2 ">
        <div class="flex flex-col items-start">
          <div>
            <b>An error occurred while loading the recent activities:</b>
            <br />{$transactions.error.message}
          </div>
        </div>
      </div>
    </section>
  {:else if $transactions.data && $transactions.data.notifications && $transactions.data.notifications.length > 0}
    {#each $transactions.data.notifications as notification}
      {#if $me.circlesAddress.toLowerCase() == notification.hubTransfer.from}
        <TransactionCard
          displayName={notification.hubTransfer.to}
          direction="transactionnegative"
          amount={notification.hubTransfer.amount}
          message="WURST"
          time={notification.time}
        />
      {:else}
        <TransactionCard
          displayName={notification.hubTransfer.from}
          direction="transactionpositive"
          amount={notification.hubTransfer.amount}
          message="WURST"
          time={notification.time}
        />
      {/if}
    {/each}
  {:else}
    <span>No recent activities</span>
  {/if}
</div>
