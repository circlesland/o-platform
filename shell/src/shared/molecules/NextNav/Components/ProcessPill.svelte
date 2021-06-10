<script lang="ts">
  import Icons from "./../../Icons.svelte";
  import { Back } from "@o-platform/o-process/dist/events/back";
  import { Skip } from "@o-platform/o-process/dist/events/skip";

  export let props;
  export let isOpen: boolean = false;

</script>

<div
  class="h-8 col-start-2 px-2 py-2 bg-white rounded-full place-self-center processpill w-44"
>
  <div class="grid grid-cols-3 justify-items-center">
    <div class="w-5 h-8 cursor-pointer text-secondary">
      {#if props.back}
        <div on:click={() => props.modalProcess.sendAnswer(new Back())}>
          <Icons icon="back" />
        </div>
      {/if}
    </div>
    <div class="w-12 cursor-pointer">
      <svelte:component
        this={props.actionButton.component}
        {...props.actionButton.props}
        {isOpen}
        on:actionButton
      />
    </div>
    <div class="w-5 h-8 cursor-pointer text-secondary">
      {#if props.skip}
        <div on:click={() => props.modalProcess.sendAnswer(new Skip())}>
          <Icons icon="skip" />
        </div>
      {/if}
    </div>
  </div>
</div>
