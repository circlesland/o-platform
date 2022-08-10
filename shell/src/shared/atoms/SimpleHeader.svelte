<script lang="ts">
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import TopNav from "./TopNav.svelte";
  import PageHeader from "./PageHeader.svelte";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;
  export let headerString: string = null;
</script>

<TopNav {runtimeDapp} {routable} {headerString} />

<PageHeader heightClass="h-8 mt-12" />
