<script lang="ts">
  import TopNav from "src/shared/atoms/TopNav.svelte";
  export let showBackArrow: boolean = false;
  export let showHomeButton: boolean = true;
</script>

<TopNav {showHomeButton} {showBackArrow} />

<div
  class="h-24 flex flex-col items-stretch navbar bg-gradient-to-r from-gradient1 to-gradient2 text-white"
/>
