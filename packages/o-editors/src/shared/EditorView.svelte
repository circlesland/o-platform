<script lang="ts">
import NavSteps from "src/shared/molecules/NavSteps.svelte";
import { EditorContext } from "./../editorContext";

export let context: EditorContext;

let _context: EditorContext;
let titleColorClass = context.params.view.titleColor
  ? context.params.view.titleColor
  : "";
$: {
  _context = context;
}

console.log("Params: ", context);
</script>

<section class="flex flex-col items-center justify-center p-6 space-y-4">
  <slot name="EditorSteps">
    <!-- <div>
      <NavSteps steps="{[0, 0, 0]}" />
    </div> -->
  </slot>
  <slot name="EditorTitle">
    <div class="w-full text-center">
      <h1 class="uppercase font-heading {titleColorClass} text-3xl">
        {context.params.view.title}
      </h1>
    </div>
  </slot>
  <slot name="EditorDescription">
    <div class="w-full text-center">
      <span class="text-dark-lightest"
        >{@html context.params.view.description}</span>
    </div>
  </slot>
  <div class="w-full">
    <slot name="EditorMainComponent">
      <svelte:component
        this="{context.params.view.mainComponent}"
        context="{context}" />
    </slot>
  </div>
  <!-- <slot name="EditorActionButtons">
    <div class="w-full">BUTTONS</div>
  </slot> -->
</section>
