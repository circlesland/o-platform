<script lang="ts">
  import { ChoiceSelectorContext } from "./choiceSelectorContext";
  import { Continue } from "@o-platform/o-process/dist/events/continue";
  import { onMount } from "svelte";

  export let context: ChoiceSelectorContext;

  onMount(() => {
    if (!context.editorDirtyFlags) {
      context.editorDirtyFlags = {};
    }
    context.editorDirtyFlags[context.field] = true;
  });

  function submit(selected: { key: string; label: string }) {
    const event = new Continue();
    event.data = {};
    event.data[context.field] = selected;
    context.data[context.field] = selected;
    context.process.sendAnswer(event);
  }
</script>

<div class="p-4">
  <p class="mb-4 label-text">
    {@html context.params.label}
  </p>
  {#if context.messages[context.field]}
    <div class="mb-2 alert alert-error">
      <div class="flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="w-6 h-6 mx-2 stroke-current"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
        <label for="input">{context.messages[context.field]} </label>
      </div>
    </div>
  {/if}
  <div class="flex flex-row w-full space-x-4">
    {#each context.params.choices as choice}
      <div class="flex-grow">
        <button
          on:click={() => submit(choice)}
          class="h-auto btn-block btn btn-light"
        >
          {choice.label}
        </button>
      </div>
    {/each}
  </div>
</div>
