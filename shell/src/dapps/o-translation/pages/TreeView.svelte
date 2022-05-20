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

let fullI18nData: I18n[] = [];
let displayedTree: CTreeNode = new CTreeNode("root");
let keyFilter: string = "";
let valueFilter: string = "";
let completeTree;
let snapshot = [];

async function createTree(rootData: I18n[]): Promise<CTreeNode> {
  let cTreenode = new CTreeNode("root");
  for (const row of rootData) {
    cTreenode.add(row.key, row);
    if(snapshot.length) {
      cTreenode.restoreStateSnapshot(snapshot);
    }
  }
  console.log(cTreenode)
  return cTreenode;
}

onMount(async () => {
  fullI18nData = await getI18nData();
  await refreshView();
});

async function getI18nData(): Promise<I18n[]> {
  return await ApiClient.query<I18n[], GetAllStringsByMaxVersionQuery>(GetAllStringsByMaxVersionDocument, {});
}

async function filterItems(keyFilter: string, valueFilter: string, i18nData: I18n[]) {
  const filteredByKey = i18nData.filter((item) => item.key.includes(keyFilter));
  const filteredByValue = filteredByKey.filter((item) =>
    item.value.toLowerCase().startsWith(valueFilter.toLocaleLowerCase())
  );
  console.log("filtered", filteredByValue);
  return filteredByValue;
}

async function refreshView() {
  let filteredI18nData = await filterItems(keyFilter, valueFilter, fullI18nData);
  let snapshot = displayedTree.createStateSnapshot();

  displayedTree = await createTree(filteredI18nData);
  displayedTree.restoreStateSnapshot(snapshot);
  console.log("snapshot", snapshot)
}

async function logTree() {
  let data = await getI18nData();
  completeTree = await createTree(data);

  console.log(completeTree);

  loppOverChildren(completeTree);

  function loppOverChildren(tree) {
    if (tree._children.length == 0) {
      console.log(tree._key);
      console.log(tree._values[0].key)
    } else {
      for (let i = 0; i < tree._children.length; i++) {
        console.log(tree._key);
        loppOverChildren(tree._children[i]);
      }
    }
  }
}

//logTree();
</script>

<section>
  <form on:input="{() => refreshView()}">
    <input bind:value="{keyFilter}" class="input m-1" type="text" placeholder="dapps.o-banking..." />
  </form>
  <form on:input="{() => refreshView()}">
    <input bind:value="{valueFilter}" class="input m-1" type="text" placeholder="String" />
  </form>
  <Tree rootNode="{displayedTree}" on:expand={() => {snapshot = displayedTree.createStateSnapshot()}}/>
</section>
