<script lang="ts">
  import Icons from "./Icons.svelte";

  export let actions: any;

  console.log("ACTIONS: ", actions);
</script>

<div class="flex flex-row justify-between p-2 text-secondary">
  {#each actions as action}
    <div
      on:click={() => {
        if (action.event) {
          window.o.publishEvent(action.event);
        }
        if (action.action) {
          action.action();
        }
      }}
      class="flex flex-col items-center content-center self-start px-6 py-4 space-y-1 rounded-lg cursor-pointer bg-light-lighter"
    >
      <div>
        <Icons icon={action.icon} />
      </div>
      <div class="text-2xs">{action.title}</div>
    </div>
  {/each}
</div>
