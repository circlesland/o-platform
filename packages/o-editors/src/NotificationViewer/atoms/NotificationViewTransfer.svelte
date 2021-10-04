<script lang="ts">
import { displayCirclesAmount } from "src/shared/functions/displayCirclesAmount";
import NotificationViewMutualFriends from "./NotificationViewMutualFriends.svelte";
import NotificationProfile from "./NotificationProfile.svelte";
import Icons from "src/shared/molecules/Icons.svelte";
export let eventData: any;
</script>

<div class="self-center text-6xl text-success font-heading">
  +{displayCirclesAmount(eventData.value)}
  <Icons icon="circlessimple" size="10" />
</div>
<div class="self-center text-2xl font-heading">from</div>
<NotificationProfile
  profile="{eventData.profile}"
  targetCirclesAddress="{eventData.targetCirclesAddress}" />

{#if eventData.text}
  <div
    class="flex flex-col items-center self-center w-full m-auto text-center justify-self-center text-dark-lightest">
    {eventData.text}
  </div>
{/if}

<NotificationViewMutualFriends eventData="{eventData}" />
