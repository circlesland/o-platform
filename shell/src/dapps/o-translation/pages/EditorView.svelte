<script lang="ts">
import { onMount } from "svelte";

import { GetAllStringsDocument, GetAllStringsQuery, I18n } from "../../../shared/api/data/types";

import { ApiClient } from "../../../shared/apiConnection";
import StringEditor from "../atoms/StringEditor.svelte";
import { Environment } from "../../../shared/environment";

let key: string;
let value: string;
let i18nData: I18n[];
let allLanguages: string[] = [];
let selectedLanguage: string = Environment.userLanguage;

async function reload(selectedLanguage: string) {
  const queryResult = await ApiClient.query<I18n[], GetAllStringsQuery>(GetAllStringsDocument, {});

  const allLanguageKeysInQueryResult = queryResult.toLookup((o) => o.lang);
  allLanguages = Object.keys(allLanguageKeysInQueryResult);

  i18nData = queryResult
    .filter((o) => o.lang == selectedLanguage)
    .sort((a, b) => {
      if (a.key < b.key) {
        return -1;
      }
      if (a.key > b.key) {
        return 1;
      }
      return 0;
    });
}

$: {
  reload(selectedLanguage);
}

onMount(async () => {
  reload(selectedLanguage);
  const queryResult = await ApiClient.query<I18n[], GetAllStringsQuery>(GetAllStringsDocument, {});

  const allLanguageKeysInQueryResult = queryResult.toLookup((o) => o.lang);
  allLanguages = Object.keys(allLanguageKeysInQueryResult);

  i18nData = queryResult
    .filter((o) => o.lang == selectedLanguage)
    .sort((a, b) => {
      if (a.key < b.key) {
        return -1;
      }
      if (a.key > b.key) {
        return 1;
      }
      return 0;
    });

  console.log("i18nData", i18nData);
  console.log("allLanguages", allLanguages);
});

const stringSubmitHandler = (event) => {
  event.preventDefault();
  i18nData = i18nData.filter((item) => item.value.startsWith(value));
  console.log(i18nData);
};

const keySubmitHandler = (event) => {
  event.preventDefault();
  i18nData = i18nData.filter((item) => item.key.startsWith(key));
  console.log(i18nData);
};
</script>

<section class="flex flex-col items-center justify-center p-6">
  <div class="w-full flex flex-row flex-wrap items-stretch">
    <form on:submit="{stringSubmitHandler}" action="">
      <input bind:value class="m-1" type="text" placeholder="String" />
    </form>
    <form on:submit="{keySubmitHandler}" class="">
      <input bind:value="{key}" class="m-1" type="text" placeholder="dapps.o-banking..." />
    </form>
    <form on:submit="{stringSubmitHandler}" action="">
      <select bind:value="{selectedLanguage}" class="m-1">
        {#each allLanguages as lang}
          <option>{lang}</option>
        {/each}
      </select>
    </form>
  </div>

  <div class="w-full text-center">
    <StringEditor data="{i18nData}" />
  </div>
</section>
