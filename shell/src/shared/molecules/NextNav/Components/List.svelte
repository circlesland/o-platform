<script lang="ts">
import Icons from "./../../Icons.svelte";
export let icon: any = null;
export let text: string = null;
</script>

{#if text}
  <span class="flex flex-col self-center justify-center h-full mr-1 text-xs text-white">{text}</span>
{:else if icon}
  <Icons icon="{icon}" />
{/if}
