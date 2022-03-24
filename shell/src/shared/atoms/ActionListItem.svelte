<script lang="ts">
import Icons from "../molecules/Icons.svelte";

export let title: string = null;
export let icon: string = null;
export let colorClass: string = null;
</script>

<div
  class="text-center align-top list-none cursor-pointer inline-table"
  on:click>
  <span>
    <span
      class="table-cell w-12 h-12 align-middle rounded-full {colorClass} bg-light-light">
      <Icons icon="{icon}" size="{6}" customClass="inline" />
    </span>
    <span class="block text-xs sm:text-sm mt-1 text-center {colorClass}">
      {title}
    </span>
  </span>
</div>
