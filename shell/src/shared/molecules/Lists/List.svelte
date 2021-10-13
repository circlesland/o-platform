<!-- <script lang="ts">
  import BankingHeader from "../atoms/BankingHeader.svelte";
  import { transfer } from "../processes/transfer";
  import TransactionCard from "../atoms/TransactionCard.svelte";
  import TopNav from "src/shared/atoms/TopNav.svelte";
  import { me } from "../../../shared/stores/me";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import { onMount } from "svelte";
  import { ProfileEvent, TransactionTimelineDocument } from "../data/api/types";
  import Lazy from "src/shared/molecules/Lazy/Lazy.svelte";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  const onload = node => {
    console.log("on load");
  };

  $: me;

  let stopElement: HTMLDivElement;
  let firstElement: TransactionCard;

  let scrollY;
  let oldRowCount = 0;

  const pageSize = 30;
  let currentPage = 0;
  let eof = false;

  let entries: ProfileEvent[] = [];
  let error: string;

  onMount(async () => {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const timeline = await apiClient.query({
      query: TransactionTimelineDocument,
      variables: {
        safeAddress: $me.circlesAddress, //this.safeAddress,
        // fromBlock: 16471696
      },
    });
    if (timeline.errors) {
      error = `Couldn't load the transaction history for the following reasons: ${JSON.stringify(
        timeline.errors
      )}`;
    }
    entries = timeline.data.events;
  });
</script><svelte:window bind:scrollY />

<BankingHeader {runtimeDapp} {routable} balance="0" />

<div class="px-4 mx-auto -mt-3 md:w-2/3 xl:w-1/2">
  {#if !error && entries.length === 0}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>Loading Transactions...</div>
        </div>
      </div>
    </section>
  {:else if error}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>
            <b>An error occurred while loading the recent activities:</b>
            <br />
            {error}
          </div>
        </div>
      </div>
    </section>
  {:else if entries.length > 0}
    {#each entries as transfer, i}
      <Lazy
        height="{80}"
        offset="{0}"
        {onload}
        fadeOption="{{ delay: 500, duration: 1000 }}">
        {#if i === 0}
          <TransactionCard bind:this="{firstElement}" {transfer} message=" " />
        {:else}
          <TransactionCard {transfer} message=" " />
        {/if}
      </Lazy>
    {/each}
    <div bind:this="{stopElement}">Stop</div>
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
</div> -->
