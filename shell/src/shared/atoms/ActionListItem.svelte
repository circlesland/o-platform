<script lang="ts">
import Icons from "../molecules/Icons.svelte";

export let title: string = null;
export let icon: string = null;
export let colorClass: string = null;
export let small: boolean = false;
</script>

<div
  on:click
  class="flex space-x-2 flex-grow p-3 px-4 text-xs rounded-lg h-11
  cursor-pointer {colorClass} bg-light-light mt-2 mr-2 justify-center items-center">
  {#if icon && icon !== "undefined"}
    <div class="">
      <Icons icon="{icon}" size="{4}" />
    </div>
  {/if}
  {#if title}
    <span class="block text-xs sm:text-sm {colorClass} self-center"
      >{title}</span>
  {/if}
</div>
