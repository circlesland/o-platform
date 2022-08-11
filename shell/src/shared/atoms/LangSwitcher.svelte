<script lang="ts">
import { onMount } from "svelte";

import { GetAvailableLanguagesDocument, GetAvailableLanguagesQuery, I18n } from "../api/data/types";

import { ApiClient } from "../apiConnection";
import { Environment } from "../environment";

let availableLanguages = [];

let selectedValue: string;


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

<div class="flex items-center content-between w-full">
  {#each availableLanguages as { lang }}
    <div class="inline-flex w-full flex-grow justify-center" on:click="{() => {
      selectedValue = lang;
      changeHandler()
    }}">
      {#if lang == "en"}
        <img src="{'/country-flags/svg/gb.svg'}" alt="{selectedValue}" class="w-20 h-20 mr-2 hover:cursor-pointer" />
      {:else if lang == "in"}
        <img src="{'/country-flags/svg/mc.svg'}" alt="{selectedValue}" class="w-20 h-20 mr-2 hover:cursor-pointer" />
      {:else}
        <img src="{'/country-flags/svg/' + lang + '.svg'}" alt="{selectedValue}" class="w-20 h-20 mr-2 hover:cursor-pointer" />
      {/if}
    </div>
  {/each}
</div>
