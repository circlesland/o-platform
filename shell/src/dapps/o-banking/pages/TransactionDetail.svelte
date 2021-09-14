<script lang="ts">
  import Time from "svelte-time";

  import Web3 from "web3";
  import { push } from "svelte-spa-router";
  import {
    CrcHubTransfer,
    CrcMinting, Profile,
    ProfileEvent,
    TransactionByHashDocument
  } from "../data/api/types";

  import CirclesTransferGraph from "../../../shared/pathfinder/CirclesTransferGraph.svelte";
  import {onMount} from "svelte";
  import {AvataarGenerator} from "../../../shared/avataarGenerator";
  import {me} from "../../../shared/stores/me";

  export let transactionHash: string;

  let transfer: ProfileEvent;
  let classes: string;
  let path: any;
  let fromProfile: Profile;
  let toProfile: Profile;
  let error:string;

  onMount(async () => {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const timeline = await apiClient.query({
      query: TransactionByHashDocument,
      variables: {
        safeAddress: $me.circlesAddress,
        transactionHash
      }
    });

    if (timeline.errors) {
      throw new Error(`Couldn't load the transaction history for the following reasons: ${timeline.errors.join("\n")}`);
    }

    if (timeline.data.eventByTransactionHash.length > 0) {
      transfer = timeline.data.eventByTransactionHash[0];
    }

    if (transfer && transfer.payload?.__typename == "CrcMinting") {
      const minting = transfer.payload as CrcMinting;
      fromProfile = minting.from_profile ?? {
        id: 0,
        firstName: "Circles Land",
        lastName: "",
        avatarUrl: "/images/common/circles.png",
        circlesAddress: minting.from,
      }
      if (!fromProfile.avatarUrl) {
        fromProfile.avatarUrl = AvataarGenerator.generate(minting.from);
      }
      toProfile = minting.to_profile ?? {
        id: 0,
        firstName: minting.to,
        lastName: "",
        circlesAddress: minting.to
      }
      if (!toProfile.avatarUrl) {
        toProfile.avatarUrl = AvataarGenerator.generate(minting.to);
      }
    }

    if (transfer && transfer.payload?.__typename == "CrcHubTransfer") {
      const hubTransfer = transfer.payload as CrcHubTransfer;
      fromProfile = hubTransfer.from_profile ?? {
        id: 0,
        firstName: hubTransfer.from,
        lastName: "",
        circlesAddress: hubTransfer.from,
      }
      if (!fromProfile.avatarUrl) {
        fromProfile.avatarUrl = AvataarGenerator.generate(hubTransfer.from);
      }
      toProfile = hubTransfer.to_profile ?? {
        id: 0,
        firstName: hubTransfer.to,
        lastName: "",
        circlesAddress: hubTransfer.to
      }
      if (!toProfile.avatarUrl) {
        toProfile.avatarUrl = AvataarGenerator.generate(hubTransfer.to);
      }
      path = {
        transfers: hubTransfer.transfers
      };
    }
  });

  function openDetail(transfer: ProfileEvent) {
    if (transfer.type == "crc_hub_transfer") {
      const hubTransfer = <CrcHubTransfer>transfer.payload;
      if (transfer.direction == "in") {
        if (hubTransfer.from.startsWith("0x00000")) {
          return;
        }
        push(`#/friends/${hubTransfer.from}`);
      } else {
        if (hubTransfer.to.startsWith("0x00000")) {
          return;
        }
        push(`#/friends/${hubTransfer.to}`);
      }
    }
  }
</script>

<!-- 
<BankingDetailHeader
  {runtimeDapp}
  {routable}
  amount="{transfer ? transfer.amount : 0}"
  {classes} /> -->
<div class="p-5">
  <!--<pre>
    {JSON.stringify(transfer, null, 2)}
  </pre>-->
  {#if transfer}
    <div
      class="flex flex-col items-center self-center w-full m-auto space-y-4 text-center justify-self-center">
      <div class="w-full text-center">
        <h1 class="text-3xl uppercase font-heading">
          {transfer.direction === 'in' ? 'received' : 'sent'}
        </h1>
      </div>
      <div>
        <span class="inline-block text-6xl font-heading {classes}">
          {#if transfer.direction === 'in'}
            +{Number.parseFloat(Web3.utils.fromWei(transfer ? transfer.value.toString() : '0', 'ether')).toFixed(2)}
          {:else}
            -{Number.parseFloat(Web3.utils.fromWei(transfer ? transfer.value.toString() : '0', 'ether')).toFixed(2)}
          {/if}

          <svg
            class="inline w-10 h-10 -ml-2"
            viewBox="0 0 229 255"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M118.5 237C150.437 237 179.424 224.366 200.734 203.822C209.904
              197.627 215.933 187.136 215.933 175.236C215.933 156.198 200.499
              140.764 181.461 140.764C170.572 140.764 160.863 145.812 154.545
              153.695L154.457 153.627C145.313 163.112 132.476 169.012 118.261
              169.012C90.4957 169.012 67.9879 146.504 67.9879 118.739C67.9879
              90.9745 90.4957 68.4667 118.261 68.4667C132.339 68.4667 145.067
              74.254 154.193 83.5795L154.29 83.5037C160.581 90.2293 169.535
              94.4328 179.471 94.4328C198.51 94.4328 213.944 78.9988 213.944
              59.9601C213.944 48.1884 208.043 37.7949 199.039 31.5755C177.899
              11.9794 149.599 0 118.5 0C53.0543 0 0 53.0543 0 118.5C0 183.946
              53.0543 237 118.5 237Z"
              fill="currentColor"></path>
            <ellipse
              cx="118.979"
              cy="118.739"
              rx="26.5727"
              ry="26.3333"
              fill="currentColor"></ellipse>
          </svg>
        </span>
      </div>
      <div
        class="cursor-pointer avatar rounded-corners-gradient-borders"
        on:click="{() => openDetail(transfer)}">
        <div class="m-auto bg-white rounded-full w-36 h-36">
          {#if transfer.direction === 'in'}
            <img alt="{fromProfile.firstName + ' ' + fromProfile.lastName}"
                 src={fromProfile.avatarUrl} />
          {:else}
            <img alt="{toProfile.firstName + ' ' + toProfile.lastName}"
                 src={toProfile.avatarUrl} />
          {/if}
        </div>
      </div>
      <div>
        {#if transfer.direction === 'in'}
          <span class="mt-4 text-xl">from {fromProfile.firstName + " " + fromProfile.lastName}</span>
        {:else}
          <span class="mt-4 text-xl">to {toProfile.firstName + " " + toProfile.lastName}</span>
        {/if}
      </div>
      <div class="text-dark-lightest">{'No Message'}</div>

      {#if path && path.transfers}
        <div class="flex flex-col w-full space-y-1">
          <div class="mb-1 text-left text-2xs text-dark-lightest">
            Payment Path
          </div>
          <div class="flex items-center w-full">
            <CirclesTransferGraph
              transfers="{path.transfers}"
              height="70px"
              onWhiteBackground="{true}" />
          </div>
        </div>
      {/if}
      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">Date</div>

        <div class="flex items-center w-full">
          <div class="text-left ">
            <Time
              timestamp="{new Date(Number.parseInt(transfer.timestamp))}"
              format="D. MMMM YYYY HH:mm" />
          </div>
        </div>
      </div>

      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">Amount</div>

        <div class="flex items-center w-full">
          <div class="text-left ">
            {Number.parseFloat(Web3.utils.fromWei(transfer ? transfer.value.toString() : '0', 'ether')).toFixed(2)}  Circles
          </div>
        </div>
      </div>

      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">From</div>

        <div class="flex items-center w-full">
          <div class="text-left break-all">
            {fromProfile.circlesAddress}
          </div>
        </div>
      </div>

      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">To</div>

        <div class="flex items-center w-full">
          <div class="text-left break-all">
            {toProfile.circlesAddress}
          </div>
        </div>
      </div>

      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">Block</div>

        <div class="flex items-center w-full">
          <div class="text-left break-all">{transfer.block_number}</div>
        </div>
      </div>

      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">
          Transaction Hash
        </div>

        <div class="flex items-center w-full text-primarydark">
          <div class="text-left break-all">
            {transfer.transaction_hash ? transfer.transaction_hash : ''}
          </div>
        </div>
      </div>

    </div>
  {/if}
</div>
