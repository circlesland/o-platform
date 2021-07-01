<script lang="ts">
  import { Continue } from "@o-platform/o-process/dist/events/continue";
  import { EditorContext } from "./editorContext";
  import { createEventDispatcher } from "svelte";
  import Icons from "../../../shell/src/shared/molecules/Icons.svelte";

  const dispatch = createEventDispatcher();

  export let context: EditorContext;
  export let type: string = "large";
  $: {
    console.log(context);
  }
</script>

<div
  class="flex flex-col mt-4 space-x-0 space-y-4 md:space-x-4 md:space-y-0 md:flex-row"
>
  <div class="flex-1">
    {#if !context.params.hideNav}
      {#if type == "large"}
        <button
          type="submit"
          on:click={() => {
            dispatch("buttonClick");
            /* const answer = new Continue();
          answer.data = context.data;
          context.process.submit(answer);
          */
          }}
          class="relative btn btn-primary btn-block"
          >{context.params.submitButtonText
            ? context.params.submitButtonText
            : "Submit"}
          <div class="absolute right-2">
            <Icons icon="buttonrightarrow" />
          </div>
        </button>
      {:else if type == "small"}
        <button
          type="submit"
          on:click={() => {
            dispatch("buttonClick");
          }}
          class="btn btn-primary btn-square"
          ><Icons icon="submitsmall" />
        </button>
      {/if}
    {/if}
  </div>
</div>
