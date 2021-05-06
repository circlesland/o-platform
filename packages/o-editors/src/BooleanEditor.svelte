<script lang="ts">
  import { EditorContext } from "./editorContext";
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import { Continue } from "@o-platform/o-process/dist/events/continue";
  import { onMount } from "svelte";

  let inputField: any;
  export let context: EditorContext;

  let _context: EditorContext;
  $: {
    _context = context;
  }

  context.data[context.fieldName] =
    context.data[context.fieldName] === undefined
      ? false
      : context.data[context.fieldName];

  const submitHandler = () => {
    const answer = new Continue();
    answer.data = context.data;
    context.process.sendAnswer(answer);
  };

  onMount(() => inputField.focus());
</script>

<div class="mt-4 bordered">
  <div class="form-control">
    {#if context.messages[context.fieldName]}
      <div class="alert alert-error mb-2 mt-2">
        <div class="flex-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="w-6 h-6 mx-2 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
          <label for="input">{context.messages[context.fieldName]} </label>
        </div>
      </div>
    {/if}
    <label class="cursor-pointer label" for={context.fieldName}>
      <span class="label-text">
        {context.params.label}
        {#if context.params.link}
          <a
            href={context.params.link}
            id={context.params.linkLabel}
            target="_blank"
            class="text-primary underline"
          >
            {context.params.linkLabel}
          </a>.
        {/if}
      </span>
      <div>
        <input
          name="checkbox"
          id={context.fieldName}
          type="checkbox"
          class="checkbox checkbox-primary"
          bind:checked={_context.data[context.fieldName]}
          bind:this={inputField}
          on:change={() => (context.editorDirtyFlags[context.fieldName] = true)}
        />
        <span
          class="checkbox-mark bg-white"
          class:input-error={context.messages[context.fieldName]}
        />
      </div>
    </label>
  </div>
</div>
<ProcessNavigation on:buttonClick={submitHandler} {context} />
