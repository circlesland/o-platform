<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let isOpen: boolean = true;
  export let link: string = null;
  export let action: string = null;
  export let actions: Array = null;

  let actionButtonIcon = "/logos/logo.svg";
  let actionButtonCloseIcon = "/logos/close.svg";
  let actionButtonImage;

  function startAction(event) {
    dispatch("actionButton", {
      actionButton: event,
    });

    if (event == "close") {
      isOpen = false;
    } else if (event == "open") {
      isOpen = true;
    }
  }

</script>

{#if isOpen}
  <img
    on:click={() => startAction("close")}
    src="/logos/close.svg"
    alt="circlesLand"
    class="w-16 h-16 bg-white rounded-full navlogo"
  />
{:else}
  <img
    on:click={() => startAction("open")}
    src="/logos/logo.svg"
    alt="circlesLand"
    class="w-16 h-16 bg-white rounded-full navlogo"
  />
{/if}

<style>
  .navlogo {
    margin-top: -1.25rem;
  }

</style>
