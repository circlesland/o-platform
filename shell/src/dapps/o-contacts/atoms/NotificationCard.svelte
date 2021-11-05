<script lang="ts" context="module">
  export type NotificationCardStyle = {
    backgroundClass: string,
    titleClass: string
  };
</script>
<script lang="ts">
  import Date from "../../../shared/atoms/Date.svelte";
  import {EventType, ProfileEvent} from "../../../shared/api/data/types";
  import CrcTrust from "./chatListItems/CrcTrust.svelte";
  import ChatMessage from "./chatListItems/ChatMessage.svelte";
  import CrcHubTransfer from "./chatListItems/CrcHubTransfer.svelte";

  export let event: ProfileEvent;

  function determineCardStyle(event?: ProfileEvent): string {
    if (!event)
      return "border-light-lighter";

    switch (event.type) {
      case EventType.CrcHubTransfer:
        if (event.direction == "in" || event.direction == "self") {
          return "border-light-lighter";
        } else if (event.direction == "out") {
          return "border-primary-dark";
        }
        break;
      case EventType.CrcTrust:
        const textClass = (<any>event.payload).limit == 0 ? "text-alert" : "";
        if (event.direction == "in" || event.direction == "self") {
          return "border-primary-lighter";
        } else if (event.direction == "out") {
          return "border-alert-lightest";
        }
        break;
      case EventType.InvitationCreated:
      case EventType.InvitationRedeemed:
      case EventType.MembershipOffer:
      case EventType.MembershipAccepted:
      case EventType.MembershipRejected:
      default:
        return "border-light-lighter";
    }
  }
</script>

{#if event.type == EventType.ChatMessage}
  <ChatMessage event={event} />
{:else}
<div class="px-2 sm:px-6">
  <div class="flex flex-row w-full p-px space-x-2">
    <div
      class="flex flex-col flex-grow space-y-1 bg-gradient-to-r from-gradient1 to-gradient2 rounded-xl">
      <div
        class="relative w-full p-4 pt-3 pb-6 text-xs sm:text-sm message chatText {determineCardStyle(event).backgroundClass}">
        <div class="absolute bottom-2 right-3 text-2xs">
          <Date time="{event.timestamp}" />
        </div>
        {#if event.type == EventType.CrcTrust}
          <CrcTrust event={event} />
        {:else if event.type == EventType.CrcHubTransfer}
          <CrcHubTransfer event={event} />
        {/if}
      </div>
    </div>
  </div>
</div>
{/if}
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
