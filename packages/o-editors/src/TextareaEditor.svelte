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

  var autoExpand = function (field) {
    // Reset field height
    field.style.height = "inherit";

    // Get the computed styles for the element
    var computed = window.getComputedStyle(field);

    // Calculate the height
    var height =
      parseInt(computed.getPropertyValue("border-top-width"), 10) +
      parseInt(computed.getPropertyValue("padding-top"), 10) +
      field.scrollHeight +
      parseInt(computed.getPropertyValue("padding-bottom"), 10) +
      parseInt(computed.getPropertyValue("border-bottom-width"), 10);

    field.style.height = height + "px";
  };

  onMount(() => {
    document.addEventListener(
      "input",
      function (event) {
        if (event.target.tagName.toLowerCase() !== "textarea") return;
        autoExpand(event.target);
      },
      false
    );
  });
</script>

<div class="form-control justify-self-center">
  <label class="label" for={context.fieldName}>
    <span class="label-text">{context.params.label}</span>
  </label>

  <textarea
    readonly={context.isReadonly ? 'readonly' : ''}
    rows="4"
    name="input"
    on:keydown={onkeydown}
    id={context.fieldName}
    type="text"
    placeholder={context.params.placeholder}
    class="textarea  textarea textarea-bordered"
    class:input-error={context.messages[context.fieldName]}
    bind:value={context.data[context.fieldName]}
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
