<script lang="ts">
  import DetailActionBar from "../../../shared/molecules/DetailActionBar.svelte";
  import Date from "../../../shared/atoms/Date.svelte";

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
</script>

<div class="flex flex-row w-full space-x-2">

  <div class="flex flex-col flex-grow space-y-1">
    <div
      class="relative w-full p-4 pt-3 pb-6 text-xs sm:text-sm rounded-xl message chatText"
      class:bg-success-lighter="{['transfer_in', 'invite'].includes(params.content.notificationType)}"
      class:bg-primary-dark="{params.content.notificationType == 'transfer_out'}"
      class:bg-primary-lighter="{params.content.notificationType == 'trust_added'}"
      class:bg-alert-lightest="{params.content.notificationType == 'trust_removed'}">
      <div class="absolute bottom-2 right-3 text-2xs">
        <Date time="{params.time}" />
      </div>

      <div>
        <h1 class="uppercase">{params.content.title}</h1>
      </div>
      <div class="mt-2">
        {@html params.content.text}
      </div>
      <div class="mt-4">
        <DetailActionBar actions="{params.content.actions}" />
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
