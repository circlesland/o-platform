<script lang="ts">
import NotificationProfile from "./NotificationProfile.svelte";

import { MembershipOffer, ProfileEvent } from "../../api/data/types";

import Label from "../../atoms/Label.svelte";


export let event: ProfileEvent;

let payload: MembershipOffer = <MembershipOffer>event.payload;
</script>

<div class="flex flex-col items-center space-y-4">
  <div>
    <NotificationProfile profile="{payload.createdBy_profile}" />
  </div>
  <div class="self-center pb-2 text-2xl text-center font-heading">
    <Label key="shared.molecules.notificationViewer.molecules.notificationViewMembershipOffer.invitedYouTo"  />
  </div>

  <NotificationProfile profile="{payload.organisation_profile}" />
</div>

<!-- <NotificationViewMutualFriends eventData="{eventData}" /> -->
