<script lang="ts">
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import {onMount} from "svelte";

  export let runtimeDapp:RuntimeDapp<any>;
  export let routable:Routable;

  onMount(() => {

  });

</script>

<SimpleHeader {runtimeDapp} {routable}  />