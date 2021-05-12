<script lang="ts">
  import SimpleHeader from "../atoms/SimpleHeader.svelte";
  import AdjacencyGraph from "../../../shared/pathfinder/CirclesAdjacencyGraph.svelte";
  import { mySafe } from "src/dapps/o-banking/stores/safe";
</script>

<SimpleHeader />

{#if $mySafe}
  <AdjacencyGraph address={$mySafe.safeAddress} />
{/if}
