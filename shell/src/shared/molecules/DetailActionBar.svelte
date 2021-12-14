<script lang="ts">
/*
 * Edge Case: if the very first items are both super long, it will break into a new line even before clicking on 'more'
 */
import ActionListItem from "src/shared/atoms/ActionListItem.svelte";
export let actions: {
  icon: string;
  title: string;
  colorClass: string;
  action: () => void;
}[];

let showMore = false;

function handleClick(action) {
  if (action.event) {
    window.o.publishEvent(action.event);
  }
  if (action.action) {
    action.action();
  }
}

let moreItems = actions.length > 2 ? actions.splice(2) : undefined;
</script>

{#if actions}
  <div class="flex flex-row flex-wrap items-stretch mt-2 -mr-2 text-dark">
    {#if showMore}
      {#each moreItems as action}
        <ActionListItem
          icon="{action.icon}"
          title="{action.title}"
          colorClass="{action.colorClass}"
          small="{true}"
          on:click="{() => handleClick(action)}" />
      {/each}
    {/if}
  </div>
  <div class="flex flex-row flex-wrap items-stretch -mr-2 text-dark">
    {#if moreItems}
      <div on:click="{() => (showMore = !showMore)}">
        <ActionListItem
          icon="{showMore ? 'morevertical' : 'more'}"
          title=""
          small="{true}" />
      </div>
    {/if}
    {#each actions as action}
      <ActionListItem
        icon="{action.icon}"
        title="{action.title}"
        colorClass="{action.colorClass}"
        on:click="{() => handleClick(action)}"
        small="{true}" />
    {/each}
  </div>
{/if}
