<script lang="ts">
import { CTreeNode } from "../classes/treenode";

import StringEditor from "./StringEditor.svelte";

import { createEventDispatcher } from "svelte";

export let rootNode: CTreeNode;

let dispatch = createEventDispatcher();
let snapshot = [];
</script>

<span
  on:click="{() => {
    rootNode.toggleExpanded();
    rootNode = rootNode;
    snapshot = rootNode.createStateSnapshot()
    dispatch("expand", {snapshot});
  }}">
  {rootNode.key}
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
          <svelte:self rootNode="{childNode}" />
        {/if}
      </ul>
    {/each}
  {/if}
{/if}
