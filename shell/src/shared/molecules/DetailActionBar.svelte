<script lang="ts">
  import ActionListItem from "src/shared/atoms/ActionListItem.svelte";
  export let actions: any;

  function handleClick(action) {
    if (action.event) {
      window.o.publishEvent(action.event);
    }
    if (action.action) {
      action.action();
    }
  }
</script>

<div class="flex flex-row justify-between space-x-4 text-dark">
  {#each actions as action}
    <ActionListItem
      icon="{action.icon}"
      title="{action.title}"
      colorClass="{action.colorClass}"
      on:click="{() => handleClick(action)}" />
  {/each}
</div>
