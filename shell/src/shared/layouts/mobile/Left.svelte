<script lang="ts">
import { fly } from "svelte/transition";
import { createEventDispatcher } from "svelte";
import { clickOutside } from "src/shared/functions/clickOutside";

const eventDispatcher = createEventDispatcher();
let x = -500;
</script>

<aside class="flex mobileSideBarLeft mobile-view lg:hidden">
  <div class="">
    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 flex w-auto p-4 pb-10 bg-white z-99 mobileSidebarInner"
      in:fly|local="{{ x, delay: 50 }}"
      out:fly|local="{{ x: x, duration: 120 }}"
      use:clickOutside
      on:click_outside="{() =>
        window.o.publishEvent({
          type: 'shell.closeNavigation',
        })}">
      <!-- Sidebar content -->
      <slot />
    </div>
  </div>
</aside>

<style>
/* .mobile-view {

  } */
.mobileSideBarLeft {
  z-index: 99;
  background-color: rgba(177, 192, 200, 0.4);
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;

  align-items: flex-start;
  justify-content: center;
  overflow-y: hidden;

  flex-direction: column;
  height: 100%;
  width: 100%;
}
.mobileSideBarLeft .mobileSidebarInner {
  top: 0;
  --tw-shadow: 0 25px 50px 82px rgba(13, 43, 102, 0.45);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #95b7ca), var(--tw-ring-shadow, 0 0 #95b7ca), var(--tw-shadow);
}
</style>
