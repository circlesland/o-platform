<script lang="ts">
  import Date from "../../../shared/atoms/Date.svelte";
  import NotificationCard from "./NotificationCard.svelte";
  import { push } from "svelte-spa-router";

  export let params: {
    safeAddress: string;
    outgoing: boolean;
    name: string;
    time: number;
    content:
      | string
      | {
          title: string;
          text: string;
          notificationType: string;
          time: number;
          actions: {
            icon: string;
            title: string;
            colorClass: string;
            action: () => void;
          }[];
        };
    image: string;
  } = {
    safeAddress: null,
    outgoing: true,
    name: null,
    time: null,
    content: null,
    image: null,
  };

  function goToProfile(e, path?: string) {
    if (!path) return;
    e.stopPropagation();
    push(`#/friends/${path}`);
  }
</script>

<div
  class="flex flex-row w-full space-x-2"
  class:pr-12="{params.outgoing}"
  class:pl-12="{!params.outgoing}">

  <div
    class="flex flex-col flex-grow space-y-1"
    class:order-first="{params.outgoing}">
    <!-- {#if typeof params.content === 'string'} -->
    <div
      class="relative w-full p-4 pt-3 pb-6 text-xs sm:text-sm rounded-xl message chatText"
      class:bg-light-lighter="{params.outgoing}"
      class:bg-dark="{!params.outgoing}"
      class:text-white="{!params.outgoing}">
      <div
        class="absolute bottom-2 right-3 text-2xs"
        class:text-light-dark="{params.outgoing}"
        class:text-dark-lighter="{!params.outgoing}">
        <Date time="{params.time}" />
      </div>
      {@html params.content.title}
    </div>
    <!-- {:else}
      <NotificationCard params="{params.content}" />
    {/if} -->
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
