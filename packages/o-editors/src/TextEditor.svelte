<script lang="ts">
  import { EditorContext } from "./editorContext";
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import {Continue} from "@o-platform/o-process/dist/events/continue";

  export let context: EditorContext;

  function submit() {
    const answer = new Continue();
    answer.data = context.data;
    context.process.sendAnswer(answer);
  }

  function onkeydown(e:KeyboardEvent) {
    if (e.key == "Enter") {
      submit();
    }
  }
</script>

<div class="form-control justify-self-center">
  <label class="label" for={context.fieldName}>
    <span class="label-text">{context.params.label}</span>
  </label>
  <input
    on:keydown={onkeydown}
    id={context.fieldName}
    type="text"
    placeholder={context.params.placeholder}
    class="input input-lg input-bordered"
    bind:value={context.data[context.fieldName]}
  />
</div>

<ProcessNavigation on:buttonClick={submit} {context} />
