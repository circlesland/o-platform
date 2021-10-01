<script lang="ts">
import { EditorContext } from "./editorContext";
import ProcessNavigation from "./ProcessNavigation.svelte";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import CopyClipBoard from "../../../shell/src/shared/atoms/CopyClipboard.svelte";
export let context: EditorContext;

let _context: EditorContext;
let length;

$: {
  _context = context;
  length = _context.data[context.field]
    ? _context.data[context.field].length
    : 0;
}
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
const copy = () => {
  const app = new CopyClipBoard({
    target: document.getElementById("clipboard"),
    props: { name: context.data[context.field] },
  });
  app.$destroy();
};
</script>

<div>
  <label class="label" for="{context.field}">
    {#if context.params.canCopy}
      <div class="inline-block text-xs break-all" id="clipboard">
        <input
          name="name"
          type="text"
          class="hidden"
          bind:value="{_context.data[context.field]}" />
      </div>
    {/if}
  </label>

  <div class="p-4 bg-white border form-control justify-self-center">
    {_context.data[context.field]}
  </div>

  {#if context.params.canCopy}
    <div class="flex flex-row w-full space-x-4">
      <div class="mt-6">
        <button on:click="{copy}" class="h-auto btn-block btn btn-light">
          Copy Code
        </button>
      </div>
      <ProcessNavigation on:buttonClick="{submit}" context="{context}" />
    </div>
  {:else}
    <ProcessNavigation on:buttonClick="{submit}" context="{context}" />
  {/if}
</div>
