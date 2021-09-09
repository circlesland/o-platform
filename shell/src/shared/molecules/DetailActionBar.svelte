<script lang="ts">
  import Icons from "./Icons.svelte";

  export let actions: any;

  // console.log("ACTIONS: ", actions);
</script>

<div class="flex flex-row justify-between space-x-4 text-dark">
  {#each actions as action}
    <div
      on:click="{() => {
        if (action.event) {
          window.o.publishEvent(action.event);
        }
        if (action.action) {
          action.action();
        }
      }}"
      class="flex flex-col items-center flex-grow py-2 text-xs text-center rounded-lg cursor-pointer bg-light-lighter">
      <div class="{action.colorClass}">
        <Icons icon="{action.icon}" />
      </div>
      <div class="text-2xs {action.colorClass}">{action.title}</div>
    </div>
  {/each}
</div>
