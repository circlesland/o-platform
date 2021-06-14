<script lang="ts">
  import TopNav from "src/shared/atoms/TopNav.svelte";
  export let showBackArrow: boolean = false;
  export let showHomeButton: boolean = true;

</script>

<TopNav {showHomeButton} {showBackArrow} />

<div
  class="flex flex-col items-stretch h-24 text-white navbar bg-primarydark"
/>
