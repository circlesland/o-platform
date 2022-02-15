<script lang="ts">
import NotificationProfile from "./NotificationProfile.svelte";
import { NotificationViewerContext } from "@o-platform/o-editors/src/notificationViewerContext";
import { CrcTrust, ProfileEvent } from "../../api/data/types";

export let event: ProfileEvent;
export let context: NotificationViewerContext;

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
        : event.contact_address_profile.circlesAddress} has removed their trust to
      you.
    </div>
  {:else}
    <div class="text-center text-dark-lightest">
      {event.contact_address_profile
        ? event.contact_address_profile.firstName
        : event.contact_address_profile.circlesAddress} is trusting you now.
    </div>
  {/if}
</div>
