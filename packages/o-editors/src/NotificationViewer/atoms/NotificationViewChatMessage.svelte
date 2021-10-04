<script lang="ts">
import Icons from "src/shared/molecules/Icons.svelte";
import NotificationProfile from "./NotificationProfile.svelte";
import ChatCard from "src/dapps/o-chat/atoms/ChatCard.svelte";
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

<ChatCard params="{chatData}" />

<NotificationViewMutualFriends eventData="{eventData}" />
