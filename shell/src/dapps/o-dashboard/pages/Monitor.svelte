<script lang="ts">
  import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />
<div>
    <b>Finnland:</b><br/>
    <iframe class="w-full h-56" src="https://rpc.helsinki.circles.land/healthchecks-ui#/healthchecks"></iframe>
    <b>Germany:</b><br/>
    <iframe class="w-full h-56" src="https://rpc.falkenstein.circles.land/healthchecks-ui#/healthchecks"></iframe>
</div>

<style>
</style>
