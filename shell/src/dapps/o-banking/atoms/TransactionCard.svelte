<script lang="ts">
  import Time from "svelte-time";
  import { push } from "svelte-spa-router";
  import Web3 from "web3";
  import { Transfer } from "../data/circles/queries";
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import {
    showProfile,
    ShowProfileContextData,
  } from "../processes/showProfile";
  import { Generate } from "@o-platform/o-utils/dist/generate";
  import { showTransaction } from "../processes/showTransaction";

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

    message =
      displayName === "CirclesLand" ? "Universal basic income" : message;

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
    //push("#/banking/trusts/" + path);

    const requestEvent = new RunProcess<ShellProcessContext>(
      shellProcess,
      true,
      async (ctx) => {
        showProfile;
        ctx.childProcessDefinition = showTransaction;
        ctx.childContext = {
          data: <ShowProfileContextData>{
            id: path,
          },
        };
        return ctx;
      }
    );

    requestEvent.id = Generate.randomHexString(8);
    window.o.publishEvent(requestEvent);
  }
</script>

<section
  on:click={() => loadDetailPage(transfer._id)}
  class="flex items-center justify-center mb-2 "
>
  <div
    class="flex items-center w-full px-3 py-2 space-x-2 bg-white rounded-sm shadow sm:space-x-6"
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
      <p class="text-xs text-light-dark">{message}</p>
    </div>

    <div class="flex flex-col flex-1 justify-items-end">
      <div class="self-end text-{classes} text-lg sm:text-3xl">
        <span>
          {Number.parseFloat(
            Web3.utils.fromWei(transfer.amount, "ether")
          ).toFixed(2)}
        </span>
      </div>
      <div class="self-end text-xs text-light whitespace-nowrap">
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
