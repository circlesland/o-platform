<script lang="ts">
import { createEventDispatcher } from "svelte";
import { clickOutside } from "src/shared/functions/clickOutside";

const eventDispatcher = createEventDispatcher();
</script>

<div class="fixed z-10 flex flex-col flex-1 bottom-10">
  <nav class="flex flex-col flex-1 w-1 p-4 mt-4"></nav>
  <div class="relative flex-shrink-0 w-auto px-4 pt-4 space-y-2">
    <slot />
  </div>
</div>
