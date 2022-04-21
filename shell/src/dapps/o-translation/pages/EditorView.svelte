<script lang="ts">
import { onMount } from "svelte";

import {
  GetAllStringsByLanguageDocument,
  GetAllStringsDocument,
  GetAllStringsQuery,
  I18n,
  QueryGetAllStringsByLanguageArgs,
} from "../../../shared/api/data/types";

import { paginate, PaginationNav } from "svelte-paginate";

import { ApiClient } from "../../../shared/apiConnection";
import StringEditor from "../atoms/StringEditor.svelte";
import { Environment } from "../../../shared/environment";

let key: string;
let value: string;
let i18nData: I18n[] = [];
let allLanguages: string[] = [];
let selectedLanguage: string = Environment.userLanguage;
let languageList: string[] = [];

let items = i18nData;
let currentPage = 1;
let pageSize = 5;
$: paginatedItems = paginate({ items, pageSize, currentPage });

function sortByKey(dataToSort: I18n[]) {
  i18nData = dataToSort.sort((a, b) => {
    if (a.key < b.key) {
      return -1;
    }
    if (a.key > b.key) {
      return 1;
    }
    return 0;
  });
  return i18nData;
}

async function reload(selectedLanguage: string) {
  const queryResult = await ApiClient.query<I18n[], GetAllStringsQuery>(GetAllStringsDocument, {});
  const allLanguageKeysInQueryResult = queryResult.toLookup((o) => o.lang);
  allLanguages = Object.keys(allLanguageKeysInQueryResult);

  i18nData = queryResult.filter((o) => o.lang == selectedLanguage);

  sortByKey(i18nData);
}

$: {
  reload(selectedLanguage);
  languageList;
}

onMount(async () => {
  languageList.push(selectedLanguage);

  console.log("languagelist", languageList);
  for (let language of languageList) {
    const queryResult = await ApiClient.query<I18n[], QueryGetAllStringsByLanguageArgs>(
      GetAllStringsByLanguageDocument,
      {
        lang: language,
      }
    );
    sortByKey(queryResult);
  }

  reload(selectedLanguage);
  const queryResult = await ApiClient.query<I18n[], GetAllStringsQuery>(GetAllStringsDocument, {});

  const allLanguageKeysInQueryResult = queryResult.toLookup((o) => o.lang);
  allLanguages = Object.keys(allLanguageKeysInQueryResult);

  console.log("i18nData", i18nData);
  console.log("allLanguages", allLanguages);
  console.log("languageList", languageList);
  items = i18nData;
});

const stringSubmitHandler = (event) => {
  event.preventDefault();
  i18nData = i18nData.filter((item) => item.value.startsWith(value));
  console.log(i18nData);
};

const keySubmitHandler = (event) => {
  event.preventDefault();
  i18nData = i18nData.filter((item) => item.key.startsWith(key));
  console.log(i18nData);
};

const clickHandler = async (data: string) => {
  if (languageList.includes(data)) {
    const index = languageList.indexOf(data);
    if (index > -1) {
      languageList.splice(index, 1);
    }
    console.log(languageList);
  } else {
    languageList.push(data);
  }
  i18nData = [];
  for (let language of languageList) {
    const queryResult = await ApiClient.query<I18n[], QueryGetAllStringsByLanguageArgs>(
      GetAllStringsByLanguageDocument,
      {
        lang: language,
      }
    );
    console.log(queryResult);
    i18nData.push(...queryResult);
  }

  sortByKey(i18nData);

  console.log("newi18nData", i18nData);
};
</script>

<section class="flex flex-col items-center justify-center p-6">
  <div class="pagiNav">
    <PaginationNav
      totalItems="{items.length}"
      pageSize="{pageSize}"
      currentPage="{currentPage}"
      limit="{1}"
      showStepOptions="{true}"
      on:setPage="{(e) => (currentPage = e.detail.page)}" />
  </div>

  <div class="w-full flex flex-row flex-wrap items-stretch">
    <form on:submit="{stringSubmitHandler}">
      <input bind:value class="m-1" type="text" placeholder="String" />
    </form>
    <form on:submit="{keySubmitHandler}" class="">
      <input bind:value="{key}" class="m-1" type="text" placeholder="dapps.o-banking..." />
    </form>
    {#each allLanguages as languageCode}
      <button
        on:click="{() => clickHandler(languageCode)}"
        class="p-1 m-1 bg-blue-200 hover:bg-blue-500"
        class:bg-red-200="{true}">
        {languageCode}
      </button>
    {/each}

    <form on:change="{stringSubmitHandler}">
      <select bind:value="{selectedLanguage}" class="m-1">
        {#each allLanguages as lang}
          <option>{lang}</option>
        {/each}
      </select>
    </form>
  </div>

  <div class="table">
    <div class="table-header-group">
      <div class="table-cell p-1">String</div>
      <div class="table-cell p-1">Key</div>
      <div class="table-cell p-1">Language</div>
      <div class="table-cell p-1">Version</div>
      <div class="table-cell p-1">Input</div>
    </div>
    {#each paginatedItems as data}
      <div class="w-full table-row-group">
        <StringEditor
          dataString="{data.value}"
          dataKey="{data.key}"
          dataLang="{data.lang}"
          dataVersion="{data.version}" />
      </div>
    {/each}
  </div>
</section>

<style>
.pagiNav :global(.pagination-nav) {
  display: flex;
}

.pagiNav :global(.option) {
  background-color: rgba(12, 238, 238, 0.082);
  cursor: pointer;
  padding: 1rem;
}

.pagiNav :global(.option):hover {
  background-color: rgba(255, 255, 255, 0.062);
}

.pagiNav :global(.option.active) {
  color: green;
}
</style>
