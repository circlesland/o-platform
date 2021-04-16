<script lang="ts">
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import {HtmlViewerContext} from "./htmlViewerContext";
  import {Continue} from "@o-platform/o-process/dist/events/continue";

  export let context: HtmlViewerContext;

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

<!-- TODO: This is a very bad idea. It should be replaced with https://mdsvex.com/ -->
{@html context.params.html({data:context.data})}

<ProcessNavigation on:buttonClick={submit} {context} />