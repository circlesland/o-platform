<script lang="ts">
import NotificationProfile from "./NotificationProfile.svelte";

import { MembershipAccepted, ProfileEvent } from "../../api/data/types";

export let event: ProfileEvent;

let payload: MembershipAccepted = <MembershipAccepted>event.payload;
</script>

<div class="flex flex-col items-center space-y-4">
  <div>
    <NotificationProfile profile="{payload.createdBy_profile}" />
  </div>
  <div class="self-center pb-2 text-2xl text-center font-heading">
    invited you to
  </div>

  <NotificationProfile profile="{payload.organisation_profile}" />
</div>

<!-- <NotificationViewMutualFriends eventData="{eventData}" /> -->
