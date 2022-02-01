<script lang="ts">
import { onMount } from "svelte";
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
import { UserActions, UserActionItem } from "./userActions";
import { createEventDispatcher } from "svelte";
import ButtonContext from "./atoms/button/buttonContext";
import ButtonGroupContext from "./molecules/buttonGroupContext";
import ButtonGroup from "./molecules/ButtonGroup.svelte";
import { EventType } from "./api/data/types";

export let context: NotificationViewerContext;

let data: any = context.data[context.field];
let userActions: UserActionItem[];

const dispatch = createEventDispatcher();

let dismissButton: ButtonContext = {
  label: "OK",
  color: "light",
  action: async () => dispatch("submit"),
};

let buttonGroup: ButtonGroupContext = {
  style: "inline",
  buttons: [dismissButton],
};

console.log("AALSDKJASLDKJASDLK", data.contact_address_profile);
const components = [
  {
    type: EventType.ChatMessage,
    component: NotificationViewChatMessage,
    actions: [{ action: "chat", label: "Answer" }],
  },
  { type: EventType.CrcMinting, component: NotificationViewUbi },
  {
    type: EventType.CrcTrust,
    component: NotificationViewTrust,
    actions: [
      {
        action: "setTrust",
        label: `Trust ${data.contact_address_profile.firstName}`,
      },
    ],
  },
  {
    type: EventType.CrcHubTransfer,
    component: NotificationViewTransfer,
    actions: [{ action: "chat", label: "Say Thanks" }],
  },
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
    actions: [
      {
        action: "setTrust",
        label: `Trust ${data.contact_address_profile.firstName}`,
      },
    ],
  },
  {
    type: EventType.WelcomeMessage,
    component: NotificationViewWelcome,
  },
];

function getEventView() {
  const specificView = components.find((x) => x.type === data.type);
  if (!specificView) return GenericEventCard;
  return specificView.component;
}
async function getEventActions() {
  const specificView = components.find((x) => x.type === data.type);
  if (!specificView) return null;
  return specificView.actions ? specificView.actions : null;
}

onMount(async () => {
  let eventActions = await getEventActions();

  if (eventActions) {
    eventActions.forEach(async function (action) {
      userActions = await UserActions.getSingleAction(
        data.contact_address_profile,
        action.action
      );

      let eventButton: ButtonContext = {
        label: action.label,
        color: "primary",
        action: async () => await userActions[0].action(),
      };
      buttonGroup.buttons.push(eventButton);
      buttonGroup = buttonGroup;
    });
  }
});

function submit() {
  const answer = new Continue();
  answer.data = context.data;
  context.process.sendAnswer(answer);
}
</script>

<div>
  <svelte:component
    this="{getEventView()}"
    event="{data}"
    context="{context}"
    on:submit="{submit}" />
  <!-- 
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
   -->
  <div class="pt-4">
    <ButtonGroup context="{buttonGroup}" on:submit="{submit}" />
  </div>
</div>
