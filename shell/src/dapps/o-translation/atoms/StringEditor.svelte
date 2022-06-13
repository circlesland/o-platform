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

<div class="table">
  <div class="table-row-group">
    <div class="table-row">
      <div class="table-cell break-all w-64 p-1">{dataString}</div>
      <!--<div class="table-cell p-1">{dataLang}</div>-->
      <img src={"/country-flags/svg/" + dataLang + ".svg"} alt="blasjgdhla" class="table-cell w-10 h-10">
      {#if dataVersion > 1}
        <div class="table-cell p-1 w-20">
          <select name="" id="" bind:value="{selectedVersion}" on:change="{() => selectChange()}">
            {#each olderVersionData as data}
              <option value="{data.version}">{data.version}</option>
            {/each}
          </select>
        </div>
      {:else}
        <div class="table-cell p-1 w-20">{dataVersion}</div>
      {/if}

      <div class="table-cell p-1">
        <div class="flex">
          <input bind:value="{inputValue}" class="input" type="text" placeholder="{dataString}" />
          <button
            class="bg-blue-100 rounded-lg m-1"
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
  </div>
</div>
