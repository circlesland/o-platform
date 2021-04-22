<script lang="ts">
  import { EditorContext } from "./editorContext";
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import { Continue } from "@o-platform/o-process/dist/events/continue";

  export let context: EditorContext;

  function submit() {
    const answer = new Continue();
    answer.data = context.data;
    context.process.sendAnswer(answer);
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key == "Enter") {
      submit();
    }
  }
</script>

<label class="label" for={context.fieldName}>
  <span class="label-text">{context.params.label}</span>
</label>
<div class="w-full h-full">
  <a on:click={() => {
    context.dirtyFlags[context.fieldName] = true;
    submit();
  }}>Clear</a>
  <img
    id="cropCanvas"
    src="{context.data[context.fieldName]}"
    height="300"
  />
</div>
<br />
<ProcessNavigation on:buttonClick={submit} {context} />
