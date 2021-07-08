<script lang="ts">
  import Icons from "./../../Icons.svelte";

  export let icon: any = null;
  export let text: string = null;
</script>

{#if icon}
  <Icons {icon} />
{/if}
{#if text}
  {text}
{/if}
