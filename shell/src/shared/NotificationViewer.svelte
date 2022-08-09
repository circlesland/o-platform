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
import ButtonGroup from "./molecules/ButtonGroup/ButtonGroup.svelte";
import { EventType } from "./api/data/types";
import Label from "../../../shared/atoms/Label.svelte";

export let context: NotificationViewerContext;

let data: any = context.data[context.field];

let userActions: UserActionItem[] = [];

const dispatch = createEventDispatcher();

const components = [
  {
    type: EventType.ChatMessage,
    component: NotificationViewChatMessage,
    actions: [
      {
        action: "chat",
        label: window.i18n("shared.notificationViewer.answer"),
      },
    ],
  },
  {
    type: EventType.CrcMinting,
    component: NotificationViewUbi,
  },
  {
    type: EventType.CrcTrust,
    component: NotificationViewTrust,
    actions: [
      {
        action: "setTrust",
      },
    ],
  },
  {
    type: EventType.CrcHubTransfer,
    component: NotificationViewTransfer,
    actions: [
      {
        action: "chat",
        label: window.i18n("shared.notificationViewer.sayThanks"),
      },
    ],
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
        label: window.i18n("shared.notificationViewer.trust", {
          values: { profile: data.contact_address_profile.firstName },
        }),
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
  let dismissAction: UserActionItem = {
    key: "dismiss",
    title: window.i18n("shared.notificationViewer.ok"),
    action: () => submit(),
  };

  let eventActions = await getEventActions();

  if (eventActions) {
    userActions = await UserActions.getAvailableActions(data.contact_address_profile);

    let usableUserActions = {};

    eventActions.forEach((action) => {
      let foundAction = userActions.find((o) => o.key === action.action);
      if (foundAction) {
        usableUserActions[action.action] = foundAction;
      }
    });

    userActions = Object.values(usableUserActions);
  }
  userActions.unshift(dismissAction);
  userActions = userActions;
});

function submit() {
  const answer = new Continue();
  answer.data = context.data;
  context.process.sendAnswer(answer);
}
</script>

<div>
  <svelte:component this="{getEventView()}" event="{data}" context="{context}" on:submit="{submit}" />

  {#if userActions}
    <div class="pt-4">
      <ButtonGroup
        actions="{userActions}"
        layout="{{
          orientation: 'inline',
          alignment: 'center',
          labels: {
            setTrust: (action) => `${action.title}`,
            chat: (action) => {
              if (data.type == EventType.CrcHubTransfer) {
                return window.i18n('shared.notificationViewer.sayThanks');
              } else if (data.type == EventType.ChatMessage) {
                return window.i18n('shared.notificationViewer.answer');
              } else {
                return null;
              }
            },
          },
          colors: {
            default: 'primary',
            overrides: (action) => (action.displayHint == 'discouraged' ? 'light' : null),
          },
        }}" />
    </div>
  {/if}
</div>
