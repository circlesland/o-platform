<script lang="ts">
  import { EditorContext } from "./editorContext";
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import { Continue } from "@o-platform/o-process/dist/events/continue";

  export let context: EditorContext;

  let _context: EditorContext;
  $: {
    _context = context;
  }

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
  <label
    class="self-center justify-center mb-2 text-center label"
    for={context.fieldName}
  >
    <span class="label-text">{@html context.params.label}</span>
  </label>
  {#if context.messages[context.fieldName]}
    <div class="mt-2 mb-2 alert alert-error">
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
  <input
    on:keydown={onkeydown}
    name="email"
    id={context.fieldName}
    type="email"
    placeholder={context.params.placeholder}
    class="input input-lg input-bordered"
    class:input-error={context.messages[context.fieldName]}
    bind:value={_context.data[context.fieldName]}
    on:change={() => (context.editorDirtyFlags[context.fieldName] = true)}
  />
</div>

<ProcessNavigation on:buttonClick={submitHandler} {context} />
