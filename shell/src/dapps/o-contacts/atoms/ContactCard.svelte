<script lang="ts">
import { push } from "svelte-spa-router";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import {
  Contact,
  ContactDirection,
  ContactPoint,
  ContactPointSource,
} from "../../../shared/api/data/types";
import { onMount } from "svelte";

import { _ } from "svelte-i18n";
import {trustFromContactMetadata} from "../../../shared/functions/trustFromContactMetadata";

export let contact: Contact;
export let hideUntrusted: boolean = false;

let displayName: string;
let safeAddress: string;
let message: string;
let untrusted: boolean = false;

onMount(() => {
  displayName = contact.contactAddress_Profile.displayName;
  safeAddress = contact.contactAddress;
  message = "";

  const {trustIn, trustOut} = trustFromContactMetadata(contact);

  if (trustIn > 0 && trustOut > 0) {
    message += `${$_("dapps.o-contacts.atoms.contactCard.mutualTrust")}`;
  } else if (!trustIn && trustOut > 0) {
    message += `${$_("dapps.o-contacts.atoms.contactCard.trustedByYou")}`;
  } else if (trustIn > 0 && !trustOut) {
    message += `${$_("dapps.o-contacts.atoms.contactCard.isTrustingYou")}`;
  } else {
    untrusted = hideUntrusted;
    message += `${$_("dapps.o-contacts.atoms.contactCard.notTrusted")}`;
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

{#if !untrusted}
  <div on:click="{() => loadDetailPage(safeAddress)}" class="cursor-pointer">
    <ItemCard
      params="{{
        edgeless: false,
        imageProfile: contact.contactAddress_Profile,
        title: displayName,
        subTitle: message,
        truncateMain: true,
        mobileTextCutoff: 24,
      }}">
      <div slot="itemCardEnd">
        <div class="self-end text-lg sm:text-3xl"></div>
      </div>
    </ItemCard>
  </div>
{/if}
