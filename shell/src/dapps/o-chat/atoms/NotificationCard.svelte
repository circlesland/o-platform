<script lang="ts">
  import DetailActionBar from "../../../shared/molecules/DetailActionBar.svelte";
  import Date from "../../../shared/atoms/Date.svelte";

  export let params = {
    title: <string>null,
    text: <string>null,
    notificationType: <string>null,
    time: <number>null,
    actions: <{
      icon: string,
      title: string,
      colorClass: string,
      action: () => void
    }>[],
  };
</script>

<div class="flex flex-row w-full space-x-2">

  <div class="flex flex-col flex-grow space-y-1">
    <div
      class="relative w-full p-4 pt-3 pb-6 text-xs sm:text-sm rounded-xl message chatText"
      class:bg-success-lighter="{['transfer_in', 'invite'].includes(params.notificationType)}"
      class:bg-primary-dark="{params.notificationType == 'transfer_out'}"
      class:bg-primary-lighter="{params.notificationType == 'trust_added'}"
      class:bg-alert-lightest="{params.notificationType == 'trust_removed'}">
      <div class="absolute bottom-2 right-3 text-2xs">
        <Date time={params.time}/>
      </div>

      <div>
        <h1 class="uppercase">{params.title}</h1>
      </div>
      <div class="mt-2">
        {@html params.text}
      </div>
      <div class="mt-4">
        <DetailActionBar actions="{params.actions}" />
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
