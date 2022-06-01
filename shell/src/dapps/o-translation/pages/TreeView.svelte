<script lang="ts">
import { onMount } from "svelte";
import {
  GetAllStringsByMaxVersionDocument,
  GetAllStringsByMaxVersionQuery,
  I18n,
} from "../../../shared/api/data/types";
import { ApiClient } from "../../../shared/apiConnection";
import Tree from "../atoms/Tree.svelte";
import { CTreeNode, StateSnapshot } from "../classes/treenode";

let fullI18nData: I18n[] = [];
let displayedTree: CTreeNode = new CTreeNode("root");
let keyFilter: string = "";
let valueFilter: string = "";
let completeTree;
let snapshot: StateSnapshot;

async function createTree(rootData: I18n[]): Promise<CTreeNode> {
  let cTreenode = new CTreeNode("root");
  for (const row of rootData) {
    cTreenode.add(row.key, row);
  }
  console.log(cTreenode);
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
  return filteredByValue;
}

async function refreshView() {
  let filteredI18nData = await filterItems(keyFilter, valueFilter, fullI18nData);

  displayedTree = await createTree(filteredI18nData);

  if (!snapshot && !(keyFilter.trim() != "" || valueFilter.trim() != "") && displayedTree) {
    snapshot = displayedTree.createStateSnapshot();
  } else {
    displayedTree.restoreStateSnapshot(snapshot);
  }
}

</script>

<section>
  <form on:input="{() => refreshView()}">
    <input bind:value="{keyFilter}" class="input m-1" type="text" placeholder="dapps.o-banking..." />
  </form>
  <form on:input="{() => refreshView()}">
    <input bind:value="{valueFilter}" class="input m-1" type="text" placeholder="String" />
  </form>
  <Tree
    rootNode="{displayedTree}"
    on:expand="{(event) => {
      let partialSnapshot = event.detail.newSnapshot;
      for (let property in partialSnapshot) {
        snapshot[property] = partialSnapshot[property];
      } 
    }}" />
</section>
