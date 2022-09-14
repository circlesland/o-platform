<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import TreeView from "./TreeView.svelte";
import EditorView from "./EditorView.svelte";
import { GetAllStringsByMaxVersionAndLangDocument, GetAllStringsByMaxVersionAndLangQuery, GetPaginatedStringsDocument, I18n, QueryGetPaginatedStringsArgs } from "../../../shared/api/data/types";
import { onMount } from "svelte";
import { ApiClient } from "../../../shared/apiConnection";
import { Environment } from "../../../shared/environment";
import { CTreeNode } from "../classes/treenode";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let keyFilter: string = "";
let stringFilter: string = "";
let i18nData: I18n[] = [];
let pagination_key: string = "";
let userLanguage = Environment.userLanguage;
let searchValue: string = "";
let treeData: I18n[] = [];
let displayedTree: CTreeNode;
let snapshot = {};

onMount(async () => {
  getPaginatedStrings(pagination_key, keyFilter, userLanguage, searchValue);
  await getTreeData(userLanguage)
  displayedTree = await createTree(treeData)
  displayedTree.restoreStateSnapshot({ root: true })
});

$: {
  i18nData;
  treeData;
  displayedTree;
  userLanguage;
}

async function getPaginatedStrings(pagination_key: string, searchKey: string, lang: string, searchString: string) {
  let queryResult = await ApiClient.query<I18n[], QueryGetPaginatedStringsArgs>(GetPaginatedStringsDocument, {
    key: searchKey,
    pagination_key: pagination_key,
    lang: lang,
    value: searchString,
  });
  i18nData = i18nData.concat(queryResult);
}


async function getTreeData(userLanguage: string) {
  const queryResult = await ApiClient.query<I18n[], GetAllStringsByMaxVersionAndLangQuery>(
    GetAllStringsByMaxVersionAndLangDocument,
    {
      lang: userLanguage
    }
  );
  treeData = queryResult
  return queryResult
}

async function createTree(rootData: I18n[]): Promise<CTreeNode> {
  let cTreenode = new CTreeNode("root");
  for (const row of rootData) {
    cTreenode.add(row.key, row);
  }
  return cTreenode;
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<section class="p-6 inline-grid grid-cols-4 w-full min-h-[85vh] mb-[10vh]">
  <div class="h-full bg-blue-900 bg-opacity-50 col-span-1">
    <TreeView
      searchString="{stringFilter}"
      language="{userLanguage}"
      displayedTree="{displayedTree}"
      on:showStrings="{(event) => {
        if (
          !keyFilter.split('.').includes(event.detail.searchKey.split('.')[0]) ||
          keyFilter !== event.detail.searchKey
        ) {
          i18nData = [];
        }
        keyFilter = event.detail.searchKey;
        i18nData = [];
        getPaginatedStrings('', keyFilter, userLanguage, '');
      }}"
      on:keySearch="{(event) => {
        i18nData = [];
        keyFilter = event.detail.keyFilter;
        getPaginatedStrings('', event.detail.keyFilter, userLanguage, '');
      }}" />
  </div>
  <div class="col-span-3 bg-gray-200 rounded">
    <EditorView
      i18nData="{i18nData}"
      searchKey="{keyFilter}"
      on:newString="{() => {
        getPaginatedStrings('', '', userLanguage, '');
      }}"
      on:toggleLanguage="{async (event) => {
        i18nData = [];
        userLanguage = event.detail.languageCode;
        getPaginatedStrings('', keyFilter, userLanguage, '');
        snapshot = displayedTree.createStateSnapshot();
        treeData = []
        displayedTree = await createTree(treeData);
        treeData = await getTreeData(userLanguage);
        displayedTree = await createTree(treeData);
        displayedTree.restoreStateSnapshot(snapshot)
        console.log(treeData)
      }}"
      on:stringSearch="{(event) => {
        i18nData = [];
        searchValue = event.detail.searchString;
        getPaginatedStrings('', '', userLanguage, searchValue);
      }}"
      on:loadMoreStrings="{() => {
        pagination_key = i18nData[i18nData.length - 1].pagination_key;
        getPaginatedStrings(pagination_key, keyFilter, userLanguage, searchValue);
      }}" />
  </div>
</section>
