<script lang="ts">
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import { HtmlViewerContext } from "./htmlViewerContext";
  import { Continue } from "@o-platform/o-process/dist/events/continue";

  export let context: HtmlViewerContext;

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

<div class="p-4">
  {#if context.messages[context.field]}
    <div class="mt-2 mb-2 alert alert-error">
      <div class="flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="w-6 h-6 mx-2 stroke-current"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
        <label for="input">{context.messages[context.field]} </label>
      </div>
    </div>
  {/if}
  <div class="label-text">
    <!-- TODO: This is a very bad idea. It should be replaced with https://mdsvex.com/ -->
    {@html context.params.html({ data: context.data })}
  </div>
  <ProcessNavigation on:buttonClick={submit} {context} />
</div>
