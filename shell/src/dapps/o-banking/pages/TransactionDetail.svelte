<script lang="ts">
  import Time from "svelte-time";
  import { mySafe } from "../stores/safe";
  import BankingDetailHeader from "../atoms/BankingDetailHeader.svelte";
  import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";
  import {showProfile} from "src/dapps/o-banking/processes/showProfile";
  import {shellProcess} from "src/shared/processes/shellProcess";
  import {RunProcess} from "@o-platform/o-process/dist/events/runProcess";
  import {Generate} from "@o-platform/o-utils/dist/generate";
  import {Transfer} from "../data/circles/types";

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

      otherSafeAddress =
        transfer.direction === "in" ? transfer.from : transfer.to;

      if (!pictureUrl) {
        pictureUrl = AvataarGenerator.generate(otherSafeAddress);
      }
    }
  }

  function openDetail(id:string) {
    if (id.startsWith("0x000")) {
      return;
    }

    const modifier = async (ctx) => {
      ctx.childProcessDefinition = showProfile;
      ctx.childContext = {
        data: {
          id
        },
      };
      return ctx;
    };

    const requestEvent = new RunProcess(shellProcess, true, modifier);
    requestEvent.id = Generate.randomHexString(8);
    window.o.publishEvent(requestEvent);
  }
</script>

<BankingDetailHeader amount={transfer ? transfer.amount : 0} {classes} />
{#if transfer}
  <div class="mx-4 -mt-6">
    <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
      <div
        class="flex flex-col w-full p-4 space-y-2 bg-white rounded-sm shadow"
      >
        <div
          class="flex flex-row justify-center w-full pt-2 space-x-2 bg-white sm:space-x-6"
        >
          <div
            class="flex flex-col cursor-pointer"
            on:click={() => openDetail(transfer.from)}
          >
            <div class="avatar">
              <div class="w-24 h-24 m-auto rounded-full">
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
            <div class="block mt-2 text-center">
              {displayableFromName}
            </div>
          </div>

          <div class="self-center text-xl text-light">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-12 h-12"
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
            on:click={() => openDetail(transfer.to)}
          >
            <div class="avatar">
              <div class="w-24 h-24 m-auto rounded-full">
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
            <div class="block mt-2 text-center">
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
        class="flex flex-col w-full pt-4 pb-1 pl-4 pr-4 space-y-2 bg-white rounded-sm shadow"
      >
        <div class="text-xs font-bold text-left text-primary font-circles">
          TRANSACTION DETAILS
        </div>
        <div class="flex flex-col w-full space-y-2">
          <div class="flex flex-col w-full">
            <div
              class="w-full h-full overflow-auto bg-white"
              id="journal-scroll"
            >
              <table class="w-full">
                <tbody class="">
                  <tr
                    class="relative py-1 text-xs transform scale-100 border-b border-gray-300 cursor-default"
                  >
                    <td class="pl-5 pr-3 whitespace-no-wrap">
                      <div class="text-gray-400">Date</div>
                    </td>

                    <td class="px-2 py-2 whitespace-no-wrap">
                      <div class="font-medium leading-5 text-gray-500">
                        <Time
                          timestamp={new Date(transfer.time * 1000)}
                          format="D. MMMM YYYY HH:mm"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr
                    class="relative py-1 text-xs transform scale-100 border-b border-gray-300 cursor-default"
                  >
                    <td class="pl-5 pr-3 whitespace-no-wrap">
                      <div class="text-gray-400">From</div>
                    </td>

                    <td class="px-2 py-2 whitespace-no-wrap">
                      <div class="font-medium leading-5 text-gray-500">
                        {displayableFromName}
                      </div>
                      <div class="leading-5 text-gray-900">
                        {transfer.fromProfile ? `${transfer.from}` : ""}
                      </div>
                    </td>
                  </tr>
                  <tr
                    class="relative py-1 text-xs transform scale-100 border-b border-gray-300 cursor-default"
                  >
                    <td class="pl-5 pr-3 whitespace-no-wrap">
                      <div class="text-gray-400">To</div>
                    </td>

                    <td class="px-2 py-2 whitespace-no-wrap">
                      <div class="font-medium leading-5 text-gray-500">
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
                    class="relative py-1 text-xs transform scale-100 border-b border-gray-300 cursor-default"
                  >
                    <td class="pl-5 pr-3 whitespace-no-wrap">
                      <div class="text-gray-400">Amount</div>
                    </td>

                    <td class="px-2 py-2 whitespace-no-wrap">
                      <div class="font-medium leading-5 text-gray-500">
                        {amountInWei}
                        {amountInWei > 1 ? " Cirlces" : " Circle"}
                      </div>
                    </td>
                  </tr>
                  {#if message}
                    <tr
                      class="relative py-1 text-xs transform scale-100 border-b border-gray-300 cursor-default"
                    >
                      <td class="pl-5 pr-3 whitespace-no-wrap">
                        <div class="text-gray-400">Message</div>
                      </td>

                      <td class="px-2 py-2 whitespace-no-wrap">
                        <div class="font-medium leading-5 text-gray-500">
                          {message}
                        </div>
                      </td>
                    </tr>
                  {/if}
                  <tr
                    class="relative py-1 text-xs transform scale-100 cursor-default"
                  >
                    <td class="pl-5 pr-3 whitespace-no-wrap">
                      <div class="text-gray-400">Block</div>
                    </td>

                    <td class="px-2 py-2 whitespace-no-wrap">
                      <div class="font-medium leading-5 text-gray-500">
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
