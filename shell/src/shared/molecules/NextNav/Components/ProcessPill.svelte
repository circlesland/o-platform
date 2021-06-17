<script lang="ts">
  import Icons from "./../../Icons.svelte";
  import { Back } from "@o-platform/o-process/dist/events/back";
  import { Skip } from "@o-platform/o-process/dist/events/skip";

  export let props;
  export let isOpen: boolean = false;

</script>

<div
  class="w-auto h-8 col-start-2 place-self-center processPill"
  class:pl-2={props.lastPrompt && props.lastPrompt.navigation.canGoBack}
  class:pr-2={props.lastPrompt && props.lastPrompt.navigation.canSkip}
>
  <div class="grid grid-cols-3 justify-items-center processPillGrid">
    {#if props.lastPrompt && props.lastPrompt.navigation.canGoBack}
      <div
        class="w-20 h-8 px-3 py-1 bg-white rounded-full cursor-pointer text-lightdark"
        on:click={() => props.modalProcess.sendAnswer(new Back())}
      >
        back
      </div>
    {/if}
    <div class="z-50 w-12 col-start-2 cursor-pointer">
      <svelte:component
        this={props.actionButton.component}
        {...props.actionButton.props}
        {isOpen}
        on:actionButton
      />
    </div>
    {#if props.lastPrompt && props.lastPrompt.navigation.canSkip}
      <div
        class="w-20 h-8 py-1 bg-white rounded-full cursor-pointer px-9 text-lightdark"
        on:click={() => props.modalProcess.sendAnswer(new Skip())}
      >
        skip
      </div>
    {/if}
  </div>
</div>
