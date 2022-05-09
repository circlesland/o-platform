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

async function createTree(rootData: I18n[]): Promise<CTreeNode> {
  let cTreenode = new CTreeNode("root");
  let currentNode: CTreeNode = cTreenode;
  for (const row of rootData) {
    currentNode = cTreenode.add(row.key, row);
    let keyParts = row.key.split(".");
    for (let i = 0; i < keyParts.length; i++) {
      let keyPart = keyParts[i];
      if (currentNode.findChildByKey(keyPart)) {
        currentNode = currentNode.findChildByKey(keyPart);
      } else {
        currentNode = currentNode.add(keyPart, row);
      }
    }
  }

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
  displayedTree = await createTree(filteredI18nData);
}

let keyFilter: string = "";
let valueFilter: string = "";
</script>

<section>
  <form on:input="{() => refreshView()}">
    <input bind:value="{keyFilter}" class="input m-1" type="text" placeholder="dapps.o-banking..." />
  </form>
  <form on:input="{() => refreshView()}">
    <input bind:value="{valueFilter}" class="input m-1" type="text" placeholder="String" />
  </form>
  <Tree rootNode="{displayedTree}" />
</section>
