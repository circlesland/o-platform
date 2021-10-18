<script lang="ts">
import BankingHeader from "../atoms/BankingHeader.svelte";
import { transfer } from "../processes/transfer";
import TransactionCard from "../atoms/TransactionCard.svelte";
import TopNav from "src/shared/atoms/TopNav.svelte";
import { me } from "../../../shared/stores/me";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { onMount } from "svelte";
import {
  ProfileEvent,
  TransactionTimelineDocument,
} from "../../../shared/api/data/types";
import Lazy from "src/shared/molecules/Lazy/Lazy.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

$: me;

let stopElement: HTMLDivElement;
let firstElement: TransactionCard;

let scrollY;
let oldRowCount = 0;

const pageSize = 30;
let currentPage = 0;
let eof = false;

let data: ProfileEvent[] = [];
let error: string;

// if the api (like in this example) just have a simple numeric pagination
let page = 0;
// but most likely, you'll have to store a token to fetch the next page
let nextUrl = "";
// store all the data here.

// store the new batch of data here.
let newBatch = [];
let fromTimestamp = undefined;
let noMoreItems = false;

// onMount(() => {
//   // load first batch onMount
//   fetchData();
// });

async function fetchData() {
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const timeline = await apiClient.query({
    query: TransactionTimelineDocument,
    variables: {
      safeAddress: $me.circlesAddress, //this.safeAddress,
      fromTimestamp: fromTimestamp,
      limit: 20,
      // fromBlock: 16471696
    },
  });
  if (timeline.errors) {
    error = `Couldn't load the transaction history for the following reasons: ${JSON.stringify(
      timeline.errors
    )}`;
  }

  newBatch = await timeline.data.events;

  fromTimestamp = newBatch.at(-1).timestamp;
  console.log("TIMESTAMP: ", fromTimestamp);
  // const response = await fetch(`https://api.openbrewerydb.org/breweries?by_city=los_angeles&page=${page}`);
  // entries = await response.json();
  console.log(newBatch);
}

$: data = [...data, ...newBatch];

// async function fetchData(node) {
//   if (noMoreItems) {
//     return;
//   }
//   const apiClient = await window.o.apiClient.client.subscribeToResult();
//   const timeline = await apiClient.query({
//     query: TransactionTimelineDocument,
//     variables: {
//       safeAddress: $me.circlesAddress, //this.safeAddress,
//       fromTimestamp: fromTimestamp,
//       limit: 150,
//       // fromBlock: 16471696
//     },
//   });
//   if (timeline.errors) {
//     error = `Couldn't load the transaction history for the following reasons: ${JSON.stringify(
//       timeline.errors
//     )}`;
//   }
//   if (timeline.data.events.length) {
//     entries = await timeline.data.events;
//   } else {
//     noMoreItems = true;
//   }
//   fromTimestamp = entries.at(-1).timestamp;
//   // const response = await fetch(`https://api.openbrewerydb.org/breweries?by_city=los_angeles&page=${page}`);
//   // entries = await response.json();
//   console.log(entries);
// }

onMount(() => {
  // load first batch onMount
  fetchData();
});
</script>

<BankingHeader runtimeDapp="{runtimeDapp}" routable="{routable}" balance="0" />

<div class="px-4 mx-auto -mt-3 md:w-2/3 xl:w-1/2">
  {#if !error && data.length === 0}
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
  {:else if data.length > 0}
    {#each data as transfer, i}
      <TransactionCard transfer="{transfer}" />
    {/each}
    <Lazy
      hasMore="{newBatch.length}"
      threshold="{30}"
      on:loadMore="{() => {
        page++;
        fetchData();
      }}">
      <TransactionCard transfer="{transfer}" />
    </Lazy>
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
        From today on you will unconditionally receive 8 more Circles every day in
        the form of your personal universal basic income.
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
