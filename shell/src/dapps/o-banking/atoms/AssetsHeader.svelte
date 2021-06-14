<script lang="ts">
  import TopNav from "src/shared/atoms/TopNav.svelte";

  export let showBackArrow: boolean = false;

</script>

<TopNav showHomeButton={true} {showBackArrow} />

<div
  class="flex flex-col items-stretch h-24 text-white navbar bg-primarydark"
/>
