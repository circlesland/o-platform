<script lang="ts">

import { I18n, MutationUpdateValueArgs, UpdateValueDocument } from "../../../shared/api/data/types";
import { ApiClient } from "../../../shared/apiConnection";

export let data = [];

let inputValue: string;


$: {
  data;
}

async function writeValueToDb(value: string, lang: string, key: string) {
  await ApiClient.query<I18n, MutationUpdateValueArgs>(UpdateValueDocument, {
    lang: lang,
    key: key,
    value: value,
  });
	window.location.reload();
}
</script>

<div class="table">
  <div class="table-header-group">
    <div class="table-cell p-1">String</div>
    <div class="table-cell p-1">Key</div>
    <div class="table-cell p-1">Language</div>
    <!--<div class="table-cell p-1">Version</div>-->
    <div class="table-cell p-1">Input</div>
  </div>
  {#each data as entry}
    <div class="table-row-group">
      <div class="table-cell break-all w-64 p-1">{entry.value}</div>
      <div class="table-cell break-all p-1">{entry.key}</div>
      <div class="table-cell p-1">{entry.lang}</div>
      <!--<div class="table-cell p-1">{entry.version}</div>-->
      <form action="" on:submit="{() => writeValueToDb(inputValue, entry.lang, entry.key)}">
        <div class="table-cell p-1"><input bind:value="{inputValue}" class="input" type="text" placeholder="{entry.value}" /></div>
      </form>
    </div>
  {/each}
</div>
