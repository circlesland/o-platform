<script lang="ts">
import NavSteps from "src/shared/molecules/NavSteps.svelte";
import { EditorContext } from "./../editorContext";
import TextEditor from "./../TextEditor.svelte";

export let context: EditorContext;

let _context: EditorContext;
$: {
  _context = context;
}

console.log("Params: ", context);
</script>

<section class="flex flex-col items-center justify-center space-y-4">
  <slot name="EditorSteps">
    <div>
      <NavSteps steps="{[0, 0, 0]}" />
    </div>
  </slot>
  <slot name="EditorTitle">
    <div class="w-full text-center">
      <h1 class="uppercase font-heading">{context.params.title}</h1>
    </div>
  </slot>
  <slot name="EditorDescription">
    <div class="w-full text-center">
      <span class="text-dark-lightest">{context.params.description}</span>
    </div>
  </slot>
  <div class="w-full">
    <slot name="EditorMainComponent">
      <svelte:component
        this="{context.params.mainComponent}"
        context="{context}" />
    </slot>
  </div>
  <!-- <slot name="EditorActionButtons">
    <div class="w-full">BUTTONS</div>
  </slot> -->
</section>
