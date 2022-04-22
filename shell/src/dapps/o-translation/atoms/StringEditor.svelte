<script lang="ts">
import { I18n, MutationUpdateValueArgs, UpdateValueDocument } from "../../../shared/api/data/types";
import { ApiClient } from "../../../shared/apiConnection";

export let dataKey: string;
export let dataLang: string;
export let dataString: string;
export let dataVersion: number;

let inputValue: string;

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
<div class="table-cell p-1">{dataVersion}</div>
<form>
  <div class="table-cell p-1">
    <div class="flex">
      <input bind:value="{inputValue}" class="input" type="text" placeholder="{dataString}" />
      <button class="bg-blue-100 rounded-lg m-1" on:click="{() => writeValueToDb(inputValue, dataLang, dataKey)}">Save</button>
    </div>
  </div>
</form>
