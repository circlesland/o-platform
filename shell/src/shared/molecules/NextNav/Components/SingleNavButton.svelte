<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  export let segment;
  export let isOpen: boolean = false;

  const current = writable(null);
  setContext("nav", current);

  $: $current = segment;

</script>

<div class="w-12 h-12 px-3 py-3 ml-4 bg-white rounded-full text-secondary">
  <slot />
</div>
