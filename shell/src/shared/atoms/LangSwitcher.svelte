<script lang="ts">
import { onMount } from "svelte";

import { GetAvailableLanguagesDocument, GetAvailableLanguagesQuery, I18n } from "../api/data/types";

import { ApiClient } from "../apiConnection";
import { Environment } from "../environment";

let availableLanguages = [];

let selectedValue: string = Environment.userLanguage;

onMount(async () => {
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


function changeHandler() {
  Environment.userLanguage = selectedValue;
  location.reload();
}
</script>

<div class="flex items-center">
  <!--<img src="{'/country-flags/svg/' + selectedValue + '.svg'}" alt="{selectedValue}" class="table-cell w-10 h-10 mr-3" />-->
  <select bind:value="{selectedValue}" on:change="{changeHandler}" class="">
    {#each availableLanguages as { lang }}
      <option class="" value="{lang}">{lang}</option>
    {/each}
  </select>
</div>
