<script lang="ts">
  import Icons from "./../../Icons.svelte";
  import ActionButtonComponent from "../Components/ActionButton.svelte";
  import {ProcessContainerNavigation} from "../../ProcessContainer.svelte";

  export let isOpen: boolean = false;
  export let modalProcess: any;
  export let navigation: any;
  export let processNavigation: ProcessContainerNavigation;
</script>

<div
  class="w-auto h-8 col-start-2 place-self-center processPill"
  class:pl-2={processNavigation && processNavigation.canGoBack}
  class:pr-2={processNavigation && processNavigation.canSkip}
>
  <div class="grid grid-cols-3 justify-items-center processPillGrid">
    {#if processNavigation && processNavigation.canGoBack}
      <div
        class="w-20 h-8 px-3 py-2 bg-white rounded-full cursor-pointer text-lightdark"
        on:click={() => processNavigation.back()}
      >
        back
      </div>
    {/if}
    <div class="z-50 w-12 col-start-2 cursor-pointer">
      <ActionButtonComponent {isOpen} on:actionButton />
    </div>
    {#if processNavigation && processNavigation.canSkip}
      <div
        class="w-20 h-8 py-2 bg-white rounded-full cursor-pointer px-9 text-lightdark"
        on:click={() => processNavigation.skip()}
      >
        skip
      </div>
    {/if}
  </div>
</div>
