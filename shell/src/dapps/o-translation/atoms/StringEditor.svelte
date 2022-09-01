<script lang="ts">
import { onMount } from "svelte";

import {
  GetOlderVersionsByKeyAndLangDocument,
  I18n,
  MutationUpdateValueArgs,
  QueryGetOlderVersionsByKeyAndLangArgs,
  UpdateValueDocument,
} from "../../../shared/api/data/types";
import { ApiClient } from "../../../shared/apiConnection";

export let dataKey: string;
export let dataLang: string;
export let dataString: string;
export let dataVersion: number;

let editMode: boolean = false;
let inputMode: boolean = false;
let editBorder: string = "";

let keyArray = [];

let selectedVersion: number = dataVersion;
let inputValue: string;
let olderVersionData = [];

let negativeMargin: string = "";

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

</script>

<div class="flex-row min-w-[600px] {editBorder} rounded-box p-5 hover:border-2 hover:border-dark-dark hover:border-dotted">
  <div class="flex justify-between w-full">
    <p class="text-gray-400 w-40">{dataKey}</p>
    <div class="flex">
      <p>{dataLang}</p>
      {#if dataVersion > 1}
        <p>Version:</p>

        <div class="items-center w-full">
          <select name="" id="" bind:value="{selectedVersion}" on:change="{() => selectChange()}">
            {#each olderVersionData as data}
              <option value="{data.version}">{data.version}</option>
            {/each}
          </select>
        </div>
      {:else}
        <p>Version:</p>
        <p class="items-center w-full">{dataVersion}</p>
      {/if}
    </div>
  </div>
  <div class="flex justify-between items-center w-full">
    <p class="w-56 text-red-600 ml-6 text-xl">{dataString}</p>

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
              editBorder = '';
            }}">Save</button>
        {/if}
        <button
          class="bg-red-200 rounded-lg m-1 p-1 hover:bg-red-500"
          on:click="{() => {
            editMode = false;
            editBorder = '';
          }}"><p class="ml-2 mr-2">X</p></button>
      {:else}
        <button
          class="bg-blue-200 rounded-lg m-1 p-1 hover:bg-blue-500"
          on:click="{() => {
            editMode = true;
            editBorder = 'border-2 border-dark-dark border-dotted';
          }}">Edit</button>
      {/if}
    </div>
  </div>
  {#if editMode}
    <div class="flex justify-center w-full">
      <!-- svelte-ignore a11y-autofocus -->
      <textarea
        autofocus
        bind:value="{inputValue}"
        on:input="{() => {
          inputMode = true;
        }}"
        class="border-black border-2 rounded p-5"
        cols="30"
        rows="2"></textarea>
    </div>
  {/if}
</div>
