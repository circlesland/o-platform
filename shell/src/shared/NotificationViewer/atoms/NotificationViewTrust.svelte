<script lang="ts">
import NotificationProfile from "./NotificationProfile.svelte";
import NotificationViewMutualFriends from "./NotificationViewMutualFriends.svelte";
export let eventData: any;
</script>

<NotificationProfile
  profile="{eventData.profile}"
  targetCirclesAddress="{eventData.targetCirclesAddress}"
  showPassion="{false}" />

{#if eventData.limit == 0}
  <div class="text-center text-dark-lightest">
    {eventData.profile
      ? eventData.profile.firstName
      : eventData.targetCirclesAddress} has removed their trust to you.
  </div>
{:else}
  <div class="text-center text-dark-lightest">
    {eventData.profile
      ? eventData.profile.firstName
      : eventData.targetCirclesAddress} is trusting you now.
  </div>
{/if}

<NotificationViewMutualFriends eventData="{eventData}" />
