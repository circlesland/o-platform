<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let isOpen: boolean = true;
  export let disabled: boolean = false;

  function startAction(event) {
    if (disabled) {
      return;
    }

    dispatch("actionButton", {
      actionButton: event,
    });
  }
</script>

{#if isOpen}
  <img
    on:click={() => startAction("close")}
    src="/logos/close.svg"
    alt="circlesLand"
    class="bg-white rounded-full navlogo"
  />
{:else}
  <img
    on:click={() => startAction("open")}
    src="/logos/logo.svg"
    alt="circlesLand"
    class="bg-white rounded-full navlogo"
  />
{/if}
