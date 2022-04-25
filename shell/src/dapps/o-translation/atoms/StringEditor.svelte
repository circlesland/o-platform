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

let selectedVersion: number = dataVersion;
let inputValue: string;
let olderVersionData = [];

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
  await ApiClient.query<I18n, MutationUpdateValueArgs>(UpdateValueDocument, {
    lang: lang,
    key: key,
    value: value,
  });
  window.location.reload();
}
</script>

<div class="table-cell break-all w-64 p-1">{dataString}</div>
<div class="table-cell break-all w-64 p-1">{dataKey}</div>
<div class="table-cell p-1">{dataLang}</div>
{#if dataVersion > 1}
  <div class="table-cell p-1">
    <select name="" id="" bind:value="{selectedVersion}" on:change="{() => selectChange()}">
      {#each olderVersionData as data}
        <option value="{data.version}">{data.version}</option>
      {/each}
    </select>
  </div>
{:else}
  <div class="table-cell p-1">{dataVersion}</div>
{/if}

<form>
  <div class="table-cell p-1">
    <div class="flex">
      <input bind:value="{inputValue}" class="input" type="text" placeholder="{dataString}" />
      <button class="bg-blue-100 rounded-lg m-1" on:click="{() => writeValueToDb(inputValue, dataLang, dataKey)}"
        >Save</button>
    </div>
  </div>
</form>
