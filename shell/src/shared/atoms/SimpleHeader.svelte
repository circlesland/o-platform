<script lang="ts">
import TopNav from "./TopNav.svelte";
import PageHeader from "./PageHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let headerString: string = null;
</script>

<TopNav
  runtimeDapp="{runtimeDapp}"
  routable="{routable}"
  headerString="{headerString}" />

<PageHeader heightClass="h-8 mt-12" />
