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
        <div
          class="relative flex text-xs text-center cursor-pointer text-primary -bottom-1"
          on:click="{copy}"
          alt="Copy to Clipboard">
          Copy to Clipboard
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="ml-2 h-5 w-5 stroke-current transform group-hover:rotate-[-4deg] transition"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            ></path>
          </svg>
        </div>
      </div>
    {/if}
  </label>

  <div class="p-4 bg-white border form-control justify-self-center">
    {_context.data[context.field]}
  </div>

  <ProcessNavigation on:buttonClick="{submit}" context="{context}" />
</div>
