<script lang="ts">
  import Icons from "./../../Icons.svelte";
  import { Back } from "@o-platform/o-process/dist/events/back";
  import { Skip } from "@o-platform/o-process/dist/events/skip";

  export let props;
  export let isOpen: boolean = false;

</script>

<div
  class="w-auto h-8 col-start-2 py-2 bg-white rounded-full place-self-center processpill"
  class:pl-2={props.lastPrompt && props.lastPrompt.navigation.canGoBack}
  class:pr-2={props.lastPrompt && props.lastPrompt.navigation.canSkip}
>
  <div class="flex flex-row justify-items-center">
    {#if props.lastPrompt && props.lastPrompt.navigation.canGoBack}
      <div class="w-8 h-8 px-2 cursor-pointer text-secondary">
        <div on:click={() => props.modalProcess.sendAnswer(new Back())}>
          <Icons icon="back" />
        </div>
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
      <div class="w-8 h-8 px-2 cursor-pointer text-secondary">
        <div on:click={() => props.modalProcess.sendAnswer(new Skip())}>
          <Icons icon="skip" />
        </div>
      </div>
    {/if}
  </div>
</div>
