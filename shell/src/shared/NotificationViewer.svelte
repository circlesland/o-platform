<script lang="ts">
import { Continue } from "@o-platform/o-process/dist/events/continue";
import NotificationViewChatMessage from "./NotificationViewer/molecules/NotificationViewChatMessage.svelte";
import NotificationViewUbi from "./NotificationViewer/molecules/NotificationViewUbi.svelte";
import NotificationViewTrust from "./NotificationViewer/molecules/NotificationViewTrust.svelte";
import NotificationViewTransfer from "./NotificationViewer/molecules/NotificationViewTransfer.svelte";
import NotificationViewMembershipOffer from "./NotificationViewer/molecules/NotificationViewMembershipOffer.svelte";
import NotificationViewMembershipAccepted from "./NotificationViewer/molecules/NotificationViewMembershipAccepted.svelte";
import NotificationViewInvitationRedeemed from "./NotificationViewer/molecules/NotificationViewInvitationRedeemed.svelte";
import NotificationViewWelcome from "./NotificationViewer/molecules/NotificationViewWelcome.svelte";
import GenericEventCard from "./NotificationViewer/molecules/GenericEventCard.svelte";
import { NotificationViewerContext } from "@o-platform/o-editors/src/notificationViewerContext";
import ProcessNavigation from "../../../packages/o-editors/src/ProcessNavigation.svelte";
import Icons from "./molecules/Icons.svelte";

import { EventType } from "./api/data/types";
import { setTrust } from "../dapps/o-banking/processes/setTrust";
import { me } from "./stores/me";
import {showNotifications} from "./processes/showNotifications";
import {inbox} from "./stores/inbox";

export let context: NotificationViewerContext;

let data: any = context.data[context.field];

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
  {
    type: EventType.InvitationRedeemed,
    component: NotificationViewInvitationRedeemed,
  },
  {
    type: EventType.WelcomeMessage,
    component: NotificationViewWelcome,
  },
];

async function trust(circlesAddress) {
  window.o.publishEvent({
    type: "shell.closeModal"
  });
  setTimeout(() => {
    window.o.runProcess(setTrust, {
      trustLimit: 100,
      trustReceiver: circlesAddress,
      hubAddress: "__CIRCLES_HUB_ADDRESS__",
      safeAddress: $me.circlesAddress,
      privateKey: sessionStorage.getItem("circlesKey"),
      successAction: (data) => {
        window.o.runProcess(showNotifications, {
          events: $inbox.map((o) => o)
        });
      }
    });
  }, 50);
}

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

function trustAndSubmit() {
  trust(data.payload.redeemedBy_profile.circlesAddress);
  submit();
}

function getEventView() {
  const specificView = components.find((x) => x.type === data.type);
  if (!specificView) return GenericEventCard;
  return specificView.component;
}
</script>

<div>
  <svelte:component this="{getEventView()}" event="{data}" />

  {#if data.type == EventType.InvitationRedeemed}
    <div class="flex flex-row items-center content-center w-full space-x-4">
      <div class="">
        <button
          type="submit"
          class="relative btn btn-light btn-block whitespace-nowrap"
          on:click="{() => submit()}">
          Don't trust
        </button>
      </div>
      <div class="flex-grow">
        <button
          on:click="{() => trustAndSubmit()}"
          class="h-auto btn-block btn btn-primary whitespace-nowrap">
          Trust {data.payload.redeemedBy_profile.firstName}
        </button>
      </div>
    </div>
  {:else}
    <ProcessNavigation on:buttonClick="{submit}" context="{context}" />
  {/if}
</div>
