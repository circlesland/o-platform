<script lang="ts">
  import TokensHeader from "../atoms/TokensHeader.svelte";
  import { Transfer } from "../data/circles/queries";
  import Time from "svelte-time";
  import { mySafe } from "../stores/safe";
  import TransactionCard from "../atoms/TransactionCard.svelte";
  import BankingDetailHeader from "../atoms/BankingDetailHeader.svelte";
  import {BN} from "ethereumjs-util";
  import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";

  export let params: {
    _id: string;
  };

  let transfer: Transfer;
  let pictureUrl: string;
  let displayName: string;
  let classes: string;

  let amountInWei:string;

  $: {
    transfer = $mySafe.transfers.rows.find((o) => o._id == params._id);
  }

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
  function dateOlderThanSevenDays(unixTime: Number) {
    return timestampSevenDays > unixTime;
  }
</script>

<BankingDetailHeader amount={transfer ? transfer.amount : 0} {classes} />
{#if transfer}
  <div class="mx-4 -mt-6">
    <section
      class="flex flex-col items-center justify-center mb-2 text-circlesdarkblue"
    >
      <div class="flex flex-col bg-white shadow p-4 w-full space-y-2">

        <div class="flex items-center space-x-2 sm:space-x-6 rounded-sm">

            <div class="avatar">
              <div class="rounded-full w-24 h-24  m-auto">
                <img src={transfer.fromProfile ? transfer.fromProfile.avatarUrl : "none"} />
              </div>
            </div>
          ---&gt;
          <div class="avatar">
            <div class="rounded-full w-24 h-24  m-auto">
              <img src={transfer.toProfile ? transfer.toProfile.avatarUrl : "none"}  />
            </div>
          </div>

          <!--<div class="text-left flex-grow truncate relative">
            <div class="truncateThis">
              <h2 class="text-2xl sm:text-3xl">
                {displayName}
              </h2>
            </div>
            <div class="flex flex-1 flex-row justify-items-start">
              <div class="self-start text-{classes}  text-m sm:text-xl">
                <span>
                  {transfer.amount}
                </span>
              </div>
            </div>
          </div>-->
        </div>
      </div>

      <div class="flex flex-col bg-white shadow p-4 w-full space-y-2">
        <b>Date</b>
        {#if dateOlderThanSevenDays(transfer.time)}
          <Time
                  timestamp={new Date(transfer.time * 1000)}
                  format="DD MMMM YYYY - HH:mm"
          />
        {:else}
          <Time relative timestamp={new Date(transfer.time * 1000)} />
        {/if}
        <b>From</b>{transfer.fromProfile ? transfer.fromProfile.displayName : transfer.from} {transfer.fromProfile ? `${transfer.from}` : ""}<br/>
        <b>To</b>{transfer.toProfile ? transfer.toProfile.displayName : transfer.to} {transfer.toProfile ? `${transfer.to}` : ""}<br/>
        <b>Amount</b> {RpcGateway.get().utils.fromWei(transfer.amount)} <br/>
        <b>Block</b> {transfer.firstBlock}
      </div>


    </section>
  </div>
{/if}
