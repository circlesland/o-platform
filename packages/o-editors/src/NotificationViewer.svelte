<script lang="ts">
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import { Continue } from "@o-platform/o-process/dist/events/continue";
  import {NotificationViewerContext} from "./notificationViewerContext";

  export let context: NotificationViewerContext;

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
  {#if context.data[context.field]}
    <pre>
      {JSON.stringify(context.data[context.field], null, 2)}
    </pre>
  {/if}
  <ProcessNavigation on:buttonClick={submit} {context} />
</div>
