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
<div class="flex flex-col w-full h-full">
  <button
    class="self-end text-primary"
    on:click={() => {
      context.dirtyFlags[context.fieldName] = true;
      submit();
    }}>Clear</button
  >
  <div class="text-center">
    <div class="avatar">
      <div class="rounded-full w-92 h-92 ">
        <img
          class="m-auto"
          id="cropCanvas"
          src={context.data[context.fieldName]}
          height="300"
          alt="avatar"
        />
      </div>
    </div>
  </div>
</div>
<br />
<ProcessNavigation on:buttonClick={submit} {context} />
