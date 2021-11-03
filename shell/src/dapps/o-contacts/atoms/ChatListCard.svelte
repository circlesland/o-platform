<script lang="ts">
import { push } from "svelte-spa-router";

import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import {Contact2, ContactDirection, ContactPoint, ContactPointSource, Profile} from "../../../shared/api/data/types";
import DateView from "../../../shared/atoms/Date.svelte";

export let param: Contact2;

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


const trustMetadata:ContactPointSource = param.metadata.find(p => p.name === "CrcTrust");
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
const mostRecentContactPoint:ContactPoint = param.metadata.find((o:ContactPoint) => o.timestamps.find(o => o == param.lastContactAt));
const mostRecentIndex = mostRecentContactPoint.timestamps.indexOf(param.lastContactAt);
const mostRecentDirection = mostRecentContactPoint.directions[mostRecentIndex];
const mostRecentValue = mostRecentContactPoint.values[mostRecentIndex];

const mostRecentDisplayEvent = {
  type: mostRecentContactPoint.name,
  direction: mostRecentDirection,
  value: mostRecentValue
};

if (mostRecentDisplayEvent.direction == ContactDirection.In) {
  switch (mostRecentDisplayEvent.type) {
    case "CrcTrust":
      message = `${displayName} ${mostRecentDisplayEvent.value > 0 ? "trusted" : "untrusted"} you`
      break;
    case "CrcHubTransfer":
      message = `${displayName} sent you ${mostRecentDisplayEvent.value} CRC`
      break;
    case "ChatMessage":
      message = `${displayName} wrote: ${mostRecentDisplayEvent.value}`
      break;
    case "Invitation":
      message = `${displayName} invited you to CirclesLand`
      break;
    case "MembershipOffer":
      message = `${displayName} invited you to ${mostRecentDisplayEvent.value}`
      break;
  }
} else {
  switch (mostRecentDisplayEvent.type) {
    case "CrcTrust":
      message = `You ${mostRecentDisplayEvent.value > 0 ? "trusted" : "untrusted"} ${displayName}`
      break;
    case "CrcHubTransfer":
      message = `You send ${displayName} ${mostRecentDisplayEvent.value} CRC`
      break;
    case "ChatMessage":
      message = `You wrote: ${mostRecentDisplayEvent.value}`
      break;
    case "Invitation":
      message = `${displayName} accepted your invitation to CirclesLand.`
      break;
    case "MembershipOffer":
      message = `You invited ${displayName} to ${mostRecentDisplayEvent.value}`
      break;
  }
}

displayName += ` | ${trustStatus}`;

function loadDetailPage(path) {
  push(`#/friends/chat/${path}`);
}

function goToProfile(e, path?: string) {
  if (!path) return;
  e.stopPropagation();
  push(`#/friends/${path}`);
}

</script>

<div on:click="{() => loadDetailPage(param.contactAddress)}">
  <ItemCard
    params="{{
      edgeless: false,
      imageProfile: param.contactAddress_Profile,
      title: message,
      subTitle: displayName,
      truncateMain: true,
    }}">
    <div slot="itemCardEnd">
      <div class="self-end text-right">
        <span>&nbsp;</span>
      </div>
      <div class="self-end text-xs text-dark-lightest whitespace-nowrap">
        {#if param.lastContactAt}
          <DateView time={jsonTimestamp} />
        {/if}
      </div>
    </div>
  </ItemCard>
</div>
