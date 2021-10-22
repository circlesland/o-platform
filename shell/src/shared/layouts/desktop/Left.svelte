<script lang="ts">
import { createEventDispatcher } from "svelte";
import { clickOutside } from "src/shared/functions/clickOutside";

const eventDispatcher = createEventDispatcher();
</script>

<aside class="z-50 flex flex-col flex-1 flex-shrink-0 w-auto h-screen mt-12">
  <div class="">
    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 z-10 flex w-auto sidebar"
      use:clickOutside
      on:click_outside="{() => eventDispatcher('clickedOutside')}">
      <!-- Sidebar content -->
      <div class="z-10 flex flex-col flex-1 ">
        <nav class="flex flex-col flex-1 w-1 p-4 mt-4"></nav>
        <div class="relative flex-shrink-0 w-auto p-4 pt-4 pb-10 space-y-2">
          <slot />
        </div>
      </div>
    </div>
  </div>
</aside>
