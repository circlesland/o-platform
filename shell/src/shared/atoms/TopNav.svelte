<script lang="ts">
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";

  export let runtimeDapp:RuntimeDapp<any>;
  export let routable:Routable;
</script>

<div class="fixed top-0 left-0 z-10 w-full">
  <div
    class="grid w-full grid-cols-3 p-2 pl-4 mx-auto text-white navbar bg-secondary-dark "
  >
    <div class="justify-self-start">
      <span class="text-lg uppercase ">
        {runtimeDapp.title}
      </span>
    </div>
    {#if routable.title != routable.title}
      <div class="justify-self-center">
        <span class="text-sm ">
          {routable.title}
        </span>
      </div>
    {/if}
  </div>
</div>
