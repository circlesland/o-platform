<script lang="ts">
import { Process } from "@o-platform/o-process/dist/interfaces/process";
import { Prompt } from "@o-platform/o-process/dist/events/prompt";
import { Schema } from "yup";
import { PromptField } from "@o-platform/o-process/dist/states/prompt";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import DropdownSelectEditor from "@o-platform/o-editors/src/DropdownSelectEditor.svelte";
import NavSteps from "./NavSteps.svelte";
import {_} from "svelte-i18n";
import Label from "../atoms/Label.svelte";

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
  isSensitive?: boolean;
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
      isSensitive: prompt.isSensitive,
    };
  } else {
    componentContext = null;
  }
}

const onFocus = () => window.o.publishEvent({ type: "shell.inputFocused" });
const onBlur = () => window.o.publishEvent({ type: "shell.inputBlurred" });
</script>

{#if componentContext}
  <section
    class="flex flex-col items-center justify-center p-6 space-y-4"
    class:pb-0="{prompt.component === DropdownSelectEditor}">
    <slot name="EditorSteps">
      <!-- <div>
        TODO: Once we know the steps and the current step position, we can activate this.
        <NavSteps steps="{[{active: false}}, {active: true}, {active: false}]}" />
      </div> -->
    </slot>
    <slot name="EditorTitle">
      {#if prompt.params.view && prompt.params.view.title}
        <div class="w-full text-center">
          <h1
            class="text-3xl uppercase font-heading {prompt.params.view
              ? prompt.params.view.titleClass
              : ''}">
            {@html prompt.params.view ? prompt.params.view.title : ""}
          </h1>
        </div>
      {/if}
    </slot>
    <slot name="EditorDescription">
      {#if prompt.params.view && prompt.params.view.description}
        <div class="w-full text-center">
          <span class="text-dark-lightest">
            {@html prompt.params.view ? prompt.params.view.description : ""}
          </span>
        </div>
      {/if}
    </slot>
    <div class="w-full">
      <slot name="EditorMainComponent">
        <svelte:component
          this="{prompt.component}"
          context="{componentContext}"
          on:focus="{onFocus}"
          on:blur="{onBlur}" />
      </slot>
    </div>
    <!-- <slot name="EditorActionButtons">
    <div class="w-full">BUTTONS</div>
  </slot> -->
  </section>
{:else}
  <Label key="shared.molecules.prompt.nothingToDisplay"  />
  <br />
{/if}
