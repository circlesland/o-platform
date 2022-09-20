<script lang="ts">
import { EditorContext } from "./editorContext";
import ProcessNavigation from "./ProcessNavigation.svelte";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { onMount } from "svelte";
import Icons from "../../../shell/src/shared/molecules/Icons.svelte";

export let context: EditorContext;

let initialData: any;
onMount(() => {
  initialData = context.data[context.field];
});

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
  <div class="flex flex-col w-full h-full pb-2">
    <!-- <button
      class="self-end text-primary"
      on:click="{() => {
        context.dirtyFlags[context.field] = true;
        context.editorDirtyFlags[context.field] = true;
        context.data[context.field] = null;
        submit();
      }}">Clear</button> -->
    <div class="text-center">
      <div class="relative inline-flex">
        <div
          class="absolute z-10 text-center align-top list-none cursor-pointer top-1 right-2 inline-table "
          on:click="{() => {
            context.dirtyFlags[context.field] = true;
            context.editorDirtyFlags[context.field] = true;
            context.data[context.field] = null;
            submit();
          }}">
          <span>
            <span class="table-cell w-10 h-10 align-middle bg-black rounded-full text-primary bg-opacity-60">
              <Icons icon="camera" customClass="inline w-6 h-6 heroicon smallicon" />
            </span>
          </span>
        </div>
        <div class="w-48 rounded-full w-92 h-92">
          <img
            class="m-auto rounded-full"
            id="cropCanvas"
            src="{context.data[context.field]}"
            height="300"
            alt="avatar" />
        </div>
      </div>
    </div>
  </div>
  <ProcessNavigation on:buttonClick="{submit}" context="{context}" />
</div>
