<script lang="ts">
import { EditorContext } from "./editorContext";
import ProcessNavigation from "./ProcessNavigation.svelte";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import CopyToClipboard from "../../../shell/src/shared/atoms/CopyClipboard.svelte";
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
</script>

<div>
  <div class="p-4 bg-white border form-control justify-self-center">
    {_context.data[context.field]}
  </div>

  {#if context.params.canCopy}
    <div class="flex flex-row w-full space-x-4">
      <div class="mt-6">
        <CopyToClipboard text="{_context.data[context.field]}" let:copy>
          <button on:click="{copy}" class="h-auto btn-block btn btn-light">
            Copy Code
          </button>
        </CopyToClipboard>
      </div>
      <ProcessNavigation on:buttonClick="{submit}" context="{context}" />
    </div>
  {:else}
    <ProcessNavigation on:buttonClick="{submit}" context="{context}" />
  {/if}
</div>
