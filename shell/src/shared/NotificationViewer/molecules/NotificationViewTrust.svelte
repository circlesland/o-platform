<script lang="ts">
import NotificationProfile from "./NotificationProfile.svelte";
import { CrcTrust, ProfileEvent } from "../../api/data/types";
import { _ } from "svelte-i18n";
import Label from "../../atoms/Label.svelte";

export let event: ProfileEvent;

let payload: CrcTrust = <CrcTrust>event.payload;
</script>

<div class="flex flex-col space-y-4">
  <NotificationProfile
    profile="{event.contact_address_profile}"
    showPassion="{false}" />

  {#if payload.limit == 0}
    <div class="text-center text-dark-lightest">
      {event.contact_address_profile
        ? event.contact_address_profile.firstName
        : event.contact_address_profile.circlesAddress}
      <Label key="shared.molecules.notificationViewer.molecules.notificationViewTrust.hasRemovedTheirTrustToYou"></Label>
    </div>
  {:else}
    <div class="text-center text-dark-lightest">
      {event.contact_address_profile
        ? event.contact_address_profile.firstName
        : event.contact_address_profile.circlesAddress}
      <Label key="shared.molecules.notificationViewer.molecules.notificationViewTrust.isTrustingYouNow"></Label>
    </div>
  {/if}
</div>
