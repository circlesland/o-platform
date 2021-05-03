<script lang="ts">
  import { EditorContext } from "./editorContext";
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import { Continue } from "@o-platform/o-process/dist/events/continue";
  import { onMount } from "svelte";
  export let context: EditorContext;

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

  onMount(() => {
    let textarea = document.querySelector("textarea");
    textarea.addEventListener("input", autoExpand);
  });
</script>

<div class="form-control justify-self-center">
  <label class="label" for={context.fieldName}>
    <span class="label-text">{context.params.label}</span>
  </label>

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
  <textarea
    readonly={context.isReadonly ? "readonly" : ""}
    name="input"
    rows="1"
    on:keydown={onkeydown}
    id={context.fieldName}
    type="text"
    placeholder={context.params.placeholder}
    class="textarea textarea textarea-bordered overflow-hidden"
    class:input-error={context.messages[context.fieldName]}
    bind:value={context.data[context.fieldName]}
  />
</div>

<ProcessNavigation on:buttonClick={submitHandler} {context} />
