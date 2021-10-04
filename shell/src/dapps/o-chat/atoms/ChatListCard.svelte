<script lang="ts">
  import { transfer } from "../../o-banking/processes/transfer";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";
  import { push } from "svelte-spa-router";

  import ItemCard from "../../../shared/atoms/ItemCard.svelte";
  import { Contact } from "../../../shared/api/data/types";
  import { onMount } from "svelte";
  import Date from "../../../shared/atoms/Date.svelte";

  export let contact: Contact;

  let pictureUrl: string;
  let displayName: string;
  let safeAddress: string;
  let message: string;

  onMount(() => {
    const contactProfile = contact.contactAddressProfile;
    displayName =
      contactProfile.firstName +
      (contactProfile.lastName ? " " + contactProfile.lastName : "");
    pictureUrl = contactProfile.avatarUrl
      ? contactProfile.avatarUrl
      : contactProfile.circlesAddress
      ? AvataarGenerator.generate(contactProfile.circlesAddress)
      : null;
    safeAddress = contactProfile.circlesAddress;
    message = "";
    if (contact.trustsYou > 0 && contact.youTrust > 0) {
      message += "mutual trust | ";
    } else if (!contact.trustsYou && contact.youTrust > 0) {
      message += "trusted by you | ";
    } else if (contact.trustsYou > 0 && !contact.youTrust) {
      message += "is trusting you | ";
    } else {
      message += "not trusted | ";
    }
    message += contact.lastEvent ? contact.lastEvent.payload.__typename : "";
  });

  function loadDetailPage(path) {
    push(`#/chat/${path}`);
  }

  function execTransfer(recipientAddress?: string) {
    window.o.runProcess(transfer, {
      recipientAddress,
      safeAddress: safeAddress,
      privateKey: localStorage.getItem("circlesKey"),
    });
  }

  function goToProfile(e, path?: string) {
    if (!path) return;
    e.stopPropagation();
    push(`#/friends/${path}`);
  }
</script>

<div on:click="{() => loadDetailPage(safeAddress)}">
  <ItemCard
    params="{{ edgeless: false, imageUrl: pictureUrl, title: displayName, subTitle: message, truncateMain: true, imageAction: e => {
        push(`#/friends/${contact.contactAddress}`);
        e.stopPropagation();
      } }}">
    <div slot="itemCardStart">
      <div class="inline-flex">
        <div class="m-auto mt-1 rounded-full w-11 h-11 sm:w-12 sm:h-12">
          <a on:click="{e => goToProfile(e, safeAddress)}">
            <img class="rounded-full" src="{pictureUrl}" alt="{displayName}" />
          </a>
        </div>
      </div>
    </div>
    <div slot="itemCardEnd">
      <div class="self-end text-right">
        <span>&nbsp;</span>
      </div>
      <div class="self-end text-xs text-dark-lightest whitespace-nowrap">
        {#if contact.lastContactAt}
          <Date time="{contact.lastContactAt}" />
        {/if}
      </div>
    </div>
  </ItemCard>
</div>
