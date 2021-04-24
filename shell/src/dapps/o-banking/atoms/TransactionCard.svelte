<script lang="ts">
  import Time from "svelte-time";
  import { push } from "svelte-spa-router";
  import Web3 from "web3";
  export let displayName: String;
  export let direction: String;
  export let amount: string;
  export let message: String;
  export let time: Number;
  export let pictureUrl: string;

  let timestampSevenDays = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;

  function loadDetailPage(path) {
    push("#/banking/transactions/" + path);
  }
  function dateOlderThanSevenDays(unixTime: Number) {
    return timestampSevenDays > unixTime;
  }
</script>

<section
  on:click|once={() => loadDetailPage("daniel/samuel/200")}
  class="flex items-center justify-center mb-2 text-circlesdarkblue"
>
  <div
    class="flex items-center bg-white shadow p-4 w-full space-x-2 sm:space-x-6"
  >
    <div class="mr-2 text-center">
      <div class="avatar">
        <div class="rounded-full w-12 h-12 sm:w-12 sm:h-12 m-auto">
          <img
            src={pictureUrl ? pictureUrl : "/images/common/circles.png"}
            alt="username"
          />
        </div>
      </div>
    </div>

    <div class="text-left">
      <div class="max-w-full transactionCardName">
        <h2 class="text-2xl sm:text-3xl font-bold truncate ">
          {displayName.length > 22
            ? displayName.substring(0, 22) + ".."
            : displayName}
        </h2>
      </div>
      <p class="text-sm mt-2">{message}</p>
    </div>

    <div class="flex flex-1 flex-col justify-items-end">
      <div class="self-end text-{direction} text-2xl sm:text-3xl">
        <span
          >{Number.parseFloat(Web3.utils.fromWei(amount, "ether")).toFixed(
            2
          )}</span
        >
      </div>
      <div class="self-end mt-2 text-xs text-circleslightblue">
        {#if dateOlderThanSevenDays(time)}
          <Time timestamp={new Date(time * 1000)} format="D. MMMM YYYY" />
        {:else}
          <Time relative timestamp={new Date(time * 1000)} />
        {/if}
      </div>
    </div>
  </div>
</section>

<style>
  @media (max-width: 496px) {
    .transactionCardName {
      max-width: 200px;
    }
  }
</style>
