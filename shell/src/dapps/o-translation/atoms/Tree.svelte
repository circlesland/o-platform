<script>
export let data;
</script>

{#each Object.entries(data) as [key, values]}
  <ul class="ml-2 mb-4">
    <span>{key}:</span>
    {#if Array.isArray(values)}
      {#each values as item}
        <svelte:self data="{item}" />
      {/each}
    {:else if typeof values === "object"}
      <svelte:self data="{values}" />
    {:else}
      <span>{values}</span>
    {/if}
  </ul>
{/each}
