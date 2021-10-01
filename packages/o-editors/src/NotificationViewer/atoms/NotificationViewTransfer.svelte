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

<NotificationProfile profile="{eventData.profile}" />

<NotificationViewMutualFriends eventData="{eventData}" />
