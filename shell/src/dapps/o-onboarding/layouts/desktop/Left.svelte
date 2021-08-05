<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { clickOutside } from "src/shared/functions/clickOutside";

  const eventDispatcher = createEventDispatcher();
</script>

<aside
  class="z-50 flex-col flex-1 flex-shrink-0 hidden w-64 h-screen mt-12 desktop-view lg:flex">
  <div class="">
    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 z-10 flex w-72 sidebar"
      use:clickOutside
      on:click_outside="{() => eventDispatcher('clickedOutside')}">

      <!-- Sidebar content -->
      <div class="z-10 flex flex-col flex-1 ">
        <nav class="flex flex-col flex-1 w-64 p-4 mt-4"></nav>
        <div class="relative flex-shrink-0 w-64 p-4 pt-4 pb-10 space-y-2">
          <slot />
        </div>
      </div>
    </div>
  </div>
</aside>
