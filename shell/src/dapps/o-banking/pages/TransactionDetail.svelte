<script lang="ts">
  import Time from "svelte-time";
  import {push} from "svelte-spa-router";
  // import CirclesTransferGraph from "../../../shared/pathfinder/CirclesTransferGraph.svelte";
  import {onMount} from "svelte";
  import UserImage from "src/shared/atoms/UserImage.svelte";
  import {me} from "../../../shared/stores/me";
  import {Currency} from "../../../shared/currency";

  import {
    CrcHubTransfer,
    CrcMinting,
    Erc20Transfer,
    EventType,
    Profile,
    ProfileEvent,
  } from "../../../shared/api/data/types";

import Label from "../../../shared/atoms/Label.svelte";
import { myTransactions } from "../../../shared/stores/myTransactions";
import Icons from "../../../shared/molecules/Icons.svelte";

  export let transactionHash: string;

let transfer: ProfileEvent;
let classes: string;
let path: any;
let fromProfile: Profile;
let toProfile: Profile;
let targetProfile: Profile;
let message: string = "";
let error: string;
let displayableName: string = "";

onMount(async () => {
  transfer = await myTransactions.findByPrimaryKey(
    EventType.CrcHubTransfer,
    transactionHash
  );
  if (!transfer) {
    transfer = await myTransactions.findByPrimaryKey(
      EventType.CrcMinting,
      transactionHash
    );
  }
  if (!transfer) {
    transfer = await myTransactions.findByPrimaryKey(
      EventType.Erc20Transfer,
      transactionHash
    )
  }
  if (!transfer) {
    transfer = await myTransactions.findSingleItemFallback(
      [EventType.CrcHubTransfer, EventType.CrcMinting, EventType.Erc20Transfer],
      transactionHash
    );
  }
  if (transfer && transfer.payload?.__typename == "CrcMinting") {
    const minting = transfer.payload as CrcMinting;

    toProfile = minting.to_profile ?? {
      id: 0,
      firstName: minting.to,
      lastName: "",
      circlesAddress: minting.to,
    };
    fromProfile = toProfile;
  }
  if (transfer && transfer.payload?.__typename == "Erc20Transfer") {
    const erc20Transfer = transfer.payload as Erc20Transfer;
    fromProfile = erc20Transfer.from_profile ?? {
      id: 0,
      firstName: erc20Transfer.from,
      lastName: "",
      circlesAddress: erc20Transfer.from,
    };
    toProfile = erc20Transfer.to_profile ?? {
      id: 0,
      firstName: erc20Transfer.to,
      lastName: "",
      circlesAddress: erc20Transfer.to,
    };
  }
  if (transfer && transfer.payload?.__typename == "CrcHubTransfer") {
    const hubTransfer = transfer.payload as CrcHubTransfer;
    fromProfile = hubTransfer.from_profile ?? {
      id: 0,
      firstName: hubTransfer.from,
      lastName: "",
      circlesAddress: hubTransfer.from,
    };
    toProfile = hubTransfer.to_profile ?? {
      id: 0,
      firstName: hubTransfer.to,
      lastName: "",
      circlesAddress: hubTransfer.to,
    };
    path = {
      transfers: hubTransfer.transfers,
    };
  }
  if (transfer) {
    targetProfile = transfer.direction === "in" ? fromProfile : toProfile;
    classes = transfer.direction === "out" ? "text-alert" : "";

    if (transfer.payload) {
      if (transfer.payload?.__typename == "CrcMinting") {
        message = window.i18n("dapps.o-banking.pages.transactionDetail.ubi");
      } else {
        message = transfer.payload.tags?.find(
          (o) => o.typeId === "o-banking:transfer:message:1"
        )?.value;
      }
    }

    displayableName = targetProfile.displayName;
  }
});
function openDetail(transfer: ProfileEvent) {
  if (transfer.type == "CrcHubTransfer") {
    push(`#/contacts/profile/${targetProfile.circlesAddress}`);
  }
}
</script>

<div class="p-5">
  <!--<pre>
    {JSON.stringify(transfer, null, 2)}
  </pre>-->
  {#if transfer}
    <div
      class="flex flex-col items-center self-center w-full m-auto space-y-4 text-center justify-self-center">
      <div class="w-full text-center">
        <h1 class="text-3xl uppercase font-heading">
          {transfer.direction === "in" ? "received" : "sent"}
        </h1>
      </div>
      <div>
        <span class="inline-block text-6xl font-enso {classes}">
          {#if transfer.direction === "in"}
            +{Currency.instance().displayAmount(
              transfer
                ? (transfer.payload.value
                    ? transfer.payload.value
                    : transfer.payload.flow
                  ).toString()
                : "0",
              transfer.timestamp,
              $me.displayCurrency,
              transfer.payload.__typename === "Erc20Transfer" ? "erc20" : ""
            )}
          {:else}
            -{Currency.instance().displayAmount(
              transfer
                ? (transfer.payload.value
                    ? transfer.payload.value
                    : transfer.payload.flow
                  ).toString()
                : "0",
              transfer.timestamp,
              $me.displayCurrency,
              transfer.payload.__typename === "Erc20Transfer" ? "erc20" : ""
            )}
          {/if}
        </span>
        <span class="text-6xl font-enso {classes}"
          >{Currency.currencySymbol["EURS"]}</span>
      </div>
      {#if $me.displayCurrency && $me.displayCurrency != "TIME_CRC"}
        <div class="self-end m-auto -mt-4 space-y-2 text-center max-w-max">
          {Currency.instance().displayAmount(
            transfer
              ? (transfer.payload.value
                  ? transfer.payload.value
                  : transfer.payload.flow
                ).toString()
              : "0",
            transfer.timestamp,
            "TIME_CRC",
            transfer.payload.__typename === "Erc20Transfer" ? "erc20" : ""
          )}
          <Icons icon="timeCircle" size="{4}" customClass="inline" />

          <small class="block whitespace-nowrap">
            <!--{$mySafe.ui.loadingPercent ? $mySafe.ui.loadingText : ''}-->
          </small>
        </div>
      {/if}
      <UserImage profile="{targetProfile}" size="{36}" gradientRing="{true}" />
      <div
        class="cursor-pointer"
        on:click="{() => {
          openDetail(transfer);
        }}">
        {#if transfer.direction === "in"}
          <span class="mt-4 text-xl break-words">
            <Label key="dapps.o-banking.pages.transactionDetail.from"  />
            {displayableName ? displayableName : ""}
          </span>
        {:else}
          <span class="mt-4 text-xl break-words">
            <Label key="dapps.o-banking.pages.transactionDetail.to"  />
            {displayableName ? displayableName : ""}
          </span>
        {/if}
      </div>
      <div class="text-dark-lightest">
        {message && message != undefined ? message : ""}
      </div>
      <!-- {#if path && path.transfers}
        <div class="flex flex-col w-full space-y-1">
          <div class="mb-1 text-left text-2xs text-dark-lightest">
            <Label key="dapps.o-banking.pages.transactionDetail.paymentPath"  />
          </div>
          <div class="flex items-center w-full">
            <CirclesTransferGraph
              transfers="{path.transfers}"
              height="70px"
              onWhiteBackground="{true}" />
          </div>
        </div>
      {/if} -->
      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">
          <Label key="common.date"  />
        </div>
        <div class="flex items-center w-full">
          <div class="text-left ">
            <Time
              timestamp="{new Date(transfer.timestamp)}"
              format="D. MMMM YYYY HH:mm" />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">
          <Label key="dapps.o-banking.pages.transactionDetail.fullAmountCrc"  />
        </div>
        <div class="flex items-center w-full">
          <div class="text-left ">
            {Currency.instance().displayAmount(
              transfer
                ? (transfer.payload.value
                    ? transfer.payload.value
                    : transfer.payload.flow
                  ).toString()
                : "0",
              transfer.timestamp,
              "CRC",
              null,
              true
            )}
          </div>
        </div>
      </div>
      <!-- <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">
          <Label key="dapps.o-banking.pages.transactionDetail.amountCircles"  />
        </div>
        <div class="flex items-center w-full">
          <div class="text-left ">
            {displayCirclesAmount(
              transfer ? (transfer.payload.value ? transfer.payload.value : transfer.payload.flow).toString() : "0",
              transfer.timestamp
            )}
            Circles
          </div>
        </div>
      </div> -->
      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">
          <Label key="common.from"  />
        </div>
        <div class="flex items-center w-full">
          <div class="text-left break-all">{fromProfile.circlesAddress}</div>
        </div>
      </div>
      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">
          <Label key="common.to"  />
        </div>
        <div class="flex items-center w-full">
          <div class="text-left break-all">{toProfile.circlesAddress}</div>
        </div>
      </div>
      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">
          <Label key="common.block"  />
        </div>
        <div class="flex items-center w-full">
          <div class="text-left break-all">{transfer.block_number}</div>
        </div>
      </div>
      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">
          <Label key="dapps.o-banking.pages.transactionDetail.transactionHash"  />
        </div>
        <div class="flex items-center w-full text-primarydark">
          <div class="text-left break-all">
            {transfer.transaction_hash ? transfer.transaction_hash : ""}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
