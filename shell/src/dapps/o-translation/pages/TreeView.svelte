<script lang="ts">
import { onMount } from "svelte";
import {
  GetAllStringsByMaxVersionDocument,
  GetAllStringsByMaxVersionQuery,
  I18n,
} from "../../../shared/api/data/types";
import { ApiClient } from "../../../shared/apiConnection";
import Tree from "../atoms/Tree.svelte";
import { CTreeNode } from "../classes/treenode";
import { createEventDispatcher } from "svelte";

let displayedTree: CTreeNode = new CTreeNode("root");
let keyFilter: string = "";

let fullI18nData: I18n[] = [];
let displayedI18nData: I18n[] = [];

let dispatch = createEventDispatcher();

export let searchString: string = "";

async function createTree(rootData: I18n[]): Promise<CTreeNode> {
  let cTreenode = new CTreeNode("root");
  for (const row of rootData) {
    cTreenode.add(row.key, row);
  }
  return cTreenode;
}

onMount(async () => {
  await refreshView();
});

async function refreshView() {
  const queryResult = await ApiClient.query<I18n[], GetAllStringsByMaxVersionQuery>(
    GetAllStringsByMaxVersionDocument,
    {}
  );
  fullI18nData = queryResult;

  displayedTree = await createTree(fullI18nData);

  displayedTree.restoreStateSnapshot({ root: true });
}

$: {
  searchString;
}
</script>

<section class="text-white p-6">
  <form
    class="flex grow justify-center"
    on:submit|preventDefault="{() => {
      dispatch('keySearch', { keyFilter: keyFilter, i18nData: displayedI18nData });
      keyFilter = '';
    }}">
    <input bind:value="{keyFilter}" class="input rounded-r-none" type="text" placeholder="dapps.o-banking..." />
    {#if keyFilter == ""}
      <button class="btn-primary btn-disabled btn-md rounded-btn rounded-l-none bg-gray-400 text-white">
        search
      </button>
    {:else}
      <button class="btn-primary btn-md rounded-btn rounded-l-none">search</button>
    {/if}
  </form>

  <div class="mr-3 ml-3 mt-3">
    <Tree rootNode="{displayedTree}" on:showStrings />
  </div>
</section>
