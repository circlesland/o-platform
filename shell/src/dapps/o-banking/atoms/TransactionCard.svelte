<script lang="ts">
  import Time from "svelte-time";
  import { push } from "svelte-spa-router";
  import Web3 from "web3";
  import { Transfer } from "../data/circles/queries";
  import {createAvatar} from "@dicebear/avatars";
  import * as style from "@dicebear/avatars-avataaars-sprites";
  const {AvataarGenerator} = require("src/shared/avataarGenerator");

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
            transfer.direction === "in"
                    ? transfer.from
                    : transfer.to;

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

    message =
      displayName === "CirclesLand" ? "Universal basic income" : message;

    classes =
      transfer.direction === "in"
        ? "transactionpositive"
        : "transactionnegative";


    /*if (!pictureUrl) {
      pictureUrl = createAvatar(style, {
        seed: otherSafeAddress,
        topChance: 100,
        style: "transparent",
        dataUri: true,
      });
    }*/
  }

  let timestampSevenDays = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;

  function loadDetailPage(path) {
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
    class="flex items-center bg-white shadow p-4 w-full space-x-2 sm:space-x-6 rounded-sm"
  >
    <div class="mr-2 text-center">
      <div class="avatar">
        <div class="rounded-full w-12 h-12 sm:w-12 sm:h-12 m-auto mt-1">
          <img src={pictureUrl} alt={otherSafeAddress} />
        </div>
      </div>
    </div>

    <div class="text-left flex-grow truncate relative">
      <div class="truncateThis">
        <h2 class="text-2xl sm:text-3xl">
          {displayName}
        </h2>
      </div>
      <p class="text-sm mt-2 text-light">{message}</p>
    </div>

    <div class="flex flex-1 flex-col justify-items-end">
      <div class="self-end text-{classes} text-2xl sm:text-3xl">
        <span>
          {Number.parseFloat(
            Web3.utils.fromWei(transfer.amount, "ether")
          ).toFixed(2)}
        </span>
      </div>
      <div
        class="self-end mt-2 text-xs text-circleslightblue whitespace-nowrap"
      >
        {#if transfer.time}
          {#if dateOlderThanSevenDays(transfer.time)}
            <Time
              timestamp={new Date(transfer.time * 1000)}
              format="D. MMMM YYYY"
            />
          {:else}
            <Time relative timestamp={new Date(transfer.time * 1000)} />
          {/if}
        {/if}
      </div>
    </div>
  </div>
</section>
