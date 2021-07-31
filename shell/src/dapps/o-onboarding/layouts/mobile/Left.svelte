<script lang="ts">
  import { fly } from "svelte/transition";
  import Icons from "../../../../shared/molecules/Icons.svelte";
  import { createEventDispatcher } from "svelte";
  import { clickOutside } from "src/shared/functions/clickOutside";

  const eventDispatcher = createEventDispatcher();
  let x = -500;
</script>

<aside class="flex mobileSideBarLeft mobile-view lg:hidden">
  <div class="">
    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 z-10 flex w-72 mobileSidebarInner bg-dark-dark"
      in:fly|local="{{ x, delay: 50 }}"
      out:fly|local="{{ x: x, duration: 120 }}"
      use:clickOutside
      on:click_outside="{() => eventDispatcher('clickedOutside')}">
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
    --tw-shadow: 0 25px 50px 82px rgba(0, 0, 0, 0.45);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }
</style>
