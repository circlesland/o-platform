<script lang="ts">
  import Date from "../../../shared/atoms/Date.svelte";
  import NotificationCard from "./NotificationCard.svelte";
  import {push} from "svelte-spa-router";

  export let params : {
    safeAddress:string,
    outgoing: boolean,
    name: string,
    time: number,
    content: string|{
      title: string,
      text: string,
      notificationType: string,
      time: number,
      actions: {
        icon: string,
        title: string,
        colorClass: string,
        action: () => void
      }[],
    },
    image: string
  } = {
    safeAddress:null,
    outgoing: true,
    name: null,
    time: null,
    content: null,
    image: null,
  };

  function goToProfile(path?:string) {
    if (!path)
      return;
    push(`#/friends/${path}`);
  }
</script>

<div
  class="flex flex-row w-full space-x-2"
  class:pr-12="{params.outgoing}"
  class:pl-12="{!params.outgoing}">
  <div class="image" class:pl-2="{params.outgoing}">
    <div class="inline-flex">
      <a on:click={() => goToProfile(params.safeAddress)}>
        <div class="w-10 h-10 m-auto rounded-full sm:w-20 sm:h-20">
          <img class="rounded-full" src="{params.image}" alt="user-icon" />
        </div>
      </a>
    </div>
  </div>
    <div
      class="flex flex-col flex-grow space-y-1"
      class:order-first="{params.outgoing}">
      {#if typeof params.content === "string"}
       <div class="flex flex-row toprow">
        <div
          class="flex-grow text-xs sm:text-sm text-dark-lightest"
          class:order-last="{params.outgoing}"
          class:text-right="{params.outgoing}"
          class:self-end="{params.outgoing}">
          {params.name}
        </div>
         <!--  <div
             class="text-xs sm:text-sm text-dark-lightest"
             class:self-end="{!params.outgoing}"
             class:text-right="{!params.outgoing}"
             class:order-first="{params.outgoing}">
             {params.time}
           </div>-->
         </div>
      <div
        class="relative w-full p-4 pt-3 pb-6 text-xs sm:text-sm rounded-xl message chatText"
        class:bg-light-lighter="{params.outgoing}"
        class:bg-dark="{!params.outgoing}"
        class:text-white="{!params.outgoing}">
        <div
          class="absolute bottom-2 right-3 text-2xs"
          class:text-light-dark="{params.outgoing}"
          class:text-dark-lighter="{!params.outgoing}">
          <!--{params.time}-->
          <Date time={params.time}/>
        </div>
        {@html params.content}
      </div>
      {:else}
        <NotificationCard params={params.content} />
      {/if}
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
