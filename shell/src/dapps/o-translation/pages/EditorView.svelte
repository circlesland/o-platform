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
  MutationSetStringUpdateStateArgs,
  SetStringUpdateStateDocument,
} from "../../../shared/api/data/types";

import { ApiClient } from "../../../shared/apiConnection";
import StringEditor from "../atoms/StringEditor.svelte";
import { Environment } from "../../../shared/environment";
import { createEventDispatcher } from "svelte";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import CreateStringTextArea from "../atoms/CreateStringTextArea.svelte";

export let searchKey: string = "";
export let i18nData: I18n[] = [];
export let updateMode: boolean = false;
export let userLanguage: string;

let valueFilter: string = "";
let allLanguages: string[] = [];
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

$: {
  i18nData;
  searchKey;
  selectedLanguage;
}

onMount(async () => {
  selectedLanguage = Environment.userLanguage;
  // reload();
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

function loadMoreWhenInViewport(e) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      dispatch("loadMoreStrings", updateMode);
    }
  });
  observer.observe(e);
}

function loadMoreUpdateStringsWhenInViewport(e) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      dispatch("loadMoreStringsToUpdate", updateMode);
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

<section class="flex flex-col items-center justify-evenly p-6">
  <div class="w-full flex flex-row flex-wrap items-stretch justify-evenly">
    <div class="z-10 flex w-1/3 justify-evenly">
      {#each allLanguages as languageCode}
        <svg
          on:click="{() => {
            selectedLanguage = languageCode;
            dispatch('toggleLanguage', { languageCode: languageCode });
          }}"
          class="w-20 h-12 flex flex-row border-8 border-warning"
          class:border-8="{selectedLanguage == languageCode}"
          class:border-warning="{selectedLanguage == languageCode}">
          {#if languageCode == "en"}
            <image width="100%" height="100%" preserveAspectRatio="none" xlink:href="{'/countryFlags/gb.svg'}"></image>
          {:else}
            <image
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              xlink:href="{'/countryFlags/' + languageCode + '.svg'}"></image>
          {/if}
        </svg>
      {/each}
    </div>
    <div class="w-2/3 inline-flex">
      <div class="inline-flex w-3/4">
        <form
          class="justify-sart w-full inline-flex"
          on:submit|preventDefault="{() => {
            dispatch('stringSearch', { searchString: valueFilter });
            valueFilter = '';
          }}">
          <input bind:value="{valueFilter}" class="input rounded-r-none w-3/4" type="text" placeholder="String" />
          {#if valueFilter == ""}
            <button class="btn-primary btn-disabled btn-md rounded-btn rounded-l-none bg-gray-400 text-white">
              search
            </button>
          {:else}
            <button class="btn-primary btn-md rounded-btn rounded-l-none">search</button>
          {/if}
        </form>
      </div>
      <div class="flex grow w-1/4 justify-evenly">
        <button
          class="bg-blue-200 rounded-md btn-md hover:bg-blue-500"
          class:bg-blue-100="{createNewStringMode}"
          class:rounded-md="{createNewStringMode}"
          class:btn-md="{createNewStringMode}"
          class:hover:cursor-not-allowed="{createNewStringMode}"
          on:click="{() => {
            createNewStringMode = true;
          }}">
          add a new string
        </button>
      </div>
    </div>

    {#if !createNewStringMode}
      <div class="flex p-5 w-full">
        <div class="flex-col items-stretch w-full">
          <form class="justify-start">
            <input bind:value="{stringToCreate}" class="w-full" type="text" placeholder="key goes here..." />
          </form>
        </div>
        <div class="flex justify-center w-full">
          <CreateStringTextArea/>
        </div>
        <div class="flex w-full">
          <button
            class="bg-blue-200 rounded-md btn-md hover:bg-blue-500"
            on:click="{async () => {
              for (let i = 0; i < availableLanguages.length; i++) {
                await writeNewKeyToDb(availableLanguages[i].lang, keyToCreate, 1, stringToCreate);
              }
              createNewStringMode = false;
              dispatch('newString');
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
    {/if}

    {#each i18nData as data (data.key + data.lang + data.version)}
      <div class="w-full">
        <StringEditor
          on:save
          userLanguage="{userLanguage}"
          dataString="{data.value}"
          dataKey="{data.key}"
          dataLang="{data.lang}"
          dataVersion="{data.version}" />
      </div>
    {/each}

    {#if i18nData.length && !updateMode}
      <div use:loadMoreWhenInViewport class="btn-primary rounded-btn"></div>
    {:else if i18nData.length && updateMode}
      <div use:loadMoreUpdateStringsWhenInViewport class="btn-primary rounded-btn"></div>
    {/if}
  </div>
</section>
