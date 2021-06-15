<script lang="ts">
  // imports
  import { createEventDispatcher } from "svelte";
  import { fade, slide } from "svelte/transition";
  import { linear } from "svelte/easing";

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
  let options = { duration: 200, easing: linear };

  // transition:slide={options}

</script>

{#if isOpen}
  <aside
    id="modalAside"
    on:keydown={handleEsc}
    aria-labelledby="modal-heading"
    aria-modal="true"
    tabIndex={-1}
    {role}
    in:fade
    out:fade
    on:click|self={handleClose}
    class="z-40 overlay"
  >
    <div
      class="relative grid w-full max-h-full pt-2 ml-2 mr-2 overflow-y-scroll bg-white rounded-lg min-w-min justify-items-stretch md:w-2/3 xl:w-1/2"
    >
      <div class="p-4 pb-4 space-y-2 lg:px-8">
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
    background-color: rgba(177, 192, 200, 0.4);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    overflow-y: hidden;
    @apply pb-20;
  }
  /* Background Blurring for firefox and other non supportive browsers lies in App.svelte through the .blur class */
  @supports (backdrop-filter: blur(4px)) or (-webkit-backdrop-filter: blur(4px)) {
    aside {
      opacity: 1;
      -webkit-backdrop-filter: blur(4px);
      backdrop-filter: blur(4px);
    }
  }

</style>
