<script lang="ts">
import { EditorContext } from "./editorContext";
import ProcessNavigation from "./ProcessNavigation.svelte";
import { Continue } from "@o-platform/o-process/dist/events/continue";

let inputField: any;
export let context: EditorContext;

let _context: EditorContext;
$: {
  _context = context;
}

context.data[context.field] =
  context.data[context.field] === undefined
    ? false
    : context.data[context.field];

const submitHandler = () => {
  const answer = new Continue();
  answer.data = context.data;
  context.process.sendAnswer(answer);
};
</script>

<div class="mt-4 bordered">
  <div class="form-control">
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
    <label class="cursor-pointer label" for="{context.field}">
      <span class="inline label-text">
        {context.params.label}
        {#if context.params.link}
          <a
            href="{context.params.link}"
            id="{context.params.linkLabel}"
            target="_blank"
            class="underline text-primary">
            {context.params.linkLabel}
          </a>
        {/if}
      </span>
      <div class="inline-block">
        <input
          name="checkbox"
          id="{context.field}"
          type="checkbox"
          class="checkbox checkbox-primary"
          bind:checked="{_context.data[context.field]}"
          bind:this="{inputField}"
          on:change="{() =>
            (context.editorDirtyFlags[context.field] = true)}" />
        <span
          class="bg-white checkbox-mark"
          class:input-error="{context.messages[context.field]}"></span>
      </div>
    </label>
  </div>
</div>

<ProcessNavigation on:buttonClick="{submitHandler}" context="{context}" />
