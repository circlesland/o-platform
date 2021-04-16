<script lang="ts">
  // imports
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();
  // public props
  // export let triggerRef = undefined;
  export let isOpen = false;
  export let role = "dialog";
  // functions
  const handleClose = () => {
    dispatch("closeRequest");
  };
  const handleEsc = (e) => e.key === "Escape" && handleClose();
</script>

{#if isOpen}
  <aside
    on:keydown={handleEsc}
    aria-labelledby="modal-heading"
    aria-modal="true"
    tabIndex={-1}
    {role}
    in:fade
    out:fade
    on:click|self={handleClose}
    class="z-40 overlay p-2"
  >
    <div
      class="w-full min-w-min grid justify-items-stretch pt-2 mb-10 rounded-t-lg bg-white md:w-2/3 xl:w-1/2 "
    >
      <img
        class="inline justify-self-center -mt-8 w-12 h-12 -mb-6 z-30 "
        src="/images/common/circles.png"
        alt="circles.land"
      />
      <div class="p-4 pt-8 space-y-2 md:p-8">
        <div class="flex">
          <div class="w-full m-auto">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </aside>
{/if}

<style>
  * {
    box-sizing: border-box;
  }
  aside {
    /* z-index: 1000; */
    background-color: rgba(42, 46, 55, 0.4);
    backdrop-filter: blur(10px);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    overflow-y: hidden;
  }
</style>
