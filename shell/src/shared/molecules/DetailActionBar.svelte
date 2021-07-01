<script lang="ts">
  import Icons from "./Icons.svelte";
  import { getLastLoadedDapp } from "src/loader";

  export let actions: any;

  console.log("ACTIONS: ", actions);
</script>

<div class="flex flex-row justify-between p-2 text-secondary">
  {#each actions as action}
    <div
      on:click={() => window.o.publishEvent(action.event)}
      class="flex flex-col items-center content-center self-start px-6 space-y-2 cursor-pointer"
    >
      <div>
        <Icons icon={action.icon} />
      </div>
      <div class="text-xs">{action.label}</div>
    </div>
  {/each}
</div>
