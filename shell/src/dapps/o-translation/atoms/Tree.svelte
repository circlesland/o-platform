<script lang="ts">
import { createEventDispatcher } from "svelte";

import { CTreeNode, StateSnapshot } from "../classes/treenode";

import StringEditor from "./StringEditor.svelte";

export let rootNode: CTreeNode;

let dispatch = createEventDispatcher();
let snapshot: StateSnapshot = {};
let expand: boolean = false;

function toggleExpand() {
  expand = !expand;
}
</script>

<span
  on:click="{() => {
    toggleExpand();

    rootNode.toggleExpanded();

    snapshot[rootNode.snapId] = rootNode.expandState;
    rootNode = rootNode;
    dispatch('expand', {
      newSnapshot: snapshot,
      nodeToUpdate: rootNode,
    });
  }}">
  {rootNode.key}
  {#if expand}
    <span>-</span>
  {:else}
    <span>+</span>
  {/if}
</span>

{#if rootNode.isExpanded}
  {#if rootNode}
    {#each rootNode.children as childNode}
      <ul class="ml-2 mb-4">
        {#if childNode.isLeaf}
          {#each childNode.values as item}
            <StringEditor
              dataString="{item.value}"
              dataKey="{item.key}"
              dataLang="{item.lang}"
              dataVersion="{item.version}" />
          {/each}
        {:else}
          <svelte:self rootNode="{childNode}" on:expand />
        {/if}
      </ul>
    {/each}
  {/if}
{/if}
