<script lang="ts">
  import Icons from "../molecules/Icons.svelte";

  export let title: string = null;
  export let icon: string = null;
  export let colorClass: string = null;
</script>

<div
  on:click
  class="flex flex-col items-center flex-grow py-2 text-xs text-center
  rounded-lg cursor-pointer {colorClass} bg-light-lighter">
  <div class="text-center">
    <Icons {icon} />
  </div>
  <span class="block mt-2 text-3xs sm:text-sm {colorClass}">{title}</span>
</div>
