<script lang="ts">
import { onMount } from "svelte";

import {
  I18n,
  MutationUpdateValueArgs,
  QueryGetStringByMaxVersionArgs,
  UpdateValueDocument,
  GetAvailableLanguagesQuery,
  GetAvailableLanguagesDocument,
  GetStringByMaxVersionDocument,
} from "../api/data/types";
import { ApiClient } from "../apiConnection";
import { Environment } from "../environment";
import { _ } from "svelte-i18n";

["c", "a", "b"].sort(function (a, b) {
  return (
    a.length - b.length || // sort by length, if equal then
    a.localeCompare(b)
  ); // sort by dictionary order
});

onMount(async () => {
  const currentLanguage = Environment.userLanguage;
  const i18nResult = await ApiClient.query<I18n[], GetAvailableLanguagesQuery>(GetAvailableLanguagesDocument, {});
  const availableLanguages = i18nResult;
  availableLanguages.sort((a, b) => {
    return b.lang.length - a.lang.length;
  });

  for (const element of availableLanguages) {
    if (currentLanguage.startsWith(element.lang)) {
      lang = element.lang;
      break;
    }
  }
  getValue();
});

export let key: string;
export let lang: string;

let value: string;


function getValue() {


  ApiClient.query<I18n, QueryGetStringByMaxVersionArgs>(GetStringByMaxVersionDocument, {
    lang: lang,
    key: key,
  }).then((i18nResult) => {
    value = i18nResult.value;
    key = i18nResult.key;
  });
}

//function getValueByLang() {
//    ApiClient.query < I18n, QueryGetStringByLanguageArgs > (GetStringByLanguageDocument, {
//            lang: lang,
//        })
//        .then(i18nResult => {
//            value = i18nResult.value;
//            key = i18nResult.key;
//            lang = i18nResult.lang
//        });
//}

function writeValueToDb(value: string) {
  ApiClient.query<I18n, MutationUpdateValueArgs>(UpdateValueDocument, {
    lang: lang,
    key: key,
    value: value,
  });
  window.alert(`You saved '${value}'`);
}

function labelClicked(e: MouseEvent) {
  if (e.shiftKey) {
    console.log(e.cancelable);
    writeValueToDb(prompt(value));
  }
}
</script>

<div on:click="{labelClicked}">{$_(`${key}`)}</div>
