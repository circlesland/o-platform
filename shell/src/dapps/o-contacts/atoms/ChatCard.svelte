<script lang="ts">
  import { push } from "svelte-spa-router";
  import Icons from "src/shared/molecules/Icons.svelte";

  export let params = {
    outgoing: <boolean>true,
    notification: <boolean>false,
    name: <string>null,
    time: <string>null,
    text: <string>null,
    image: <string>null,
  };
</script>

<div
  class="flex flex-row w-full space-x-2"
  class:pr-12="{params.outgoing && !params.notification}"
  class:pl-12="{!params.outgoing && !params.notification}">
  <!-- <div class="image" class:pl-2="{params.outgoing}">
    <div class="avatar">
      <div class="w-10 h-10 m-auto rounded-full sm:w-20 sm:h-20">
        <img src="{params.image}" alt="user-icon" />
      </div>
    </div>
  </div> -->
  <div
    class="flex flex-col flex-grow space-y-1"
    class:order-first="{params.outgoing}">
    <!-- <div class="flex flex-row toprow">
      <div
        class="flex-grow text-xs sm:text-sm text-dark-lightest"
        class:order-last="{params.outgoing}"
        class:text-right="{params.outgoing}"
        class:self-end="{params.outgoing}">
        {params.name}
      </div>
      <div
        class="text-xs sm:text-sm text-dark-lightest"
        class:self-end="{!params.outgoing}"
        class:text-right="{!params.outgoing}"
        class:order-first="{params.outgoing}">
        {params.time}
      </div>
    </div> -->
    <div
      class="relative w-full p-4 text-xs sm:text-sm rounded-xl message chatText"
      class:pb-5="{!params.notification}"
      class:pb-6="{params.notification}"
      class:bg-light-lighter="{params.outgoing && !params.notification}"
      class:bg-dark="{!params.outgoing && !params.notification}"
      class:bg-success-lighter="{params.notification}"
      class:text-white="{!params.outgoing && !params.notification}">
      <div
        class="absolute bottom-2 right-3 text-2xs"
        class:text-light-dark="{params.outgoing && !params.notification}"
        class:text-dark-lighter="{!params.outgoing && !params.notification}">
        {params.time}
      </div>
      {@html params.text}
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
