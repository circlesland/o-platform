<script lang="ts">
import NotificationProfile from "./NotificationProfile.svelte";
import NotificationCard from "src/dapps/o-contacts/atoms/NotificationCard.svelte";
import NotificationViewMutualFriends from "./NotificationViewMutualFriends.svelte";
import { ChatMessage, ProfileEvent } from "../../api/data/types";
import {_} from "svelte-i18n";
import Label from "../../atoms/Label.svelte";

export let event: ProfileEvent;

let payload: ChatMessage = <ChatMessage>event.payload;
</script>

<div class="flex flex-col space-y-4">
  <div class="self-center pb-2 text-2xl text-center font-heading"><Label key="shared.molecules.notificationViewer.molecules.notificationViewChatMessage.from"  /></div>
  <div class="pb-4">
    <NotificationProfile profile="{payload.from_profile}" />
  </div>

  <NotificationCard event="{event}" />
</div>
