<script lang="ts">
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import { push } from "svelte-spa-router";
  import Icons from "../molecules/Icons.svelte";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;
  console.log("ROUTABLE: ", routable);
  console.log("runtimeDapp: ", runtimeDapp);
</script>

<div class="fixed top-0 left-0 z-10 w-full">
  <div
    class="grid w-full grid-cols-3 p-2 mx-auto text-white navbar bg-dark-dark justify-items-stretch"
  >
    <div class="justify-self-start">
      <img src="/logos/circles.png" class="w-8 h-8" alt="Circles Land" />
      <span class="ml-2 text-2xl uppercase font-heading text-light">
        {runtimeDapp.title}
      </span>
    </div>

    <div class="justify-self-center">
      {#if routable.title != runtimeDapp.title}
        <span class="text-md">{routable.title}</span>
      {/if}
    </div>

    <div class="col-start-3 pr-1 place-self-end justify-self-end">
      <div class="self-center text-center avatar ">
        <div class="w-8 h-8 rounded-full ring ring-primary">
          <img
            src="https://images.unsplash.com/photo-1493962333801-c5f3664c14f3?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzN8fGhvdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
            alt="alt"
          />
        </div>
      </div>
    </div>
  </div>

</div>
