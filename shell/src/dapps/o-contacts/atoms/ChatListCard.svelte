<script lang="ts">
import { push } from "svelte-spa-router";

import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import {Contact2, ContactDirection, ContactPoint, Profile} from "../../../shared/api/data/types";
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

const unixTimestamp = parseInt(param.lastContactAt);
const jsonTimestamp = new Date(unixTimestamp).toJSON();
const mostRecentContactPoint:ContactPoint = param.metadata.find((o:ContactPoint) => o.timestamps.find(o => o == param.lastContactAt));
const mostRecentIndex = mostRecentContactPoint.timestamps.indexOf(param.lastContactAt);
const mostRecentDirection = mostRecentContactPoint.directions[mostRecentIndex];
const mostRecentValue = mostRecentContactPoint.values[mostRecentIndex];

message = JSON.stringify({
  type: mostRecentContactPoint.name,
  direction: mostRecentDirection,
  value: mostRecentValue
});

function loadDetailPage(path) {
  push(`#/friends/chat/${path}`);
}

function goToProfile(e, path?: string) {
  if (!path) return;
  e.stopPropagation();
  push(`#/friends/${path}`);
}

function formatLastEvent(lastContact: ContactPoint) {
  switch (lastContact.name) {
    case "CrcTrust":
      let trustIn = 0;
      let trustOut = 0;
      lastContact.directions.forEach((d, i) => {
        if (d == ContactDirection.In) {
          trustIn = parseInt(lastContact.values[i]);
        } else if (d == ContactDirection.Out) {
          trustOut = parseInt(lastContact.values[i]);
        }
      });

      if (trustIn > 0 && trustOut > 0) {
        return "mutual trust";
      } else if (!trustIn && trustOut > 0) {
        return "trusted by you";
      } else if (trustIn > 0 && !trustOut) {
        return "is trusting you";
      } else {
        return "not trusted";
      }
      break;
    case "CrcHubTransfer":
      return `Transferred ${0} CRC`;

    case "ChatMessage":
      return lastContact.values[0];

    case "Invitation":
      return `Invitation`;

    case "MembershipOffer":
      return `Membership offer`;

    default: break;
  }
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
