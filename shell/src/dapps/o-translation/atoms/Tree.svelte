<script lang="ts">
import { createEventDispatcher } from "svelte";

import { CTreeNode, StateSnapshot } from "../classes/treenode";

export let rootNode: CTreeNode;

let dispatch = createEventDispatcher();
let snapshot: StateSnapshot = {};
let expand: boolean;
let searchKey: String = "";

$: {
  searchKey;
}
</script>

<div class="ml-4 mb-4">
  <span class="flex items-center">
    <div
      on:click="{() => {
        rootNode.toggleExpanded();
        snapshot[rootNode.snapId] = rootNode.expandState;
        rootNode = rootNode;
        dispatch('expand', {
          newSnapshot: snapshot,
          nodeToUpdate: rootNode,
        });
      }}">
      {#if !rootNode.values.length}
        {#if rootNode.expandState}
          <span class="flex items-center hover:cursor-pointer"
            ><svg class="mr-5" width="15" height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"
              ><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
                fill="white"
                d="M352 352c-8.188 0-16.38-3.125-22.62-9.375L192 205.3l-137.4 137.4c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25C368.4 348.9 360.2 352 352 352z"
              ></path
              ></svg>
          </span>
        {:else}
          <span class="flex items-center hover:cursor-pointer"
            ><svg clasS="mr-5" width="15" height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"
              ><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
                fill="white"
                d="M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z"
              ></path
              ></svg>
          </span>
        {/if}
      {/if}
    </div>
    <p
      class="hover:bg-blue-500 hover:rounded hover:cursor-pointer"
      on:click="{() => {
        searchKey = rootNode.snapId.replace('root.', '');
        if (searchKey == 'root') {
          searchKey = '';
        }
        dispatch('showStrings', {
          searchKey: searchKey,
        });
      }}">
      {rootNode.key}
    </p>
  </span>
</div>

{#if rootNode.expandState}
  {#if rootNode}
    {#each rootNode.children as childNode}
      <ul class="ml-4 mb-4">
        {#if !childNode.isLeaf}
          <svelte:self rootNode="{childNode}" on:expand on:showStrings />
        {/if}
      </ul>
    {/each}
  {/if}
{/if}
