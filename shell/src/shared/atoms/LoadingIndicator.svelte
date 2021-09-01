<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
  import { ProgressSignal } from "@o-platform/o-events/dist/signals/progressSignal";
  import { Subscription } from "rxjs";
  import LoadingSpinner from "./LoadingSpinner.svelte";

  let progressIndicator: { message: string; percent: number };
  let subscription: Subscription;

  onMount(() => {
    subscription = window.o.events.subscribe((event: PlatformEvent) => {
      if (event.type === "shell.begin") {
      }
      if (event.type === "shell.done") {
        progressIndicator = null;
      }
      if (event.type === "shell.progress") {
        const progressEvent: ProgressSignal = <ProgressSignal>event;
        progressIndicator = {
          message: progressEvent.message,
          percent: progressEvent.percent,
        };
      }
    });
  });

  onDestroy(() => {
    if (subscription) subscription.unsubscribe();
  });
</script>

<div class="flex flex-col items-center justify-center">
  <LoadingSpinner />
  {#if progressIndicator}
    <div class="mt-4 text-sm text-center text-primary">
      {progressIndicator.message}
    </div>
  {/if}
</div>
