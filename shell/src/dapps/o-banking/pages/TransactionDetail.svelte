<script lang="ts">
  import Time from "svelte-time";
  import { mySafe } from "../stores/safe";

  import BankingDetailHeader from "../atoms/BankingDetailHeader.svelte";
  import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";
  import { Transfer } from "../data/circles/types";
  import Web3 from "web3";
  import Icons from "../../../shared/molecules/Icons.svelte";
  import { push } from "svelte-spa-router";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import CirclesTransferGraph from "../../../shared/pathfinder/CirclesTransferGraph.svelte";

  export let _id: string;

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  let transfer: Transfer;
  let pictureUrl: string;
  let displayName: string;
  let displayableFromName: string;
  let displayableToName: string;
  let classes: string;
  let message: String;
  let amountInWei: string;
  let otherSafeAddress: string;
  let path: any;
  let transactionId: string;

  $: {
    transactionId = _id;

    transfer = $mySafe.transfers.rows.find(o => o._id == transactionId);

    console.log("TRANSFER: ", transfer);

    if (transfer) {
      displayableFromName = transfer.fromProfile
        ? transfer.fromProfile.displayName
        : transfer.from;

      displayableToName = transfer.toProfile
        ? transfer.toProfile.displayName
        : transfer.to;
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

      classes = transfer.direction === "in" ? "text-success" : "text-alert";

      displayableFromName =
        displayableFromName === "0x0000000000000000000000000000000000000000"
          ? "CirclesLand"
          : displayableFromName;

      const m = transfer.tags
        ? transfer.tags.find(o => o.typeId === "o-banking:transfer:message:1")
        : undefined;
      const m2 = m ? m.value : "";
      message =
        displayableFromName === "CirclesLand" ? "Universal basic income" : m2;

      const p = transfer.tags
        ? transfer.tags.find(
            o => o.typeId === "o-banking:transfer:transitivePath:1"
          )
        : undefined;
      const p2 = p ? JSON.parse(p.value) : undefined;
      path = p2;

      amountInWei = RpcGateway.get().utils.fromWei(transfer.amount, "ether");

      otherSafeAddress =
        transfer.direction === "in" ? transfer.from : transfer.to;

      if (!pictureUrl) {
        pictureUrl = AvataarGenerator.generate(otherSafeAddress);
      }
    }
  }

  function openDetail(transfer: Transfer) {
    if (transfer.from.startsWith("0x000")) {
      return;
    }
    push(`#/friends/${otherSafeAddress}`);
  }
</script>

<!-- 
<BankingDetailHeader
  {runtimeDapp}
  {routable}
  amount="{transfer ? transfer.amount : 0}"
  {classes} /> -->
<div class="p-5">
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
            +{Number.parseFloat(Web3.utils.fromWei(transfer ? transfer.amount : '0', 'ether')).toFixed(2)}
          {:else}
            -{Number.parseFloat(Web3.utils.fromWei(transfer ? transfer.amount : '0', 'ether')).toFixed(2)}
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
            <img
              alt="{displayableFromName}"
              src="{transfer.fromProfile && transfer.fromProfile.avatarUrl ? transfer.fromProfile.avatarUrl : transfer.from.startsWith('0x000') ? '/images/common/circles.png' : pictureUrl}" />
          {:else}
            <img
              alt="{transfer.toProfile ? transfer.toProfile.displayName : transfer.to}"
              src="{transfer.toProfile && transfer.toProfile.avatarUrl ? transfer.toProfile.avatarUrl : pictureUrl}" />
          {/if}
        </div>
      </div>
      <div>
        {#if transfer.direction === 'in'}
          <span class="mt-4 text-xl">from {displayableFromName}</span>
        {:else}
          <span class="mt-4 text-xl">to {displayableToName}</span>
        {/if}
      </div>
      <div class="text-dark-lightest">{message ? message : 'No Message'}</div>

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
              timestamp="{new Date(transfer.time * 1000)}"
              format="D. MMMM YYYY HH:mm" />
          </div>
        </div>
      </div>

      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">Amount</div>

        <div class="flex items-center w-full">
          <div class="text-left ">
            {amountInWei} {amountInWei > 1 ? ' Cirlces' : ' Circle'}
          </div>
        </div>
      </div>

      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">From</div>

        <div class="flex items-center w-full">
          <div class="text-left break-all">
            {transfer.fromProfile ? `${transfer.from}` : 'Circlesland'}
          </div>
        </div>
      </div>

      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">To</div>

        <div class="flex items-center w-full">
          <div class="text-left break-all">
            {transfer.toProfile ? `${transfer.to}` : ''}
          </div>
        </div>
      </div>

      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">Block</div>

        <div class="flex items-center w-full">
          <div class="text-left break-all">{transfer.firstBlock}</div>
        </div>
      </div>

      {#if transfer.transactionHash}
        <div class="flex flex-col w-full space-y-1">
          <div class="mb-1 text-left text-2xs text-dark-lightest">
            Transaction Hash
          </div>

          <div class="flex items-center w-full text-primarydark">
            <div class="text-left break-all">
              {transfer.transactionHash ? transfer.transactionHash : ''}
            </div>
          </div>
        </div>
      {/if}

    </div>
  {/if}
</div>
