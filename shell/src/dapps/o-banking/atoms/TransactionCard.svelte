<script lang="ts">
  import Time from "svelte-time";
  import { push } from "svelte-spa-router";
  import Web3 from "web3";
  import { Transfer } from "../data/circles/queries";

  export let transfer: Transfer;
  export let message: String;

  let pictureUrl: string;
  let displayName: String;
  let classes: String;

  $: {
    displayName =
      transfer.direction === "in"
        ? transfer.fromProfile
          ? transfer.fromProfile.displayName
          : transfer.from
        : transfer.toProfile
        ? transfer.toProfile.displayName
        : transfer.to;

    pictureUrl =
      transfer.direction === "in"
        ? transfer.fromProfile
          ? transfer.fromProfile.avatarUrl
          : undefined
        : transfer.toProfile
        ? transfer.toProfile.avatarUrl
        : undefined;

    classes =
      transfer.direction === "in"
        ? "transactionpositive"
        : "transactionnegative";
  }

  let timestampSevenDays = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;

  function loadDetailPage(path) {
    console.log(path);
    push("#/banking/transactions/" + path);
  }
  function dateOlderThanSevenDays(unixTime: Number) {
    return timestampSevenDays > unixTime;
  }
</script>

<section
  on:click|once={() => loadDetailPage(transfer._id)}
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

    <div class="text-left flex-grow truncate relative">
      <div class="truncateThis">
        <h2 class="text-2xl sm:text-3xl font-bold  ">
          {displayName}
        </h2>
      </div>
      <p class="text-sm mt-2">{message}</p>
    </div>

    <div class="flex flex-1 flex-col justify-items-end">
      <div class="self-end text-{classes} text-2xl sm:text-3xl">
        <span>
          {Number.parseFloat(
            Web3.utils.fromWei(transfer.amount, "ether")
          ).toFixed(2)}
        </span>
      </div>
      <div class="self-end mt-2 text-xs text-circleslightblue">
        {#if dateOlderThanSevenDays(transfer.time)}
          <Time
            timestamp={new Date(transfer.time * 1000)}
            format="D. MMMM YYYY"
          />
        {:else}
          <Time relative timestamp={new Date(transfer.time * 1000)} />
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
  .truncateThis:before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    /* background: linear-gradient(transparent 150px, #ffcc33); */
    background: linear-gradient(to right, transparent 80%, #fff 100%);

    /* background: #ffcc33; */
  }
</style>
