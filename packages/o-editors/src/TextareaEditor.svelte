<script lang="ts">
  import { EditorContext } from "./editorContext";
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import { Continue } from "@o-platform/o-process/dist/events/continue";
  import { autoresize } from "./autoResize";

  export let context: EditorContext;

  const submitHandler = () => {
    const answer = new Continue();
    answer.data = context.data;
    context.process.sendAnswer(answer);
  };
</script>

<div class="form-control justify-self-center">
  <label class="label" for={context.fieldName}>
    <span class="label-text">{context.params.label}</span>
  </label>

  <textarea
    rows="4"
    name="input"
    on:keydown={onkeydown}
    id={context.fieldName}
    type="text"
    placeholder={context.params.placeholder}
    class="textarea h-24 textarea textarea-bordered"
    class:input-error={context.messages[context.fieldName]}
    bind:value={context.data[context.fieldName]}
    use:autoresize
  />
  {#if context.messages[context.fieldName]}
    <label class="label text-right" for="form-error">
      <span id="form-error" class="label-text-alt text-error "
        >{context.messages[context.fieldName]}</span
      >
    </label>
  {/if}
</div>

<ProcessNavigation on:buttonClick={submitHandler} {context} />
