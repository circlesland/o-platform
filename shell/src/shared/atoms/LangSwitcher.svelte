<script lang="ts">
import {
    onMount
} from "svelte";

import {
    GetAvailableLanguagesDocument,
    GetAvailableLanguagesQuery,
    I18n,
} from "../api/data/types";

import {
    ApiClient
} from "../apiConnection";
import {
    Environment
} from "../environment";

let availableLanguages = [];

let selectedValue: string = Environment.userLanguage;

onMount(async () => {
    const i18nResult = await ApiClient.query < I18n[],
        GetAvailableLanguagesQuery > (GetAvailableLanguagesDocument, {});
    availableLanguages = i18nResult;
    availableLanguages.sort((a, b) => {
        let langA = a.lang;
        let langB = b.lang;
        if (langA < langB) {
            return -1;
        }
        if (langA > langB) {
            return 1
        }
        return 0;
    });
})

function changeHandler() {
    Environment.userLanguage = selectedValue;
    location.reload();
}
</script>

<div>{selectedValue}</div>
<select bind:value={selectedValue} on:change={changeHandler}>
    {#each availableLanguages as { lang }}
    <option value={lang}>{lang}</option>
    {/each}
</select>
