<script lang="ts">
import Icons from "../molecules/Icons.svelte";

export let title: string = null;
export let icon: string = null;
export let size: number = 6;
export let colorClass: string = "";
export let customClass: string = "inline";
console.log("ICON: ", icon);
</script>

<div class="text-center align-top list-none cursor-pointer inline-table" on:click>
  <span>
    <span class="table-cell w-12 h-12 align-middle rounded-full {colorClass} {customClass} bg-light-light">
      <Icons icon="{icon}" customClass="w-{size} h-{size} heroicon smallicon inline" />
    </span>
    <span class="block w-24 text-xs sm:text-sm mt-1 text-center break-normal {colorClass}">
      {title}
    </span>
  </span>
</div>
