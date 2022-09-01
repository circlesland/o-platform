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
let stringsAmount: number;

const dispatch = createEventDispatcher();

export let searchKey: string = "";
export let i18nData: I18n[] = [];

let nextData: I18n[] = [];

let items: I18n[] = i18nData;

let filteredItems: I18n[] = [];

let offset: number = 0;

let filteredI18nData: I18n[] = [];

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
  i18nData = i18nData.concat(nextData);
  items = i18nData;
  console.log("new i18ndata", i18nData);
  filteredI18nData = i18nData.filter((o) => isSelected(o.lang))
  console.log("filtered i18ndata", filteredI18nData)
}

$: {
  i18nData;
  filteredItems;

  stringsAmount;
  nextData;
  searchKey;
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
  //i18nData = i18nData.filter((o) => isSelected(o.lang))
};

</script>

<!--<form
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
  </form>-->

<section class="flex flex-col items-center justify-center p-6">
  <div class="w-full flex flex-row flex-wrap items-stretch justify-center">
    <form
      on:submit|preventDefault="{() => {
        dispatch('stringSearch', { searchString: valueFilter });
      }}">
      <input bind:value="{valueFilter}" class="input rounded-r-none" type="text" placeholder="String" />
    </form>
    {#if valueFilter == ""}
      <button class="btn-primary btn-disabled btn-md rounded-btn rounded-l-none bg-gray-400 text-white">
        search
      </button>
    {:else}
      <button class="btn-primary btn-md rounded-btn rounded-l-none">search</button>
    {/if}
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

  {#each i18nData as data (data.key + data.lang + data.version)}
    <div class="w-full">
      <StringEditor
        on:save="{() => reload()}"
        dataString="{data.value}"
        dataKey="{data.key}"
        dataLang="{data.lang}"
        dataVersion="{data.version}" />
    </div>
  {/each}
  <button
    class="btn-primary rounded-btn"
    on:click="{async () => {
      dispatch('loadMoreStrings');
    }}">
    load more
  </button>
</section>
