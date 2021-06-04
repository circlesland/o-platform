<script lang="ts">
  import { Process } from "@o-platform/o-process/dist/interfaces/process";
  import { Prompt } from "@o-platform/o-process/dist/events/prompt";
  import {Schema} from "yup";
  import {PromptField} from "@o-platform/o-process/dist/states/prompt";
  import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";

  export let process: Process;
  export let prompt: Prompt<ProcessContext<any>>;
  let componentContext: {
    field: PromptField<ProcessContext<any>>;
    data: { [x: string]: any };
    dirtyFlags: { [x: string]: any };
    editorDirtyFlags: { [x: string]: any };
    params: { [x: string]: any };
    messages: { [x: string]: any };
    dataSchema: Schema<any, any>;
    isSensitive?:boolean;
    process: Process;
    canGoBack: boolean;
    canSkip: boolean;
  } | null;

  $: {
    // Whenever the prompt changes ('prompt' is set from outside by it's parent ProcessContainer molecule):
    if (prompt) {
      //console.log("Prompt.svelte got a 'prompt':", prompt);
      componentContext = {
        process: process,
        field: prompt.field,
        data: prompt.data,
        dirtyFlags: prompt.dirtyFlags,
        messages: prompt.messages,
        params: prompt.params,
        canGoBack: prompt.navigation.canGoBack,
        canSkip: prompt.navigation.canSkip,
        dataSchema: prompt.dataSchema,
        editorDirtyFlags: prompt.editorDirtyFlags,
        isSensitive: prompt.isSensitive
      };
    } else {
      componentContext = null;
    }
  }
</script>

{#if componentContext}
  <svelte:component this={prompt.component} context={componentContext} />
{:else}
  Hmm... Nothing to display here. Seems like the 'prompt' attribute of the
  Prompt.svelte component is not set.<br />
{/if}
