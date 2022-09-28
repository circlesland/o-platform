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
          <input bind:value="{valueFilter}" class="rounded-r-none w-3/4" type="text" placeholder="String" />
          {#if valueFilter == ""}
            <button class="btn-primary btn-disabled btn-sm rounded-btn rounded-l-none bg-gray-400 text-white">
              search
            </button>
          {:else}
            <button class="btn-primary btn-sm rounded-btn rounded-l-none">search</button>
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

    {#if createNewStringMode}
      <!--Modal effect-->
      <div class="fixed  inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-40" id="my-modal"></div>
      <!--modale editor-->
      <div
        class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mx-auto p-5 border w-[50%] rounded-md bg-white z-50">
        <div class="max-w-2xl bg-white py-10 px-5 m-auto w-full mt-10">
          <div class="text-3xl mb-6 text-center ">Create a new string</div>
          <div class="mb-6 text-center text-info">
            Please use english for the new created text/string.<br />All other languages will be notified about a new
            created text/string.
          </div>

          <div class="grid grid-cols-2 gap-4 max-w-xl m-auto">
            <div class="col-span-2">
              <input
                bind:value="{keyToCreate}"
                type="text"
                class="border-solid border-gray-400 border-2 p-3 md:text-xl w-full"
                placeholder="key goes here..." />
            </div>

            <div class="col-span-2">
              <textarea
                bind:value="{stringToCreate}"
                cols="30"
                rows="8"
                class="border-solid border-gray-400 border-2 p-3 md:text-xl w-full"
                placeholder="Message"></textarea>
            </div>

            <div class="sm:col-span-1 text-left col-span-2 sm:text-center w-[100%]">
              <button
                class="py-3 px-6 bg-green-500 text-white font-bold w-full sm:w-32 rounded-md"
                on:click="{async () => {
                  for (let i = 0; i < availableLanguages.length; i++) {
                    await writeNewKeyToDb(availableLanguages[i].lang, keyToCreate, 1, stringToCreate);
                  }
                  createNewStringMode = false;
                  dispatch('newString');
                }}">
                Save
              </button>
            </div>

            <div class="sm:col-span-1 text-right col-span-2 sm:text-center w-[100%]">
              <button
                class="py-3 px-6 bg-red-500 text-white font-bold w-full sm:w-32 rounded-md"
                on:click="{() => {
                  createNewStringMode = false;
                }}">
                Abort
              </button>
            </div>
          </div>
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
