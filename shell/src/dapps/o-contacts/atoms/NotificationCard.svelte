<script lang="ts" context="module">
export type NotificationCardStyle = {
  backgroundClass: string;
  titleClass: string;
};
</script>

<script lang="ts">
import { onMount } from "svelte";
import Date from "../../../shared/atoms/Date.svelte";
import { EventType, ProfileEvent } from "../../../shared/api/data/types";
import CrcTrust from "./chatListItems/CrcTrust.svelte";
import Purchase from "./chatListItems/Purchase.svelte";
import Sale from "./chatListItems/Sale.svelte";
import ChatMessage from "./chatListItems/ChatMessage.svelte";
import CrcHubTransfer from "./chatListItems/CrcHubTransfer.svelte";
import Erc20Transfer from "./chatListItems/Erc20Transfer.svelte";
import InvitationRedeemed from "./chatListItems/InvitationRedeemed.svelte";
import { UserActions, UserActionItem } from "../../../shared/userActions";
import ButtonGroup from "../../../shared/molecules/ButtonGroup/ButtonGroup.svelte";
import TransactionCard from "../../o-banking/atoms/TransactionCard.svelte";

export let event: ProfileEvent;

let userActions: UserActionItem[] = [];

const components = [
  {
    type: EventType.Purchased,
    component: Purchase,
  },
  {
    type: EventType.SaleEvent,
    component: Sale,
  },
  {
    type: EventType.ChatMessage,
    component: ChatMessage,
  },
  {
    type: EventType.CrcTrust,
    component: CrcTrust,
    actions: [
      {
        action: "setTrust",
      },
    ],
  },
  {
    type: EventType.CrcHubTransfer,
    component: CrcHubTransfer,
    // actions: [{ action: "chat", label: "Say Thanks" }],
  },
  {
    type: EventType.Erc20Transfer,
    component: Erc20Transfer,
  },
  {
    type: EventType.InvitationRedeemed,
    component: InvitationRedeemed,
    actions: [
      {
        action: "setTrust",
        label: `Trust ${
          event.contact_address_profile
            ? event.contact_address_profile.firstName
            : ""
        }`,
      },
    ],
  },
];

onMount(async () => {
  let eventActions = await getEventActions();

  if (eventActions) {
    userActions = await UserActions.getAvailableActions(
      event.contact_address_profile
    );

    let usableUserActions = {};

    eventActions.forEach((action) => {
      let foundAction = userActions.find((o) => o.key === action.action);
      // TODO: Find a better way to hide untrust, but show 'trust'
      if (foundAction && foundAction.title !== "Untrust") {
        usableUserActions[action.action] = foundAction;
      }
    });

    userActions = Object.values(usableUserActions);
  }
  userActions = userActions;
});

function getEventView() {
  const specificView = components.find((x) => x.type === event.type);

  if (!specificView) return null;
  return specificView.component;
}
async function getEventActions() {
  const specificView = components.find((x) => x.type === event.type);
  if (!specificView) return null;
  return specificView.actions ? specificView.actions : null;
}
if (event.type == EventType.Purchased) {
  event.direction = null;
}
</script>

<div class="px-2 sm:px-6">
  <div
    class="flex flex-row w-full p-px space-x-2"
    class:pr-12="{event.direction == 'out'}"
    class:pl-12="{event.direction == 'in'}">
    <div
      class="flex flex-col flex-grow space-y-1 rounded-xl"
      class:bg-gray-100="{event.type != EventType.ChatMessage &&
        event.type != EventType.Purchased &&
        event.type != EventType.CrcHubTransfer}">
      <div
        class="relative w-full text-xs sm:text-sm message chatText"
        class:p-4="{event.type != EventType.ChatMessage}">
        {#if event.type != EventType.ChatMessage && event.type != EventType.Purchased}
          <div class="absolute bottom-2 right-3 text-2xs">
            <Date time="{event.timestamp}" />
          </div>
        {/if}
        <svelte:component this="{getEventView()}" event="{event}" />
        {#if userActions && userActions.length}
          <div class="pt-4">
            <ButtonGroup
              actions="{userActions}"
              layout="{{
                orientation: 'inline',
                alignment: 'left',
                labels: {
                  setTrust: (action) =>
                    `${action.title} ${event.contact_address_profile.firstName}`,
                },
                colors: {
                  default: 'light',
                  overrides: (action) =>
                    action.key == 'dismiss' ? 'light' : null,
                },
              }}" />
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
.chatText {
  overflow-wrap: break-word;
  word-wrap: break-word;
  -ms-word-break: break-all;
  word-break: break-word;
  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
}
</style>
