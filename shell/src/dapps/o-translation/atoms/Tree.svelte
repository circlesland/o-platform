<script lang="ts">
import { createEventDispatcher } from "svelte";
import { I18n } from "../../../shared/api/data/types";

import { CTreeNode, StateSnapshot } from "../classes/treenode";

export let rootNode: CTreeNode;

let dispatch = createEventDispatcher();
let snapshot: StateSnapshot = {};
let expand: boolean;

let displayedI18nData: I18n[] = [];

function findStringsToDisplay(root: CTreeNode) {
  if (root.snapId == "root.common") {
    root.children.forEach((child) => {
      if (child.isLeaf && root.isExpanded) {
        displayedI18nData = displayedI18nData.concat(child.values);
      }
      if (child.isLeaf && !root.isExpanded) {
        displayedI18nData = [];
      }
      dispatch("display", {
        displayedI18nData: displayedI18nData,
      });
    });
  }
  if (root.snapId == {root}.toString()) {
    console.log("dapp:", {root}.toString())
  }
}
</script>

<div class="ml-4 mb-4">
  <span
    on:click="{() => {
      console.log('parent', rootNode.parent);

      rootNode.toggleExpanded();
      expand = rootNode.expandState;
      snapshot[rootNode.snapId] = rootNode.expandState;
      rootNode = rootNode;

      dispatch('expand', {
        newSnapshot: snapshot,
        nodeToUpdate: rootNode,
      });

      if (rootNode.parent) {
        findStringsToDisplay(rootNode);
      }

      console.log(snapshot);

      console.log('i18ndata', displayedI18nData);
    }}">
    <div class="hover:cursor-pointer">
      {#if expand}
        <span>-</span>
      {:else}
        <span>+</span>
      {/if}
      {rootNode.key}
    </div>
  </span>
</div>

{#if rootNode.expandState}
  {#if rootNode}
    {#each rootNode.children as childNode}
      <ul class="ml-4 mb-4">
        {#if childNode.isLeaf}
          {#each childNode.values as item}
            <p>{item.key}</p>
          {/each}
        {:else}
          <svelte:self rootNode="{childNode}" on:expand on:display />
        {/if}
      </ul>
    {/each}
  {/if}
{/if}
