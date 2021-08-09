<script lang="ts">
  import { push } from "svelte-spa-router";
  import Icons from "src/shared/molecules/Icons.svelte";

  export let name: string;
  export let time: string;
  export let text: string;
  export let image: string;
  export let outgoing: boolean = true;
</script>

<div class="flex flex-row w-full space-x-2">
  <div class="image" class:pl-2="{outgoing}">
    <div class="avatar">
      <div class="w-20 h-20 m-auto rounded-full">
        <img src="{image}" alt="user-icon" />
      </div>
    </div>
  </div>
  <div class="flex flex-col flex-grow space-y-1" class:order-first="{outgoing}">
    <div class="flex flex-row toprow">
      <div
        class="flex-grow text-sm text-dark-lightest"
        class:order-last="{outgoing}"
        class:text-right="{outgoing}"
        class:self-end="{outgoing}">
        {name}
      </div>
      <div
        class="text-sm text-dark-lightest"
        class:self-end="{!outgoing}"
        class:text-right="{!outgoing}"
        class:order-first="{outgoing}">
        {time}
      </div>
    </div>
    <div
      class="w-full p-4 break-all rounded-xl message"
      class:bg-light-lighter="{outgoing}"
      class:bg-dark="{!outgoing}"
      class:text-white="{!outgoing}">
      {text}
    </div>
  </div>
</div>
