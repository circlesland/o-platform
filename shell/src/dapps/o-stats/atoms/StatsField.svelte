<script lang="ts">
  import { Stats } from "../../../shared/api/data/types";

  export let stats: Stats;
  export let field: {
    key: string;
    title: string;
    displayName?: (offer: Stats) => string;
  };

</script>

<div class="mb-4 text-sm text-left text-primary">
  {#if field && stats && stats[field.key]}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="inline w-4 h-4 -mt-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
    {field.title}:
    <span class="inline text-dark"
      >{field.displayName ? field.displayName(stats) : stats[field.key]}</span
    >
  {/if}
</div>
