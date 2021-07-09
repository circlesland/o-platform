<script lang="ts">
  import BankingHeader from "../atoms/BankingHeader.svelte";
  import {onMount} from "svelte";
  import {tryGetCurrentSafe} from "../init";
  import {transfer} from "../processes/transfer";
  import TransactionCard from "../atoms/TransactionCard.svelte";
  import {mySafe} from "../stores/safe";
  import {me} from "../../../shared/stores/me";
  import VirtualList from "../../../shared/molecules/Select/VirtualList.svelte";

  export let params: {
    to: string;
    amount: string;
    message: string;
  };

  $: me;
  let safeAddress: string;

  onMount(() => {
    if (
            params &&
            params.to &&
            params.amount &&
            params.to != "" &&
            params.amount != ""
    ) {
      if ((safeAddress = tryGetCurrentSafe()?.safeAddress) && $me) {
        window.o.runProcess(transfer, {
          recipientAddress: params.to,
          message: params.message,
          tokens: {
            currency: "crc",
            amount: params.amount,
          },
          acceptSummary: true,
          safeAddress: safeAddress,
          privateKey: localStorage.getItem("circlesKey"),
        });
      }
    }
  });
  let start;
  let end;
</script>

<BankingHeader balance={$mySafe && $mySafe.balance ? $mySafe.balance : "0"} />

<div class="mx-4 -mt-6">
  {#if $mySafe.ui && $mySafe.ui.loadingPercent === 0}
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
            <br />{$mySafe.ui.error.message}
          </div>
        </div>
      </div>
    </section>
  {:else if $mySafe.transfers && $mySafe.transfers.rows}
    <!--
    <VirtualList height="600px" items={$mySafe.transfers.rows} bind:start bind:end let:item>
      {#if item.direction === "in"}
        <TransactionCard transfer={item} message="" />
      {:else}
        <TransactionCard transfer={item} message="" />
      {/if}
    </VirtualList>
    -->
    {#each $mySafe.transfers.rows as transfer}
      {#if transfer.direction === "in"}
        <TransactionCard {transfer} message="" />
      {:else}
        <TransactionCard {transfer} message="" />
      {/if}
    {/each}
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
        <br /><br />
        From today on you will unconditionally receive 8 more Circles every day in
        the form of your personal universal basic income.
        <br /><br />

        <b
          >Have a look around and explore the navigation buttons below, to learn
          more about how Circles works in detail.</b
        >
      </div>
    </div>
  </section>
</div>
