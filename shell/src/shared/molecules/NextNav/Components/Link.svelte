<script lang="ts">
import Icons from "./../../Icons.svelte";

export let icon: any = null;
export let text: string = null;
</script>

{#if text}
  {text}
{:else if icon}
  <Icons icon="{icon}" customClass="w-6 h-6 heroicon smallicon" />
{/if}
