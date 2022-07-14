<script lang="ts">

import { createEventDispatcher } from "svelte";
import Account from "../../o-passport/pages/Account.svelte";

import { CTreeNode, StateSnapshot } from "../classes/treenode";

import StringEditor from "./StringEditor.svelte";

export let rootNode: CTreeNode;

let dispatch = createEventDispatcher();
let snapshot: StateSnapshot = {};
let expand: boolean;


</script>

<div class="ml-4 mb-4">
  <span
    on:click="{() => {
      rootNode.toggleExpanded();
      expand = rootNode.expandState;
      snapshot[rootNode.snapId] = rootNode.expandState;
      rootNode = rootNode;
      dispatch('expand', {
        newSnapshot: snapshot,
        nodeToUpdate: rootNode,
      });
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


          <p class="ml-4 mb-4 flex-wrap">{item.key}</p>
            <!--<StringEditor
              dataString="{item.value}"
              dataKey="{item.key}"
              dataLang="{item.lang}"
              dataVersion="{item.version}" />-->
          {/each}
        {:else}
          <svelte:self rootNode="{childNode}" on:expand />
        {/if}
      </ul>
    {/each}
  {/if}
{/if}

