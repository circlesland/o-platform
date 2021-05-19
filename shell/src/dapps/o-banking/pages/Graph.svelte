<script lang="ts">
  import TopNav from "src/shared/atoms/TopNav.svelte";
  import AdjacencyGraph from "../../../shared/pathfinder/CirclesAdjacencyGraph.svelte";
  import { mySafe } from "src/dapps/o-banking/stores/safe";
</script>

<TopNav showHomeButton={true} />

{#if $mySafe}
  <AdjacencyGraph address={$mySafe.safeAddress} />
{/if}
