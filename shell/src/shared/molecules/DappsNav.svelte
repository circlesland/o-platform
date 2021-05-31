<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  export let segment;
  export let isOpen: boolean = false;

  const current = writable(null);
  setContext("nav", current);

  $: $current = segment;
</script>

<footer
  id="dappsNav"
  class="z-50 w-full h-12 px-2 bg-white border-t border-base-300"
  class:hidden={isOpen}
>
  <ul class="flex flex-row items-stretch justify-between h-full primary">
    <slot />
  </ul>
</footer>
