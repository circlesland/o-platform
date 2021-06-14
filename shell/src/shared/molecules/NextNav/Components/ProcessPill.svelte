<script lang="ts">
  import Icons from "./../../Icons.svelte";
  import { Back } from "@o-platform/o-process/dist/events/back";
  import { Skip } from "@o-platform/o-process/dist/events/skip";

  export let props;
  export let isOpen: boolean = false;

</script>

<div
  class="w-auto h-8 col-start-2 py-1 bg-white rounded-full place-self-center processpill"
  class:pl-2={props.lastPrompt && props.lastPrompt.navigation.canGoBack}
  class:pr-2={props.lastPrompt && props.lastPrompt.navigation.canSkip}
>
  <div class="flex flex-row justify-items-center">
    {#if props.lastPrompt && props.lastPrompt.navigation.canGoBack}
      <div
        class="h-8 px-2 cursor-pointer w-14 text-lightdark"
        on:click={() => props.modalProcess.sendAnswer(new Back())}
      >
        back
      </div>
    {/if}
    <div class="w-12 cursor-pointer">
      <svelte:component
        this={props.actionButton.component}
        {...props.actionButton.props}
        {isOpen}
        on:actionButton
      />
    </div>
    {#if props.lastPrompt && props.lastPrompt.navigation.canSkip}
      <div
        class="h-8 px-3 cursor-pointer w-14 text-lightdark"
        on:click={() => props.modalProcess.sendAnswer(new Skip())}
      >
        skip
      </div>
    {/if}
  </div>
</div>
