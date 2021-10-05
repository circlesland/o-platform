<script lang="ts">
  import { transfer } from "../../o-banking/processes/transfer";

  import { push } from "svelte-spa-router";

  import ItemCard from "../../../shared/atoms/ItemCard.svelte";
  import { Contact } from "../../../shared/api/data/types";
  import { onMount } from "svelte";
  import Date from "../../../shared/atoms/Date.svelte";
  import { Profile } from "../../../dapps/o-banking/data/api/types";
  export let contact: Contact;

  let pictureUrl: string;
  let displayName: string;
  let safeAddress: string;
  let message: string;
  let contactProfile: Profile;

  onMount(() => {
    contactProfile = contact.contactAddressProfile;
    displayName =
      contactProfile.firstName +
      (contactProfile.lastName ? " " + contactProfile.lastName : "");
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

    console.log("CONTACT: ", contact);
  });

  function loadDetailPage(path) {
    push(`#/chat/${path}`);
  }

  function goToProfile(e, path?: string) {
    if (!path) return;
    e.stopPropagation();
    push(`#/friends/${path}`);
  }
</script>

<div on:click="{() => loadDetailPage(safeAddress)}">
  <ItemCard
    params="{{ edgeless: false, imageProfile: contactProfile, title: displayName, subTitle: message, truncateMain: true }}">

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
