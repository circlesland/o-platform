<script lang="ts">
import { onMount } from "svelte";
import {
  CreateNewStringAndKeyDocument,
  EventsDocument,
  GetAllStringsByMaxVersionDocument,
  GetAllStringsByMaxVersionQuery,
  GetAvailableLanguagesDocument,
  GetAvailableLanguagesQuery,
  GetStringsByMaxVersionKeyAndValueDocument,
  I18n,
  MutationCreateNewStringAndKeyArgs,
  QueryGetStringsByMaxVersionKeyAndValueArgs,
} from "../../../shared/api/data/types";
import { ApiClient } from "../../../shared/apiConnection";
import LangSwitcher from "../../../shared/atoms/LangSwitcher.svelte";
import { Environment } from "../../../shared/environment";
import Tree from "../atoms/Tree.svelte";
import { CTreeNode, StateSnapshot } from "../classes/treenode";
import { createEventDispatcher } from "svelte";

let displayedTree: CTreeNode = new CTreeNode("root");
let keyFilter: string = "";
let valueFilter: string = "";
let snapshot: StateSnapshot;
let allLanguages: string[] = [];
let languageList: string[] = [];
let createNewStringMode: boolean = false;
let keyToCreate: string;
let stringToCreate: string;
let availableLanguages = [];
let filteredI18nData: I18n[] = [];
let fullI18nData: I18n[] = [];
let displayedI18nData: I18n[] = [];

let disabled: boolean = true;

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
  languageList.push(Environment.userLanguage);
  await refreshView();
  const i18nResult = await ApiClient.query<I18n[], GetAvailableLanguagesQuery>(GetAvailableLanguagesDocument, {});
  availableLanguages = i18nResult;
  availableLanguages.sort((a, b) => {
    if (a.lang < b.lang) {
      return -1;
    }
    if (a.lang > b.lang) {
      return 1;
    }
    return 0;
  });
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
  fullI18nData = queryResult;
  const filteredQueryResult = queryResult.filter((o) => isSelected(o.lang));
  sortByKey(filteredQueryResult);
  filteredI18nData = await filterItems(keyFilter, searchString, filteredQueryResult);

  displayedTree = await createTree(filteredI18nData);

  if (!snapshot && !(keyFilter.trim() != "" || searchString.trim() != "") && displayedTree) {
    snapshot = displayedTree.createStateSnapshot();
  } else {
    displayedTree.restoreStateSnapshot(snapshot);
  }
  console.log("refreshed");
}

$: {
  refreshView();
  searchString;
  //filteredI18nData
  getFilteredI18nDataFromDb(keyFilter, searchString);
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
    value: value,
  });
}

async function getFilteredI18nDataFromDb(searchKey: string, valueFilter: string) {
  displayedI18nData = await ApiClient.query<I18n[], QueryGetStringsByMaxVersionKeyAndValueArgs>(
    GetStringsByMaxVersionKeyAndValueDocument,
    {
      key: searchKey,
      value: valueFilter + "%",
    }
  );
}
</script>

<section class="text-white p-6">
  <!--{#if !createNewStringMode}
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
  {/if}-->

  <!--{#if createNewStringMode}
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
          console.log(availableLanguages)
          for (let i = 0; i < availableLanguages.length; i++) {
            console.log(availableLanguages)
            await writeNewKeyToDb(availableLanguages[i].lang, keyToCreate, 1, stringToCreate);
          }
          createNewStringMode = false;
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
  {/if}-->
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

  <form
    class="flex grow justify-center"
    on:submit|preventDefault="{() => {
      refreshView();
      getFilteredI18nDataFromDb(keyFilter, searchString);
      dispatch('keySearch', { keyFilter: keyFilter, i18nData: displayedI18nData });
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
    <Tree
      rootNode="{displayedTree}"
      on:showStrings
      on:expand
      on:expand="{(event) => {
        let partialSnapshot = event.detail.newSnapshot;

        for (let property in partialSnapshot) {
          snapshot[property] = partialSnapshot[property];
        }
      }}" />
  </div>
</section>
