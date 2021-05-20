<script lang="ts">
  import { ChoiceSelectorContext } from "./choiceSelectorContext";
  import { Continue } from "@o-platform/o-process/dist/events/continue";
  import { onMount } from "svelte";

  export let context: ChoiceSelectorContext;

  onMount(() => {
    if (!context.editorDirtyFlags) {
      context.editorDirtyFlags = {};
    }
    context.editorDirtyFlags[context.fieldName] = true;
  });

  function submit(selected: { key: string; label: string }) {
    const event = new Continue();
    event.data = {};
    event.data[context.fieldName] = selected;
    context.data[context.fieldName] = selected;
    context.process.sendAnswer(event);
  }
</script>

<p class="py-4 label-text">
  {@html context.params.label}
</p>
{#if context.messages[context.fieldName]}
  <div class="alert alert-error mb-2 mt-2">
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
      <label for="input">{context.messages[context.fieldName]} </label>
    </div>
  </div>
{/if}
<div class="flex w-full space-x-2">
  {#each context.params.options as option}
    <button
      on:click={() => submit(option)}
      class="w-1/{context.params.options.length} btn btn-outline btn-white"
    >
      {option.label}
    </button>
  {/each}
</div>
