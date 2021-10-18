<script lang="ts">
import { transfer } from "../../o-banking/processes/transfer";

import { push } from "svelte-spa-router";

import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import { Contact } from "../../../shared/api/data/types";
import { onMount } from "svelte";
import Date from "../../../shared/atoms/Date.svelte";
import { Profile } from "../../../dapps/o-banking/data/api/types";

export let param: Contact;

let displayName: string;

let message: string;
let contactProfile: Profile;

// God Help us all...
if (param.contactAddressProfile) {
  contactProfile = param.contactAddressProfile;
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

message = "";
if (param.trustsYou > 0 && param.youTrust > 0) {
  message += "mutual trust | ";
} else if (!param.trustsYou && param.youTrust > 0) {
  message += "trusted by you | ";
} else if (param.trustsYou > 0 && !param.youTrust) {
  message += "is trusting you | ";
} else {
  message += "not trusted | ";
}
message += param.lastEvent ? param.lastEvent.payload.__typename : "";

function loadDetailPage(path) {
  push(`#/chat/${path}`);
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
      imageProfile: contactProfile,
      title: displayName,
      subTitle: message,
      truncateMain: true,
    }}">
    <div slot="itemCardEnd">
      <div class="self-end text-right">
        <span>&nbsp;</span>
      </div>
      <div class="self-end text-xs text-dark-lightest whitespace-nowrap">
        {#if param.lastContactAt}
          <Date time="{param.lastContactAt}" />
        {/if}
      </div>
    </div>
  </ItemCard>
</div>
