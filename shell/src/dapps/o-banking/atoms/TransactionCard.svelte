<script lang="ts">
  import Time from "svelte-time";
  import Web3 from "web3";
  import { Transfer } from "../data/circles/types";
  import { push } from "svelte-spa-router";

  export let transfer: Transfer;
  export let message: String;

  let pictureUrl: string;
  let otherSafeAddress: string;
  let displayName: string;
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

    otherSafeAddress =
      transfer.direction === "in" ? transfer.from : transfer.to;

    displayName =
      displayName === "0x0000000000000000000000000000000000000000"
        ? "CirclesLand"
        : displayName;

    pictureUrl =
      transfer.direction === "in"
        ? transfer.fromProfile
          ? transfer.fromProfile.avatarUrl
          : undefined
        : transfer.toProfile
        ? transfer.toProfile.avatarUrl
        : undefined;

    pictureUrl =
      displayName === "CirclesLand" ? "/images/common/circles.png" : pictureUrl;

    const m = transfer.tags
      ? transfer.tags.find((o) => o.typeId === "o-banking:transfer:message:1")
      : undefined;
    const m2 = m ? m.value : "";
    message = displayName === "CirclesLand" ? "Universal basic income" : m2;

    classes =
      transfer.direction === "in"
        ? "transactionpositive"
        : "transactionnegative";
  }

  let now = new Date();
  let sevendaysago = now.setDate(now.getDate() - 7);

  function dateOlderThanSevenDays(unixTime: number) {
    return sevendaysago > unixTime * 1000;
  }

  function loadDetailPage(path) {
    push(`#/banking/transactions/${path}`);
  }
</script>

<section
  on:click={() => loadDetailPage(transfer._id)}
  class="flex items-center justify-center mb-2 "
>
  <div
    class="flex items-center w-full px-3 py-2 space-x-2 bg-white rounded-lg shadow sm:space-x-6"
  >
    <div class="mr-2 text-center">
      <div class="avatar">
        <div class="m-auto mt-1 rounded-full w-11 h-11 sm:w-12 sm:h-12">
          <img src={pictureUrl} alt={otherSafeAddress} />
        </div>
      </div>
    </div>

    <div class="relative flex-grow text-left truncate">
      <div class="truncateThis">
        <h2 class="text-base">
          {displayName}
        </h2>
      </div>
      <p class="text-xs text-dark-lightest">{message}</p>
    </div>

    <div class="flex flex-col flex-1 justify-items-end">
      <div
        class="self-end text-lg sm:text-3xl"
        class:text-success={classes == "transactionpositive"}
        class:text-alert={classes == "transactionnegative"}
      >
        <span>
          {Number.parseFloat(
            Web3.utils.fromWei(transfer.amount, "ether")
          ).toFixed(2)}
        </span>
      </div>
      <div class="self-end text-xs text-dark-lightest whitespace-nowrap">
        {#if transfer.time}
          {#if dateOlderThanSevenDays(transfer.time)}
            <Time
              timestamp={new Date(transfer.time * 1000)}
              format="D. MMMM YYYY"
            />
          {:else}
            <Time
              relative
              timestamp={new Date(transfer.time * 1000)}
              live={true}
            />
          {/if}
        {/if}
      </div>
    </div>
  </div>
</section>
