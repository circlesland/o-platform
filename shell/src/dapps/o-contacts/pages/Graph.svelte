<script lang="ts">
import TopNav from "../../../shared/atoms/TopNav.svelte";
import AdjacencyGraph from "../../../shared/pathfinder/CirclesAdjacencyGraph.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { me } from "../../../shared/stores/me";
export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
</script>

<TopNav
  runtimeDapp="{runtimeDapp}"
  routable="{routable}"
  showHomeButton="{true}" />
{#if $me && $me.circlesAddress}
  <AdjacencyGraph address="{$me.circlesAddress}" />
{/if}
