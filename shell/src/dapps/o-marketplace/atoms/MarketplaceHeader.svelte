<script lang="ts">
import TopNav from "src/shared/atoms/TopNav.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
export let header: string = null;

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
</script>

<TopNav runtimeDapp="{runtimeDapp}" routable="{routable}" />
