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
  let options = { duration: 50, easing: linear };

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
    in:fade={{ duration: 50 }}
    out:fade={{ duration: 50 }}
    on:click|self={handleClose}
    class="z-40 pt-2 text-base overlay"
  >
    <div
      class="w-full p-2 mt-1 modalAsideContentContainer"
      on:click|self={handleClose}
    >
      <div
        class="w-full bg-white rounded-lg modalAsideContent md:w-2/3 xl:w-1/2"
      >
        <div class="modalAsideScrollableContent">
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
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
  .modalAsideContentContainer {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    justify-content: flex-end;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 4.25rem;
  }
  .modalAsideContent {
    flex-grow: 0;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
  .modalAsideScrollableContent {
    flex-grow: 1;
    overflow: auto;
    min-height: 0;
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
