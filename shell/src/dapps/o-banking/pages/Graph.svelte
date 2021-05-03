<script lang="ts">
  import TokensHeader from "../atoms/TokensHeader.svelte";
  import AdjacencyGraph from "../../../shared/pathfinder/CirclesAdjacencyGraph.svelte";
  import {mySafe} from "src/dapps/o-banking/stores/safe";
</script>

<TokensHeader />
{#if $mySafe}
  <AdjacencyGraph address={$mySafe.safeAddress}></AdjacencyGraph>
{/if}