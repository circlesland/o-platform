<script lang="ts">
import { EditorContext } from "./editorContext";
import ProcessNavigation from "./ProcessNavigation.svelte";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { onMount } from "svelte";

export let context: EditorContext;

let _context: EditorContext;
$: {
  _context = context;
}

console.log("INNER CONTEXT : ", context);
let inputField: any;
let fieldId = context.isSensitive
  ? Math.random().toString().replace(".", "")
  : context.field;

const submitHandler = () => {
  const answer = new Continue();
  answer.data = context.data;
  context.process.sendAnswer(answer);
};

function onkeydown(e: KeyboardEvent) {
  if (e.key == "Enter") {
    submitHandler();
  }
}
</script>

<div class="form-control justify-self-center">
  {#if context.messages[context.field]}
    <div class="mt-2 mb-2 alert alert-error">
      <div class="flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="w-6 h-6 mx-2 stroke-current">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          ></path>
        </svg>
        <label for="input">{context.messages[context.field]} </label>
      </div>
    </div>
  {/if}
  <input
    on:keydown="{onkeydown}"
    id="{fieldId}"
    name="{fieldId}"
    autocomplete="{fieldId}"
    type="text"
    maxlength="6"
    class="m-auto text-4xl top-2 input input-lg input-bordered input-number w-80"
    bind:value="{_context.data[context.field]}"
    bind:this="{inputField}"
    on:focus
    on:blur
    on:change="{() => (context.editorDirtyFlags[context.field] = true)}" />
  <!-- <div class="relative h-20 m-auto w-72">
    <div class="absolute h-20 pt-2">
      <div
        class="relative flex flex-row w-full h-16 space-x-2 overflow-hidden bg-transparent">
        <div class="w-10 h-12 border rounded-lg border-dark-lightest"></div>
        <div class="w-10 h-12 border rounded-lg border-dark-lightest"></div>
        <div class="w-10 h-12 border rounded-lg border-dark-lightest"></div>
        <div class="w-10 h-12 border rounded-lg border-dark-lightest"></div>
        <div class="w-10 h-12 border rounded-lg border-dark-lightest"></div>
        <div class="w-10 h-12 border rounded-lg border-dark-lightest"></div>
      </div>
      <input
        on:keydown="{onkeydown}"
        id="{fieldId}"
        name="{fieldId}"
        autocomplete="{fieldId}"
        type="text"
        maxlength="6"
        class="absolute text-4xl top-2 input input-number"
        bind:value="{_context.data[context.field]}"
        bind:this="{inputField}"
        on:change="{() => (context.editorDirtyFlags[context.field] = true)}" />
    </div>
  </div> -->
</div>
<ProcessNavigation on:buttonClick="{submitHandler}" context="{context}" />
