<script lang="ts">
  import TopNav from "src/shared/atoms/TopNav.svelte";
  import PageHeader from "src/shared/atoms/PageHeader.svelte";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;
</script>

<TopNav {runtimeDapp} {routable} />

<PageHeader heightClass="h-12" />
