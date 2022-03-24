<script lang="ts">
/*
 * Edge Case: if the very first items are both super long, it will break into a new line even before clicking on 'more'
 */
import ActionListItem from "src/shared/atoms/ActionListItem.svelte";
import {me} from "../stores/me";

export let actions: {
  icon: string;
  title: string;
  colorClass: string;
  action: () => void;
}[];

// let showMore = false;
// let moreItems = undefined;

function handleClick(action) {
  if (action.event) {
    window.o.publishEvent(action.event);
  }
  if (action.action) {
    action.action();
  }
}

$: {
  // moreItems = actions && actions.length > 2 ? actions.splice(2) : undefined;
}
</script>

{#if actions}
  <div
    class="flex flex-row flex-wrap items-stretch justify-around mt-2 -mr-2 text-dark">
    {#each actions as action}
      {#if action.key === $me.circlesAddress}
        [<ActionListItem
          icon="{action.icon}"
          title="{action.title}"
          colorClass="{action.colorClass}"
          on:click="{() => handleClick(action)}" />]
        {:else}
        <ActionListItem
                icon="{action.icon}"
                title="{action.title}"
                colorClass="{action.colorClass}"
                on:click="{() => handleClick(action)}" />
      {/if}
    {/each}
  </div>
{/if}