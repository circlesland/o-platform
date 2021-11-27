<script lang="ts">
import { push } from "svelte-spa-router";
import { me } from "../../../shared/stores/me";

import Date from "../../../shared/atoms/Date.svelte";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import { onMount } from "svelte";
import { displayCirclesAmount } from "src/shared/functions/displayCirclesAmount";
import {
  CrcHubTransfer,
  CrcMinting,
  Erc20Transfer,
  Profile,
  ProfileEvent,
} from "../../../shared/api/data/types";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";

export let event: ProfileEvent;

let path: any;
let fromProfile: Profile = <any>{};
let toProfile: Profile = <any>{};
let error: string;
let message: string | undefined = undefined;
let targetProfile: Profile = <any>{};
let amount: string = "";

if (event && event.payload?.__typename == "CrcMinting") {
  const minting = event.payload as CrcMinting;

  toProfile = minting.to_profile ?? {
    id: 0,
    firstName: minting.to.substr(0, 24) + "...",
    lastName: "",
    circlesAddress: minting.to,
  };

  fromProfile = toProfile;

  amount = displayCirclesAmount(
    event.payload && event.payload.value ? event.payload.value.toString() : "0",
    event.timestamp,
    true,
    $me.displayTimeCircles || $me.displayTimeCircles === undefined
  );

  message = "Universal basic income";
}

if (event && event.payload?.__typename == "Erc20Transfer") {
  const ercTransfer = event.payload as Erc20Transfer;
  fromProfile = ercTransfer.from_profile ?? {
    id: 0,
    firstName: "Circles Land",
    lastName: "",
    avatarUrl: "/logos/erc20.png",
    circlesAddress: ercTransfer.from,
  };

  toProfile = ercTransfer.to_profile ?? {
    id: 0,
    firstName: ercTransfer.to.substr(0, 24) + "...",
    lastName: "",
    circlesAddress: ercTransfer.to,
  };
  amount = parseFloat(
    RpcGateway.get().utils.fromWei(ercTransfer.value, "ether")
  ).toFixed(2);
  message = "ERC-20 Transfer";
}

if (event && event.payload?.__typename == "CrcHubTransfer") {
  const hubTransfer = event.payload as CrcHubTransfer;
  fromProfile = hubTransfer.from_profile ?? {
    id: 0,
    firstName: hubTransfer.from.substr(0, 24) + "...",
    lastName: "",
    circlesAddress: hubTransfer.from,
  };

  toProfile = hubTransfer.to_profile ?? {
    id: 0,
    firstName: hubTransfer.to.substr(0, 24) + "...",
    lastName: "",
    circlesAddress: hubTransfer.to,
  };

  path = {
    transfers: hubTransfer.transfers,
  };

  message = hubTransfer.tags?.find(
    (o) => o.typeId === "o-banking:transfer:message:1"
  )?.value;

  amount = displayCirclesAmount(
    event.payload && event.payload.flow ? event.payload.flow.toString() : "0",
    event.timestamp,
    true,
    $me.displayTimeCircles || $me.displayTimeCircles === undefined
  );

  if (event.direction == "out") {
    amount = "-" + amount;
  }
}

targetProfile = event.direction === "in" ? fromProfile : toProfile;

function loadDetailPage(path) {
  push(`#/banking/transactions/${path}`);
}
</script>

<div on:click="{() => loadDetailPage(event.transaction_hash)}">
  <ItemCard
    params="{{
      edgeless: false,
      imageProfile: targetProfile,
      profileLink: `#/friends/${targetProfile.circlesAddress}`,
      imageAlt:
        event.direction === 'in'
          ? fromProfile.circlesAddress
          : toProfile.circlesAddress,
      title:
        targetProfile.firstName +
        ' ' +
        (!targetProfile.lastName ? '' : targetProfile.lastName),
      subTitle: message ? message : '',
      truncateMain: true,
      endTextBig: amount,
      endTextBigClass: amount.startsWith('-') ? 'text-alert' : undefined,
    }}">
    <div slot="itemCardEndSmallElement">
      {#if event.timestamp}
        <Date time="{event.timestamp}" />
      {/if}
    </div>
  </ItemCard>
</div>
