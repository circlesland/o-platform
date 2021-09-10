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

const onFocus = () => window.o.publishEvent({ type: "shell.inputFocused" });
const onBlur = () => window.o.publishEvent({ type: "shell.inputBlurred" });

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
    placeholder="{context.params.view.placeholder}"
    class="input input-lg input-bordered"
    class:input-error="{context.messages[context.field]}"
    bind:value="{_context.data[context.field]}"
    bind:this="{inputField}"
    on:focus="{onFocus}"
    on:blur="{onBlur}"
    on:change="{() => (context.editorDirtyFlags[context.field] = true)}" />

  <ProcessNavigation on:buttonClick="{submitHandler}" context="{context}" />
</div>
