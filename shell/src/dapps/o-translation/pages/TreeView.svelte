<script lang="ts">
import { onMount } from "svelte";
import {
CreateNewStringAndKeyDocument,
  GetAllStringsByMaxVersionDocument,
  GetAllStringsByMaxVersionQuery,
  I18n,
MutationCreateNewStringAndKeyArgs,
} from "../../../shared/api/data/types";
import { ApiClient } from "../../../shared/apiConnection";
import LangSwitcher from "../../../shared/atoms/LangSwitcher.svelte";
import { Environment } from "../../../shared/environment";
import Tree from "../atoms/Tree.svelte";
import { CTreeNode, StateSnapshot } from "../classes/treenode";

let displayedTree: CTreeNode = new CTreeNode("root");
let keyFilter: string = "";
let valueFilter: string = "";
let snapshot: StateSnapshot;
let allLanguages: string[] = [];
let languageList: string[] = [];
let createNewStringMode: boolean = false;
let keyToCreate: string;
let stringToCreate: string;

async function createTree(rootData: I18n[]): Promise<CTreeNode> {
  let cTreenode = new CTreeNode("root");
  for (const row of rootData) {
    cTreenode.add(row.key, row);
  }
  return cTreenode;
}

onMount(async () => {
  languageList.push(Environment.userLanguage);
  await refreshView();
});

async function filterItems(keyFilter: string, valueFilter: string, i18nData: I18n[]) {
  const filteredByKey = i18nData.filter((item) => item.key.includes(keyFilter));
  const filteredByValue = filteredByKey.filter((item) =>
    item.value.toLowerCase().startsWith(valueFilter.toLocaleLowerCase())
  );
  return filteredByValue;
}

async function refreshView() {
  const queryResult = await ApiClient.query<I18n[], GetAllStringsByMaxVersionQuery>(
    GetAllStringsByMaxVersionDocument,
    {}
  );
  const allLanguageKeysInQueryResult = queryResult.toLookup((o) => o.lang);
  allLanguages = Object.keys(allLanguageKeysInQueryResult);
  allLanguages.sort((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });
  const filteredQueryResult = queryResult.filter((o) => isSelected(o.lang));
  sortByKey(filteredQueryResult);
  let filteredI18nData = await filterItems(keyFilter, valueFilter, filteredQueryResult);

  displayedTree = await createTree(filteredI18nData);

  if (!snapshot && !(keyFilter.trim() != "" || valueFilter.trim() != "") && displayedTree) {
    snapshot = displayedTree.createStateSnapshot();
  } else {
    displayedTree.restoreStateSnapshot(snapshot);
  }
  console.log("refreshed");
}

$: {
  refreshView();
}

const toggleLanguage = async (data: string) => {
  if (languageList.includes(data)) {
    const index = languageList.indexOf(data);
    if (index > -1) {
      languageList.splice(index, 1);
    }
  } else {
    languageList.push(data);
  }
};

function sortByKey(dataToSort: I18n[]) {
  dataToSort.sort((a, b) => {
    if (a.key < b.key) {
      return -1;
    }
    if (a.key > b.key) {
      return 1;
    }
    return 0;
  });
  return dataToSort;
}

function isSelected(languageCode: string) {
  return languageList.indexOf(languageCode) > -1;
}


async function writeNewKeyToDb(lang: string, key: string, version: number, value: string) {
  return await ApiClient.query<I18n, MutationCreateNewStringAndKeyArgs>(CreateNewStringAndKeyDocument, {
    lang: lang,
    key: key,
    version: version,
    value: value
  })
}
</script>

<section class="relative mb-20 bg-white shadow rounded md:w-2/3 xl:w-1/2">
  <div class="flex grow justify-center mt-3">
    <form on:input="{() => refreshView()}" class="justify-start">
      <input bind:value="{keyFilter}" class="input m-1" type="text" placeholder="dapps.o-banking..." />
    </form>
    <form on:input="{() => refreshView()}" class="justify-end">
      <input bind:value="{valueFilter}" class="input m-1" type="text" placeholder="String" />
    </form>
    <button
      class="bg-blue-200 rounded-lg m-1 p-1 hover:bg-blue-500"
      on:click="{() => {
        createNewStringMode = true;
      }}">
      create new string
    </button>
  </div>

  {#if createNewStringMode}
    <div class="flex grow justify-center">
      <form class="justify-start">
        <input bind:value="{keyToCreate}" class="input m-1" type="text" placeholder="key goes here" />
      </form>
      <form class="justify-start">
        <input bind:value="{stringToCreate}" class="input m-1" type="text" placeholder="string goes here" />
      </form>
      <button
        class="bg-blue-200 rounded-lg m-1 p-1 hover:bg-blue-500"
        on:click="{async () => {
          await writeNewKeyToDb(Environment.userLanguage, keyToCreate, 1, stringToCreate);
          refreshView();
        }}">create</button>
      <button
        class="bg-red-200 rounded-lg m-1 p-1 hover:bg-red-500"
        on:click="{() => {
          createNewStringMode = false;
        }}">
        cancel
      </button>
    </div>
  {/if}
  <!--<div class="flex justify-center m-3">
      <LangSwitcher />
    </div>-->
  <!--<div class="flex justify-center">
    {#each allLanguages as languageCode}
      <button
        on:click="{() => {
          toggleLanguage(languageCode);
          refreshView();
        }}"
        class="p-1 m-1 bg-blue-200 hover:bg-blue-500 rounded"
        class:bg-red-200="{isSelected(languageCode)}">
        {languageCode}
      </button>
    {/each}
  </div>-->

  <div class="mr-3 ml-3">
    <Tree
      rootNode="{displayedTree}"
      on:expand="{(event) => {
        let partialSnapshot = event.detail.newSnapshot;
        for (let property in partialSnapshot) {
          snapshot[property] = partialSnapshot[property];
        }
      }}" />
  </div>
</section>
