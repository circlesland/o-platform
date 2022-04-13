<script lang="ts">
import Icons from "./../../Icons.svelte";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";

export let icon: any = null;
export let text: string = null;
</script>

{#if text}
  {text}
{:else if icon}
  <Icon name="{icon}" class="w-6 h-6 heroicon smallicon" />
{/if}
