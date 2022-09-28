<script lang="ts">
import { onMount } from "svelte";
import { svg_element } from "svelte/internal";

import { GetAvailableLanguagesDocument, GetAvailableLanguagesQuery, I18n } from "../api/data/types";

import { ApiClient } from "../apiConnection";
import { Environment } from "../environment";

let availableLanguages = [];

let selectedValue: string;
let ratio = 1.77;
let height = 75;
let width = height * ratio;

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

<div class="z-10 flex justify-evenly">
  {#each availableLanguages as { lang }}
    <div class="w-20 h-12 flex flex-row mt-2 -mr-2 hover:cursor-pointer">
      <svg
        on:click="{() => {
          selectedValue = lang;
          changeHandler();
        }}"
        viewBox="0 0 1000 600"
        class="">
        {#if lang == "en"}
          <image width="100%" height="100%" preserveAspectRatio="none" xlink:href="{'/countryFlags/gb.svg'}"></image>
        {:else}
          <image width="100%" height="100%" preserveAspectRatio="none" xlink:href="{'/countryFlags/' + lang + '.svg'}"
          ></image>
        {/if}
      </svg>
    </div>
  {/each}
</div>
