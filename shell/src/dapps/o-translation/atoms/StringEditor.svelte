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
<form action="" on:submit="{() => writeValueToDb(inputValue, dataLang, dataKey)}">
  <div class="table-cell p-1">
    <input bind:value="{inputValue}" class="input" type="text" placeholder="{dataString}" />
  </div>
</form>
