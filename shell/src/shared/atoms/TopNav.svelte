<script lang="ts">
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import { push } from "svelte-spa-router";
  import Icons from "../molecules/Icons.svelte";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;
  console.log("ROUTABLE: ", routable);
</script>

<div class="fixed top-0 left-0 z-10 w-full">
  <div
    class="grid w-full grid-cols-3 p-2 mx-auto text-white navbar bg-dark-dark"
  >
    <div
      class="justify-self-start"
      class:col-span-2={runtimeDapp.title == 'Circles Land'}
    >
      <img src="/logos/circles.png" class="w-8 h-8" alt="Circles Land" />
      <span class="ml-2 text-2xl uppercase font-heading text-light">
        {runtimeDapp.title}
      </span>
    </div>
    {#if routable.title != runtimeDapp.title}
      <div class="justify-self-center">
        <span class="text-md">{routable.title}</span>
      </div>
    {/if}
  </div>

</div>
