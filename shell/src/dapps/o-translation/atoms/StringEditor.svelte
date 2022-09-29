<script lang="ts">
import { createEventDispatcher } from "svelte";
import { onMount } from "svelte";

import {
  GetOlderVersionsByKeyAndLangDocument,
  GetStringByMaxVersionDocument,
  I18n,
  MutationUpdateValueArgs,
  QueryGetOlderVersionsByKeyAndLangArgs,
  QueryGetStringByMaxVersionArgs,
  UpdateValueDocument,
} from "../../../shared/api/data/types";
import { ApiClient } from "../../../shared/apiConnection";

export let dataKey: string;
export let dataLang: string;
export let dataString: string;
export let dataVersion: number;
export let userLanguage: string;

let editMode: boolean = false;
let inputMode: boolean = false;

let keyArray = [];

let selectedVersion: number = dataVersion;
let inputValue: string;
let olderVersionData = [];
let compareMode: boolean = false;
let englishData: I18n = {};
let dispatch = createEventDispatcher();

keyArray.concat(keyArray.push(dataKey.split(".")));

onMount(() => {
  if (dataVersion > 1) {
    loadOlderVersions(dataLang, dataKey);
  }
});

async function loadOlderVersions(lang: string, key: string) {
  const queryResult = await ApiClient.query<I18n[], QueryGetOlderVersionsByKeyAndLangArgs>(
    GetOlderVersionsByKeyAndLangDocument,
    {
      lang: lang,
      key: key,
    }
  );
  olderVersionData = queryResult;
}

const selectChange = async function () {
  const searchData = await olderVersionData.find((data) => data.version == selectedVersion);
  dataString = searchData.value;
};

async function writeValueToDb(value: string, lang: string, key: string) {
  return await ApiClient.query<I18n, MutationUpdateValueArgs>(UpdateValueDocument, {
    lang: lang,
    key: key,
    value: value,
  });
}

async function getEnglishVersion(lang: string, key: string) {
  return await ApiClient.query<I18n, QueryGetStringByMaxVersionArgs>(GetStringByMaxVersionDocument, {
    lang: lang,
    key: key,
  });
}
</script>

<div class="flex-row border-t-8 border-t-white p-5">
  <div class="flex justify-between w-full">
    <p class="text-gray-400 w-full">{dataKey}</p>
    <div class="flex">
      {#if dataVersion > 1}
        <p class="pr-4">Version:</p>

        <div class="items-center w-full">
          <select name="" id="" bind:value="{selectedVersion}" on:change="{() => selectChange()}">
            {#each olderVersionData as data}
              <option value="{data.version}">{data.version}</option>
            {/each}
          </select>
        </div>
      {:else}
        <p class="pr-4">Version:</p>
        <p class="items-center w-full">{dataVersion}</p>
      {/if}
    </div>
  </div>
  <div class="flex justify-between items-center w-full">
    <p class="text-red-600 ml-6 text-xl w-full">{dataString}</p>
    {#if compareMode}
      <p class="text-red-600 ml-6 text-xl w-full">English: {englishData.value}</p>
    {/if}

    <div class="flex">
      {#if editMode}
        {#if inputMode}
          <button
            class="bg-blue-200 rounded-lg m-1 p-1 hover:bg-blue-500"
            on:click="{async () => {
              let updatedObject = await writeValueToDb(inputValue, dataLang, dataKey);
              await loadOlderVersions(dataLang, dataKey);
              dataVersion = updatedObject.version;
              dataString = updatedObject.value;
              selectedVersion = updatedObject.version;
              inputValue = '';
              editMode = false;
              dispatch('save');
            }}">Save</button>
        {/if}
        <button
          class="bg-red-200 rounded-lg m-1 p-1 hover:bg-red-500"
          on:click="{() => {
            editMode = false;
          }}"><p class="ml-2 mr-2">X</p></button>
      {:else}
        <button
          class="bg-blue-200 rounded-lg m-1 p-1 hover:bg-blue-500"
          on:click="{async () => {
            editMode = true;
            englishData = await getEnglishVersion('en', dataKey);
          }}">Edit</button>
      {/if}
      {#if userLanguage != "en"}
        <button
          class="bg-blue-200 rounded-lg m-1 p-1 hover:bg-blue-500"
          on:click="{async () => {
            englishData = await getEnglishVersion('en', dataKey);
            compareMode = true;
          }}">Compare with english-version</button>
      {/if}
    </div>
  </div>
  {#if editMode}
    <!--Modal effect-->
    <div class="fixed  inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-40" id="my-modal"></div>
    <!--modale editor-->
    <div
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mx-auto p-5 border w-[50%] rounded-md bg-white z-50">
      <div class="max-w-2xl bg-white py-10 px-5 m-auto w-full mt-10">
        <div class="text-3xl mb-6 text-center ">Edit text/srting</div>
        <div class="mb-6 text-center text-info">
          <p>{dataString}</p>
        </div>

        <div class="grid grid-cols-2 gap-4 max-w-xl m-auto">
          <div class="col-span-2 break-words">
            <p>{dataKey}</p>
          </div>

          {#if userLanguage != "en"}
            <div class="col-span-2">
              <p class="text-accent">English version: {englishData.value}</p>
            </div>
          {/if}

          <div class="col-span-2">
            <!-- svelte-ignore a11y-autofocus -->
            <textarea
              autofocus
              bind:value="{inputValue}"
              cols="30"
              rows="8"
              class="border-solid border-gray-400 border-2 p-3 md:text-xl w-full"
              placeholder="{dataString}"></textarea>
          </div>

          <div class="sm:col-span-1 text-left col-span-2 sm:text-center w-[100%]">
            <button
              class="py-3 px-6 bg-green-500 text-white font-bold w-full sm:w-32 rounded-md"
              on:click="{async () => {
                let updatedObject = await writeValueToDb(inputValue, dataLang, dataKey);
                await loadOlderVersions(dataLang, dataKey);
                dataVersion = updatedObject.version;
                dataString = updatedObject.value;
                selectedVersion = updatedObject.version;
                inputValue = '';
                editMode = false;
                dispatch('save');
              }}">
              Save
            </button>
          </div>

          <div class="sm:col-span-1 text-right col-span-2 sm:text-center w-[100%]">
            <button
              class="py-3 px-6 bg-red-500 text-white font-bold w-full sm:w-32 rounded-md"
              on:click="{() => {
                editMode = false;
              }}">
              Abort
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
