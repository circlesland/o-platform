<script lang="ts">
import Icons from "src/shared/molecules/Icons.svelte";
import NotificationProfile from "./NotificationProfile.svelte";
import ChatCard from "src/dapps/o-chat/atoms/ChatCard.svelte";
import NotificationViewMutualFriends from "./NotificationViewMutualFriends.svelte";

export let eventData: any;
</script>

<NotificationProfile profile="{eventData.profile}" />

<ChatCard params="{eventData}" />

<NotificationViewMutualFriends eventData="{eventData}" />
