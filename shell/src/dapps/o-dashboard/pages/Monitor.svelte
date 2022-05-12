<script lang="ts">
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />
<div>
  <b>Indexer:</b><br />
  <iframe class="w-full h-20" src="https://index.circles.land/health" title="health"></iframe>
  <b>Finnland:</b><br />
  <iframe class="w-full h-16" src="https://rpc.helsinki.circles.land/health" title="health"></iframe>
  <b>Germany:</b><br />
  <iframe class="w-full h-16" src="https://rpc.falkenstein.circles.land/health" title="health"></iframe>
</div>

<style>
</style>
