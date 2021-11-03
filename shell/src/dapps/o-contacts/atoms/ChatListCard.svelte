<script lang="ts">
import { push } from "svelte-spa-router";

import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import { Contact, Profile } from "../../../shared/api/data/types";
import { onMount } from "svelte";
import DateView from "../../../shared/atoms/Date.svelte";

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

message = JSON.stringify(param)
let unixTimestamp = parseInt(param.lastContactAt);
let jsonTimestamp = new Date(unixTimestamp).toJSON();

const lastMessage = param.metadata.find(o => o.name == "ChatMessage");
if (lastMessage) {
  message = lastMessage.values[0];
}

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
