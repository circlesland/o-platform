<script lang="ts">
  import TopNav from "src/shared/atoms/TopNav.svelte";
  import AdjacencyGraph from "../../../shared/pathfinder/CirclesAdjacencyGraph.svelte";
  import { mySafe } from "src/dapps/o-banking/stores/safe";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import {me} from "../../../shared/stores/me";
  export let runtimeDapp:RuntimeDapp<any>;
  export let routable:Routable;
</script>

<TopNav {runtimeDapp} {routable} showHomeButton={true} />
{#if $me && $me.circlesAddress}
  <AdjacencyGraph address={$me.circlesAddress} />
{/if}
