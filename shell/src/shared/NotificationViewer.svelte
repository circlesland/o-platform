<script lang="ts">
import { Continue } from "@o-platform/o-process/dist/events/continue";
import NotificationViewChatMessage from "./NotificationViewer/molecules/NotificationViewChatMessage.svelte";
import NotificationViewUbi from "./NotificationViewer/molecules/NotificationViewUbi.svelte";
import NotificationViewTrust from "./NotificationViewer/molecules/NotificationViewTrust.svelte";
import NotificationViewTransfer from "./NotificationViewer/molecules/NotificationViewTransfer.svelte";
import NotificationViewMembershipOffer from "./NotificationViewer/molecules/NotificationViewMembershipOffer.svelte";
import NotificationViewMembershipAccepted from "./NotificationViewer/molecules/NotificationViewMembershipAccepted.svelte";
import GenericEventCard from "./NotificationViewer/molecules/GenericEventCard.svelte";
import { NotificationViewerContext } from "@o-platform/o-editors/src/notificationViewerContext";
import ProcessNavigation from "../../../packages/o-editors/src/ProcessNavigation.svelte";

import { EventType } from "./api/data/types";

export let context: NotificationViewerContext;

let data: any = context.data[context.field];

$: console.log("DATA", data);

const components = [
  { type: EventType.ChatMessage, component: NotificationViewChatMessage },
  { type: EventType.CrcMinting, component: NotificationViewUbi },
  { type: EventType.CrcTrust, component: NotificationViewTrust },
  { type: EventType.CrcHubTransfer, component: NotificationViewTransfer },
  {
    type: EventType.MembershipOffer,
    component: NotificationViewMembershipOffer,
  },
  {
    type: EventType.MembershipAccepted,
    component: NotificationViewMembershipAccepted,
  },
];

function submit() {
  const answer = new Continue();
  answer.data = context.data;
  context.process.sendAnswer(answer);
}

function handleClick(action) {
  if (action.event) {
    window.o.publishEvent(action.event);
  }
  if (action.action) {
    action.action();
  }
}

function getEventView() {
  const specificView = components.find((x) => x.type === data.type);
  if (!specificView) return GenericEventCard;
  return specificView.component;
}
</script>

<div>
  <svelte:component this="{getEventView()}" event="{data}" />
  <!-- 
  {#if eventData.actions.length > 0}
    <div class="flex flex-row items-center content-center w-full space-x-4">
      <div class="mt-6">
        <button
          on:click="{() => handleClick(eventData.actions[0])}"
          class="h-auto btn-block btn btn-light whitespace-nowrap">
          {eventData.actions[0].title}
        </button>
      </div>
    </div>
  {/if} -->

  <ProcessNavigation on:buttonClick="{submit}" context="{context}" />
</div>
