<script lang="ts">
import { EditorContext } from "./editorContext";
import { createEventDispatcher } from "svelte";
import Icons from "../../../shell/src/shared/molecules/Icons.svelte";

const dispatch = createEventDispatcher();

export let context: EditorContext;
export let type: string = "large";
export let noSticky: boolean = false;
export let isDisabled: boolean = false;
</script>

<div
  class="bottom-0 left-0 right-0 flex flex-col flex-grow w-full space-x-0 space-y-4 bg-white md:space-x-4 md:space-y-0 md:flex-row"
  class:mt-6="{type != 'small'}"
  class:sticky="{!noSticky}">
  <div class="flex-1">
    {#if !context.params.hideNav}
      {#if type == "large"}
        <button
          type="submit"
          on:click="{() => {
            if (isDisabled)
              return;
            dispatch('buttonClick');
          }}"
          class="relative btn btn-block"
          class:btn-disabled={isDisabled}
          class:btn-primary={!isDisabled}
          >{context.params.view && context.params.view.submitButtonText
            ? context.params.view.submitButtonText
            : "Submit"}
          <div class="absolute right-2">
            <Icons icon="buttonrightarrow" />
          </div>
        </button>
      {:else if type == "small"}
        <button
          type="submit"
          on:click="{() => {
            if (isDisabled)
              return;
            dispatch('buttonClick');
          }}"
          class="btn btn-square"
          class:btn-disabled={isDisabled}
          class:btn-primary={!isDisabled}
          ><Icons icon="submitsmall" />
        </button>
      {/if}
    {/if}
  </div>
</div>
