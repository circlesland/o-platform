<script lang="ts">
import Icon from "@krowten/svelte-heroicons/Icon.svelte";

/*
 * Edge Case: if the very first items are both super long, it will break into a new line even before clicking on 'more'
 */
import ActionListItem from "src/shared/atoms/ActionListItem.svelte";
import { Environment } from "../environment";
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
  <div class="flex flex-row flex-wrap items-stretch justify-around mt-2 -mr-2 text-dark">
    <!-- <ul class="inline-block space-x-8 align-top list-none"> -->
    {#each actions as action}
      <ActionListItem
        icon="{action.icon}"
        title="{action.title}"
        colorClass="{action.colorClass}"
        on:click="{() => handleClick(action)}" />
    {/each}
    <!-- </ul> -->
    {#if Environment.showLanguageSwitcher}
      <div
        class="text-center align-top list-none cursor-pointer inline-table"
        on:click="{() => dispatch('siwtchEvent')}">
        <span>
          <span class="table-cell w-12 h-12 align-middle rounded-full bg-light-light">
            <Icon solid="{true}" name="switch-horizontal" class="inline w-6 h-6 heroicon " />
          </span>

          <span class="block w-24 mt-1 text-xs text-center break-normal sm:text-sm ">Change Language</span>
        </span>
      </div>
    {/if}
  </div>
{/if}

<!-- {#if actions}
  <div class="flex flex-row flex-wrap items-stretch mt-2 -mr-2 text-dark">
    {#if showMore}
      {#each moreItems as action}
        <ActionListItem
          icon="{action.icon}"
          title="{action.title}"
          colorClass="{action.colorClass}"
          on:click="{() => handleClick(action)}" />
      {/each}
    {/if}
  </div>
  <div class="flex flex-row flex-wrap items-stretch -mr-2 text-dark">
    {#if moreItems}
      <div on:click="{() => (showMore = !showMore)}">
        <ActionListItem icon="{showMore ? 'morevertical' : 'more'}" title="" />
      </div>
    {/if}

    {#each actions as action}
      <ActionListItem
        icon="{action.icon}"
        title="{action.title}"
        colorClass="{action.colorClass}"
        on:click="{() => handleClick(action)}" />
    {/each}
  </div>
{/if} -->
