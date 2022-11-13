<script lang="ts">
import { EditorContext } from "./editorContext";
import ProcessNavigation from "./ProcessNavigation.svelte";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { onMount } from "svelte";
import CopyToClipboard from "../../../shell/src/shared/atoms/CopyClipboard.svelte";

export let context: EditorContext;

let _context: EditorContext;
let length;

$: {
  _context = context;
  length = _context.data[context.field]
    ? _context.data[context.field].length
    : 0;
}

let inputField: any;
let maxlength: string = context.params.view.maxLength
  ? context.params.view.maxLength
  : "500";

const submitHandler = () => {
  const answer = new Continue();
  answer.data = context.data;
  context.process.sendAnswer(answer);
};

var autoExpand = function () {
  var el = this;
  setTimeout(function () {
    el.style.cssText = "height:auto; padding:0 padding-top: 2px;";
    el.style.cssText = "height:" + el.scrollHeight + "px";
  }, 0);
};

/* trim input and set dirty flag */
const validateFormatting = () => {
  context.editorDirtyFlags[context.field] = true;
  _context.data[context.field] = _context.data[context.field].trim();
};

onMount(() => {
  let textarea = document.querySelector("textarea");
  textarea.addEventListener("input", autoExpand);
  if (length > 17) {
    textarea.dispatchEvent(new Event("input"));
  }
});
</script>

<div class="form-control justify-self-center">
  <label class="p-0 label" for="{context.field}">
    {#if context.params.canCopy}
      <CopyToClipboard text="{_context.data[context.field]}" let:copy>
        <div on:click="{copy}" class="text-sm text-gray-500">
          Copy to Clipboard
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="inline w-4 h-4 stroke-current text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0
                00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0
                012 2"></path>
          </svg>
        </div>
      </CopyToClipboard>
    {/if}
  </label>

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
  <textarea
    readonly="{context.isReadonly ? 'readonly' : ''}"
    maxlength="{maxlength}"
    name="input"
    rows="1"
    id="{context.field}"
    type="text"
    placeholder="{context.params.view.placeholder}"
    class="overflow-hidden textarea textarea-bordered"
    class:input-error="{context.messages[context.field]}"
    bind:value="{_context.data[context.field]}"
    bind:this="{inputField}"
    on:focus
    on:blur
    on:change="{validateFormatting}"></textarea>
  {#if !context.params.hideCharacterCount}
    <p class="relative right-0 text-right text-2xs top-2">
      {length}/{maxlength} Characters. {length > maxlength
        ? "Oops, please enter a maximum of " + maxlength + " characters."
        : ""}
    </p>
  {/if}

  <ProcessNavigation on:buttonClick="{submitHandler}" context="{context}" />
</div>

<style>
textarea {
  font-size: 1.125rem;
  line-height: 2rem;
}
</style>
