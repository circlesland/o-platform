<script lang="ts">
  export let icon: string;
</script>

{#if icon == "close"}
  <img
    src="/logos/close.svg"
    alt="circlesLand"
    class="bg-white rounded-full navlogo"
  />
{:else}
  <img
    src="/logos/logo.svg"
    alt="circlesLand"
    class="bg-white rounded-full navlogo"
  />
{/if}
