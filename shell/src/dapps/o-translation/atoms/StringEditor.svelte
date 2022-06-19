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

let keyArray = [];

let selectedVersion: number = dataVersion;
let inputValue: string;
let olderVersionData = [];

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

<div class="flex justify-between items-center w-full">
  <div class="w-full text-red-600">{dataString}</div>
  <!--<div class="table-cell p-1">{dataLang}</div>-->
  <!--<img src={"/country-flags/svg/" + dataLang + ".svg"} alt="{dataLang}" class="table-cell w-10 h-10">-->
  {#if dataVersion > 1}
    <div class="flex items-center w-full mr-16 justify-between">
      <p class="ml-8">Version: </p>
      <select name="" id="" bind:value="{selectedVersion}" on:change="{() => selectChange()}">
        {#each olderVersionData as data}
          <option value="{data.version}">{data.version}</option>
        {/each}
      </select>
    </div>
  {:else}
    <div class="flex items-center w-full mr-16 justify-between"><p class="ml-8">Version:</p><p>{dataVersion}</p></div>
  {/if}

  <div class="table-cell">
    <div class="flex">
      <input bind:value="{inputValue}" class="input" type="text" placeholder="{dataString}" />
      <button
        class="bg-blue-200 rounded-lg m-1 p-1 hover:bg-blue-500"
        on:click="{async () => {
          let updatedObject = await writeValueToDb(inputValue, dataLang, dataKey);
          await loadOlderVersions(dataLang, dataKey);
          dataVersion = updatedObject.version;
          dataString = updatedObject.value;
          selectedVersion = updatedObject.version;
          inputValue = '';
        }}">Save</button>
    </div>
  </div>
</div>
