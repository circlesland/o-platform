<script lang="ts">
  import { push } from "svelte-spa-router";
  import Icons from "./../../Icons.svelte";

  export let icon: any = null;
  export let link: string = null;
  export let text: string = null;

  function loadLink() {
    if (link) {
      push(link);
    }
  }
</script>

<!-- <div
  class="w-24 h-12 py-3 -ml-4 bg-white {roundclass} cursor-pointer px-11 xs:-ml-10 sm:-ml-12"
  on:click={() => loadLink()}
> -->

{#if icon}
  <Icons {icon} />
{/if}
{#if text}
  {text}
{/if}

<!-- </div> -->
