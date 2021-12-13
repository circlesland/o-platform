<script lang="ts">
import { push } from "svelte-spa-router";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import { Contact } from "../../../shared/api/data/types";
import { onMount } from "svelte";

export let contact: Contact;

let displayName: string;
let safeAddress: string;
let message: string;

onMount(() => {
  displayName = `${contact.contactAddressProfile.firstName} ${
    contact.contactAddressProfile.lastName
      ? contact.contactAddressProfile.lastName
      : ""
  }`;
  safeAddress = contact.contactAddress;
  message = "";
  if (contact.trustsYou > 0 && contact.youTrust > 0) {
    message += "mutual trust";
  } else if (!contact.trustsYou && contact.youTrust > 0) {
    message += "trusted by you";
  } else if (contact.trustsYou > 0 && !contact.youTrust) {
    message += "is trusting you";
  } else {
    message += "not trusted";
  }
});

function loadDetailPage(path) {
  push(`#/contacts/profile/${path}`);
}

function execTransfer(recipientAddress?: string) {
  /*
    window.o.runProcess(transfer, {
      recipientAddress,
      safeAddress: tryGetCurrentSafe()?.safeAddress,
      privateKey: sessionStorage.getItem("circlesKey"),
    });
     */
}

function goToProfile(e, path?: string) {
  if (!path) return;
  e.stopPropagation();
  push(`#/contacts/profile/${path}`);
  return false;
}
</script>

<div on:click="{() => loadDetailPage(safeAddress)}">
  <ItemCard
    params="{{
      edgeless: false,
      imageProfile: contact.contactAddressProfile,
      title: displayName,
      subTitle: message,
      truncateMain: true,
    }}">
    <div slot="itemCardEnd">
      <div class="self-end text-lg sm:text-3xl"></div>
    </div>
  </ItemCard>
</div>
