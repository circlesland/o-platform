<script lang="ts">
import NotificationProfile from "./NotificationProfile.svelte";
import ChatCard from "src/dapps/o-contacts/atoms/NotificationCard.svelte";
import NotificationViewMutualFriends from "./NotificationViewMutualFriends.svelte";

export let eventData: any;

let chatData = {
  time: eventData.time,
  content: {
    title: eventData.title,
  },
};
</script>

<div class="self-center text-2xl font-heading">from</div>
<NotificationProfile
  profile="{eventData.profile}"
  targetCirclesAddress="{eventData.targetCirclesAddress}" />

<ChatCard event="{chatData}" />

<NotificationViewMutualFriends eventData="{eventData}" />
