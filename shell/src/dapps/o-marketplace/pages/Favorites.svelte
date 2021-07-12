<script lang="ts">
  import MarketplaceHeader from "../atoms/MarketplaceHeader.svelte";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  export let runtimeDapp:RuntimeDapp<any>;
  export let routable:Routable;
</script>
<MarketplaceHeader  {runtimeDapp} {routable} />