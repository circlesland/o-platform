<script lang="ts">
import { onMount } from "svelte";

import {
  GetAllStringsByMaxVersionDocument,
  GetAllStringsByMaxVersionQuery,
  I18n,
} from "../../../shared/api/data/types";

import { ApiClient } from "../../../shared/apiConnection";
import StringEditor from "../atoms/StringEditor.svelte";
import { Environment } from "../../../shared/environment";
import { createEventDispatcher } from "svelte";

let keyFilter: string = "";
let valueFilter: string = "";
let allLanguages: string[] = [];
let languageList: string[] = [];

const dispatch = createEventDispatcher();


export let searchKey: string = "";
export let i18nData: I18n[] = [];

let items: I18n[] = i18nData;

let filteredItems: I18n[] = [];

async function getAllLanguages() {
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
}


function isSelected(languageCode: string) {
  return languageList.indexOf(languageCode) > -1;
}

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

async function reload() {

  items = i18nData;

  console.log(i18nData, "momomomo")

  console.log("reloaded", items);
}

$: {
  reload();
  filterItems(searchKey, valueFilter)
  items
  i18nData
  filteredItems
}

onMount(async () => {
  languageList.push(Environment.userLanguage);
  reload();

  getAllLanguages();
});

function filterItems(keyFilter: string, valueFilter: string) {
  const filteredByKey = items.filter((item) => item.key.includes(keyFilter));
  const filteredByValue = filteredByKey.filter((item) =>
    item.value.toLowerCase().startsWith(valueFilter.toLocaleLowerCase())
  );
  console.log(filteredByValue);
  filteredItems = filteredByValue;
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
</script>

<section class="flex flex-col items-center justify-center p-6">
  <div class="w-full flex flex-row flex-wrap items-stretch justify-center">
    <form
      on:input="{() => {
        filterItems(searchKey, valueFilter);
        dispatch('stringSearch', { searchString: valueFilter });
      }}">
      <input bind:value="{valueFilter}" class="input m-1" type="text" placeholder="String" />
    </form>
    {#each allLanguages as languageCode}
      <button
        on:click="{() => {
          toggleLanguage(languageCode);
          reload();
        }}"
        class="p-1 m-1 bg-blue-200 hover:bg-blue-500"
        class:bg-red-200="{isSelected(languageCode)}">
        {languageCode}
      </button>
    {/each}
  </div>

  <div class="table">
    <div class="table-header-group">
      <div class="table-cell p-1">String</div>
      <div class="table-cell p-1">Key</div>
      <div class="table-cell p-1">Language</div>
      <div class="table-cell p-1">Version</div>
      <div class="table-cell p-1">Input</div>
    </div>
    {#each filteredItems as data (data.key + data.lang + data.version)}
      <div class="w-full table-row-group string">
        <StringEditor
          on:save="{() => reload()}"
          on:searchKey="{(e) => filterItems(e.detail.keyLink, valueFilter)}"
          dataString="{data.value}"
          dataKey="{data.key}"
          dataLang="{data.lang}"
          dataVersion="{data.version}" />
      </div>
    {/each}
  </div>
</section>
