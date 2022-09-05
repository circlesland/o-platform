<script lang="ts">
import { onMount } from "svelte";

import {
  CreateNewStringAndKeyDocument,
  GetAllStringsByMaxVersionDocument,
  GetAllStringsByMaxVersionQuery,
  GetAvailableLanguagesDocument,
  GetAvailableLanguagesQuery,
  I18n,
  MutationCreateNewStringAndKeyArgs,
} from "../../../shared/api/data/types";

import { ApiClient } from "../../../shared/apiConnection";
import StringEditor from "../atoms/StringEditor.svelte";
import { Environment } from "../../../shared/environment";
import { createEventDispatcher } from "svelte";

export let searchKey: string = "";
export let i18nData: I18n[] = [];

let valueFilter: string = "";
let allLanguages: string[] = [];
let nextData: I18n[] = [];
let selectedLanguage: string = "";
let createNewStringMode: boolean = false;
let keyToCreate: string = "";
let stringToCreate: string = "";
let availableLanguages: I18n[] = [];

const dispatch = createEventDispatcher();

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

async function reload() {
  i18nData = i18nData.concat(nextData);
}

$: {
  i18nData;
  nextData;
  searchKey;
  selectedLanguage;
}

onMount(async () => {
  selectedLanguage = Environment.userLanguage;
  reload();
  getAllLanguages();
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

function loadMorenWhenInViewport(e) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      dispatch("loadMoreStrings");
    }
  });
  observer.observe(e);
}

async function writeNewKeyToDb(lang: string, key: string, version: number, value: string) {
  return await ApiClient.query<I18n, MutationCreateNewStringAndKeyArgs>(CreateNewStringAndKeyDocument, {
    lang: lang,
    key: key,
    version: version,
    value: value,
  });
}
</script>

<section class="flex flex-col items-center justify-center p-6">
  <div class="w-full flex flex-row flex-wrap items-stretch justify-between">
    <div class="inline-flex">
      {#each allLanguages as languageCode}
        <span
          on:click="{() => {
            dispatch('toggleLanguage', { languageCode: languageCode });
            selectedLanguage = languageCode;
          }}"
          class="p-1 w-20 h-20 align-middle"
          class:w-32="{selectedLanguage == languageCode}">
          {#if languageCode == "en"}
            <img
              src="{'/country-flags/svg/gb.svg'}"
              alt="{languageCode}"
              class=" hover:cursor-pointer mr-auto ml-auto" />
          {:else}
            <img
              src="{'/country-flags/svg/' + languageCode + '.svg'}"
              alt="{languageCode}"
              class=" hover:cursor-pointer mr-auto ml-auto" />
          {/if}
        </span>
      {/each}
    </div>
    <div class="inline-flex">
      <form
        on:submit|preventDefault="{() => {
          dispatch('stringSearch', { searchString: valueFilter });
          valueFilter = '';
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
    </div>
    {#if !createNewStringMode}
      <div class="flex grow">
        <button
          class="bg-blue-200 rounded-md btn-md hover:bg-blue-500"
          on:click="{() => {
            createNewStringMode = true;
          }}">
          add a new string
        </button>
      </div>
    {/if}

    {#if createNewStringMode}
      <div class="flex grow">
        <button
          class="bg-blue-100 rounded-md btn-md hover:cursor-not-allowed"
          on:click="{() => {
            createNewStringMode = true;
          }}">
          add a new string
        </button>
      </div>
      <div class="flex justify-between w-full">
        <div class="flex">
          <form class="justify-start">
            <input bind:value="{keyToCreate}" class="input m-1" type="text" placeholder="key goes here" />
          </form>
          <form class="justify-start">
            <input bind:value="{stringToCreate}" class="input m-1" type="text" placeholder="string goes here" />
          </form>
        </div>
        <div class="flex">
          <button
            class="bg-blue-200 rounded-md btn-md hover:bg-blue-500"
            on:click="{async () => {
              for (let i = 0; i < availableLanguages.length; i++) {
                await writeNewKeyToDb(availableLanguages[i].lang, keyToCreate, 1, stringToCreate);
                dispatch('newString');
              }
              createNewStringMode = false;
            }}">create</button>
          <button
            class="bg-red-200 rounded-md btn-md hover:bg-red-500"
            on:click="{() => {
              createNewStringMode = false;
            }}">
            cancel
          </button>
        </div>
      </div>
    {/if}
  </div>

  <div class="pt-20 w-full">
    {#if !i18nData.length}
      <h1 class="flex justify-center align-middle text-alert pt-20">No matching result</h1>
    {:else}
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
    {/if}

    {#if i18nData.length}
      <div use:loadMorenWhenInViewport class="btn-primary rounded-btn"></div>
    {/if}
  </div>
</section>
