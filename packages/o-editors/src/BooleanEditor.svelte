<script lang="ts">
  import { EditorContext } from "./editorContext";
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import { Continue } from "@o-platform/o-process/dist/events/continue";

  export let context: EditorContext;

  context.data[context.fieldName] =
    context.data[context.fieldName] === undefined
      ? false
      : context.data[context.fieldName];

  const submitHandler = () => {
    const answer = new Continue();
    answer.data = context.data;
    context.process.sendAnswer(answer);
  };
</script>

<div class="mt-4 bordered">
  <div class="form-control">
    <label class="cursor-pointer label" for={context.fieldName}>
      <span class="label-text">
        {context.params.label}
        {#if context.params.link}
          <a
            href={context.params.link}
            id={context.params.linkLabel}
            target="_blank"
            class="underline"
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
          bind:checked={context.data[context.fieldName]}
        />
        <span
          class="checkbox-mark bg-white"
          class:input-error={context.messages[context.fieldName]}
        />
      </div>
    </label>
    {#if context.messages[context.fieldName]}
      <label class="label text-right" for="form-error">
        <span id="form-error" class="label-text-alt text-error"
          >{context.messages[context.fieldName]}</span
        >
      </label>
    {/if}
  </div>
</div>
<ProcessNavigation on:buttonClick={submitHandler} {context} />
