<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { clickOutside } from "src/shared/functions/clickOutside";

  const eventDispatcher = createEventDispatcher();
</script>

<aside
  class="fixed right-0 z-50 flex flex-col flex-1 flex-shrink-0 w-64 h-screen text-white bg-white top-11">
  <div
    use:clickOutside
    on:click_outside="{() => eventDispatcher('clickedOutside')}">
    <slot />
  </div>
</aside>
