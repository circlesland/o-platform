<script lang="ts">
  import { ChoiceSelectorContext } from "./choiceSelectorContext";
  import { Continue } from "@o-platform/o-process/dist/events/continue";

  export let context: ChoiceSelectorContext;

  function submit(selected: { key: string; label: string }) {
    const event = new Continue();
    event.data = {};
    event.data[context.fieldName] = selected;
    context.data[context.fieldName] = selected;
    context.process.sendAnswer(event);
  }
</script>

<p class="py-4">
  {context.params.label}
</p>
<div class="flex w-full space-x-2">
  {#each context.params.choices as choice}
    <button on:click={() => submit(choice)} class="w-1/2 btn btn-outline">
      {choice.label}
    </button>
  {/each}
</div>
