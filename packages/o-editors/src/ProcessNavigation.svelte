<script lang="ts">
  import { Continue } from "@o-platform/o-process/dist/events/continue";
  import { EditorContext } from "./editorContext";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let context: EditorContext;
  $: {
    console.log(context);
  }

</script>

<div
  class="flex flex-col mt-4 space-x-0 space-y-4 md:space-x-4 md:space-y-0 md:flex-row"
>
  <div class="flex-1">
    {#if !context.params.hideNav}
      <button
        type="submit"
        on:click={() => {
          dispatch("buttonClick");
          /* const answer = new Continue();
          answer.data = context.data;
          context.process.submit(answer);
          */
        }}
        class="btn btn-primary btn-block"
        >{context.params.submitButtonText
          ? context.params.submitButtonText
          : "Submit"}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block w-6 h-6 ml-2 stroke-current"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    {/if}
  </div>
</div>
