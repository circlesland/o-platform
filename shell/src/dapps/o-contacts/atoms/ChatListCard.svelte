<script lang="ts">
import { push } from "svelte-spa-router";
import { displayCirclesAmount } from "src/shared/functions/displayCirclesAmount";
import { me } from "../../../shared/stores/me";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import {
  Contact,
  ContactDirection,
  ContactPoint,
  EventType,
  Profile,
} from "../../../shared/api/data/types";
import DateView from "../../../shared/atoms/Date.svelte";

export let param: Contact;

let displayName: string;
let message: string;
let contactProfile: Profile;

// God Help us all...
if (param.contactAddress_Profile) {
  contactProfile = param.contactAddress_Profile;
} else {
  contactProfile = {
    id: 0,
    firstName: param.contactAddress,
    circlesAddress: param.contactAddress,
  };
}

displayName =
  contactProfile.firstName +
  (contactProfile.lastName ? " " + contactProfile.lastName : "");
displayName =
  displayName.length >= 22 ? displayName.substr(0, 22) + "..." : displayName;

const trustMetadata: ContactPoint = param.metadata.find(
  (p) => p.name === "CrcTrust"
);
let trustIn = 0;
let trustOut = 0;
if (trustMetadata) {
  trustMetadata.directions.forEach((d, i) => {
    if (d == ContactDirection.In) {
      trustIn = parseInt(trustMetadata.values[i]);
    } else if (d == ContactDirection.Out) {
      trustOut = parseInt(trustMetadata.values[i]);
    }
  });
}
let trustStatus = "";
if (trustIn > 0 && trustOut > 0) {
  trustStatus = "mutual trust";
} else if (!trustIn && trustOut > 0) {
  trustStatus = "trusted by you";
} else if (trustIn > 0 && !trustOut) {
  trustStatus = "is trusting you";
} else {
  trustStatus = "not trusted";
}

const unixTimestamp = parseInt(param.lastContactAt);
const jsonTimestamp = new Date(unixTimestamp).toJSON();
const mostRecentContactPoint: ContactPoint = param.metadata.find(
  (o: ContactPoint) => o.timestamps.find((o) => o == param.lastContactAt)
);
const mostRecentIndex = mostRecentContactPoint.timestamps.indexOf(
  param.lastContactAt
);
const mostRecentDirection = mostRecentContactPoint.directions[mostRecentIndex];
const mostRecentValue = mostRecentContactPoint.values[mostRecentIndex];

const mostRecentDisplayEvent = {
  type: mostRecentContactPoint.name,
  direction: mostRecentDirection,
  value: mostRecentValue,
};

if (mostRecentDisplayEvent.direction == ContactDirection.In) {
  switch (mostRecentDisplayEvent.type) {
    case EventType.CrcTrust:
      message = `${displayName} ${
        mostRecentDisplayEvent.value > 0 ? "trusted" : "untrusted"
      } you`;
      break;
    case EventType.CrcHubTransfer:
      message = `${displayName} sent you ${displayCirclesAmount(
              mostRecentDisplayEvent.value,
              null,
              true,
              ($me && $me.displayTimeCircles !== undefined ? $me.displayTimeCircles : true) || ($me && $me.displayTimeCircles !== undefined ? $me.displayTimeCircles : true) === undefined
      )} ⦿`;
      break;
    case EventType.Erc20Transfer:
      message = `${displayName} sent you ${displayCirclesAmount(
              mostRecentDisplayEvent.value,
              null,
              true,
              false
      )} tokens`;
      break;
    case EventType.ChatMessage:
      message = `${displayName} wrote: ${mostRecentDisplayEvent.value}`;
      break;
    case EventType.InvitationRedeemed:
      message = `${displayName} redeemed your invitation`;
      break;
    case EventType.MembershipOffer:
      message = `${displayName} invited you to ${mostRecentDisplayEvent.value}`;
      break;
  }
} else {
  switch (mostRecentDisplayEvent.type) {
    case EventType.CrcTrust:
      message = `You ${
        mostRecentDisplayEvent.value > 0 ? "trusted" : "untrusted"
      } ${displayName}`;
      break;
    case EventType.CrcHubTransfer:
      message = `You sent ${displayName} 
      ${displayCirclesAmount(
              mostRecentDisplayEvent.value,
              null,
              true,
              ($me && $me.displayTimeCircles !== undefined ? $me.displayTimeCircles : true) || ($me && $me.displayTimeCircles !== undefined ? $me.displayTimeCircles : true) === undefined
      )} ⦿`;
      break;
    case EventType.Erc20Transfer:
      message = `You sent ${displayName}
      ${displayCirclesAmount(
              mostRecentDisplayEvent.value,
              null,
              true,
              false
      )} token`;
      break;
    case EventType.ChatMessage:
      message = `You wrote: ${mostRecentDisplayEvent.value}`;
      break;
    case EventType.InvitationRedeemed:
      message = `${displayName} invited you to CirclesLand.`;
      break;
    case EventType.MembershipOffer:
      message = `You invited ${displayName} to ${mostRecentDisplayEvent.value}`;
      break;
  }
}

// displayName += ` | ${trustStatus}`;

function loadDetailPage(path) {
  push(`#/friends/chat/${path}`);
}

function goToProfile(e, path?: string) {
  if (!path) return;
  e.stopPropagation();
  push(`#/friends/${path}`);
}
</script>

<!-- on:click|stopPropagation="{() => loadDetailPage(param.contactAddress)}" -->
<div class="cursor-pointer">
  <ItemCard
    params="{{
      edgeless: false,
      imageProfile: param.contactAddress_Profile,
      title: displayName,
      subTitle: message,
      action: () => loadDetailPage(param.contactAddress),
    }}">
    <div slot="itemCardEndSmallElement">
      {#if param.timestamp}
        <DateView time="{jsonTimestamp}" />
      {/if}
    </div>
  </ItemCard>
</div>
