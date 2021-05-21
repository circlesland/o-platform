<script lang="ts">
  import { Transfer } from "../data/circles/queries";
  import Time from "svelte-time";
  import { mySafe } from "../stores/safe";
  import BankingDetailHeader from "../atoms/BankingDetailHeader.svelte";
  import { push } from "svelte-spa-router";
  import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
  import { createAvatar } from "@dicebear/avatars";
  import * as style from "@dicebear/avatars-avataaars-sprites";

  export let params: {
    _id: string;
  };

  let transfer: Transfer;
  let pictureUrl: string;
  let displayName: string;
  let displayableFromName: string;
  let classes: string;
  let message: String;
  let amountInWei: string;
  let otherSafeAddress: string;

  $: {
    transfer = $mySafe.transfers.rows.find((o) => o._id == params._id);

    if (transfer) {
      displayableFromName = transfer.fromProfile
              ? transfer.fromProfile.displayName
              : transfer.from;

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

      displayableFromName =
              displayableFromName === "0x0000000000000000000000000000000000000000"
                      ? "CirclesLand"
                      : displayableFromName;

      message =
              displayableFromName === "CirclesLand"
                      ? "Universal basic income"
                      : message;


      amountInWei = RpcGateway.get().utils.fromWei(transfer.amount, "ether");

      otherSafeAddress = transfer.direction === "in" ? transfer.from : transfer.to;

      if (!pictureUrl) {
        pictureUrl = createAvatar(style, {
          seed: otherSafeAddress,
          topChance: 100,
          style: "transparent",
          dataUri: true,
        });
      }
    }
  }

  let timestampSevenDays = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
  function dateOlderThanSevenDays(unixTime: Number) {
    return timestampSevenDays > unixTime;
  }
</script>

<BankingDetailHeader amount={transfer ? transfer.amount : 0} {classes} />
{#if transfer}
  <div class="mx-4 -mt-6">
    <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
      <div
        class="flex flex-col bg-white shadow p-4 w-full space-y-2 rounded-sm"
      >
        <div class="text-primary text-xs font-circles font-bold text-left">
          {#if transfer.time}
            {#if dateOlderThanSevenDays(transfer.time)}
              <Time
                timestamp={new Date(transfer.time * 1000)}
                format="D. MMMM YYYY hh:mm"
              />
            {:else}
              <Time relative timestamp={new Date(transfer.time * 1000)} />
            {/if}
          {/if}
        </div>
        <div
          class="flex flex-row justify-center bg-white w-full space-x-2 sm:space-x-6"
        >
          <div
            class="flex flex-col cursor-pointer"
            on:click={() => {
              if (!transfer.from.startsWith("0x000")) {
                push("#/banking/trusts/" + transfer.from);
              }
            }}
          >
            <div class="avatar">
              <div class="rounded-full w-24 h-24  m-auto">
                <img
                  alt={displayableFromName}
                  src={transfer.fromProfile && transfer.fromProfile.avatarUrl
                    ? transfer.fromProfile.avatarUrl
                    : transfer.from.startsWith("0x000")
                    ? "/images/common/circles.png"
                    : pictureUrl}
                />
              </div>
            </div>
            <div class="block text-center mt-2">
              {displayableFromName}
            </div>
          </div>

          <div class="text-xl text-light self-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
          <div
            class="flex flex-col cursor-pointer"
            on:click={() => {
              if (!transfer.to.startsWith("0x000")) {
                push("#/banking/trusts/" + transfer.to);
              }
            }}
          >
            <div class="avatar">
              <div class="rounded-full w-24 h-24  m-auto">
                <img
                  alt={transfer.toProfile
                    ? transfer.toProfile.displayName
                    : transfer.to}
                  src={transfer.toProfile && transfer.toProfile.avatarUrl
                    ? transfer.toProfile.avatarUrl
                    : pictureUrl}
                />
              </div>
            </div>
            <div class="block text-center mt-2">
              {transfer.toProfile
                ? transfer.toProfile.displayName
                : transfer.to}
            </div>
          </div>
        </div>
        <div>
          {transfer.message ? transfer.message : ""}
        </div>
      </div>
    </section>

    <section
      class="flex flex-col items-center justify-center mb-2 text-circlesdarkblue"
    >
      <div
        class="flex flex-col bg-white shadow  pt-4 pr-4 pl-4 pb-1 w-full space-y-2 rounded-sm"
      >
        <div class="text-primary text-xs font-circles font-bold text-left">
          TRANSACTION DETAILS
        </div>
        <div class="flex flex-col w-full space-y-2">
          <div class="w-full flex flex-col">
            <div
              class="w-full h-full overflow-auto bg-white"
              id="journal-scroll"
            >
              <table class="w-full">
                <tbody class="">
                  <tr
                    class="relative transform scale-100 text-xs py-1  border-b border-gray-300 cursor-default"
                  >
                    <td class="pl-5 pr-3 whitespace-no-wrap">
                      <div class="text-gray-400">From</div>
                    </td>

                    <td class="px-2 py-2 whitespace-no-wrap">
                      <div class="leading-5 text-gray-500 font-medium">
                        {displayableFromName}
                      </div>
                      <div class="leading-5 text-gray-900">
                        {transfer.fromProfile ? `${transfer.from}` : ""}
                      </div>
                    </td>
                  </tr>
                  <tr
                    class="relative transform scale-100 text-xs py-1 border-b border-gray-300 cursor-default"
                  >
                    <td class="pl-5 pr-3 whitespace-no-wrap">
                      <div class="text-gray-400">To</div>
                    </td>

                    <td class="px-2 py-2 whitespace-no-wrap">
                      <div class="leading-5 text-gray-500 font-medium">
                        {transfer.toProfile
                          ? transfer.toProfile.displayName
                          : transfer.to}
                      </div>
                      <div class="leading-5 text-gray-900">
                        {transfer.toProfile ? `${transfer.to}` : ""}
                      </div>
                    </td>
                  </tr>
                  <tr
                    class="relative transform scale-100 text-xs py-1 border-b border-gray-300 cursor-default"
                  >
                    <td class="pl-5 pr-3 whitespace-no-wrap">
                      <div class="text-gray-400">Amount</div>
                    </td>

                    <td class="px-2 py-2 whitespace-no-wrap">
                      <div class="leading-5 text-gray-500 font-medium">
                        {amountInWei}
                        {amountInWei > 1 ? " Cirlces" : " Circle"}
                      </div>
                    </td>
                  </tr>
                  {#if message}
                    <tr
                      class="relative transform scale-100 text-xs py-1 border-b border-gray-300 cursor-default"
                    >
                      <td class="pl-5 pr-3 whitespace-no-wrap">
                        <div class="text-gray-400">Message</div>
                      </td>

                      <td class="px-2 py-2 whitespace-no-wrap">
                        <div class="leading-5 text-gray-500 font-medium">
                          {message}
                        </div>
                      </td>
                    </tr>
                  {/if}
                  <tr
                    class="relative transform scale-100 text-xs py-1 cursor-default"
                  >
                    <td class="pl-5 pr-3 whitespace-no-wrap">
                      <div class="text-gray-400">Block</div>
                    </td>

                    <td class="px-2 py-2 whitespace-no-wrap">
                      <div class="leading-5 text-gray-500 font-medium">
                        {transfer.firstBlock}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
{/if}
