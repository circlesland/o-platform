<script lang="ts">
import {
    GetStringByMaxVersionDocument,
    GetStringByLanguageDocument,
    I18n,
    MutationUpdateValueArgs,
    QueryGetStringByMaxVersionArgs,
    QueryGetStringByLanguageArgs,
    UpdateValueDocument,
    MutationAddNewLangArgs,
    AddNewLangDocument,
} from "../api/data/types";
import {
    ApiClient
} from "../apiConnection";
import {
    Environment
} from "../environment";


const languageFallback = function() {
    if (Environment.userLanguage.startsWith("en") ||
        Environment.userLanguage == "us") {
            Environment.userLanguage = "en";
        };
    if (Environment.userLanguage.startsWith("de")) {
            Environment.userLanguage = "de";
        };
    if (Environment.userLanguage.startsWith("fr")) {
            Environment.userLanguage = "fr";
        };
    if (Environment.userLanguage.startsWith("pt")) {
            Environment.userLanguage = "pt";
    };
    if (Environment.userLanguage == "id" ||
        Environment.userLanguage == "in") {
            Environment.userLanguage = "in";
    };
}
languageFallback();


export let key: string;
export let lang: string = Environment.userLanguage;


let value: string;

function getValue() {
    ApiClient.query < I18n, QueryGetStringByMaxVersionArgs > (GetStringByMaxVersionDocument, {
            lang: lang,
            key: key
        })
        .then(i18nResult => {
            value = i18nResult.value;
            key = i18nResult.key;
        });
}
getValue();

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
    ApiClient.query < I18n, MutationUpdateValueArgs > (UpdateValueDocument, {
        lang: lang,
        key: key,
        value: value,
    })
    window.alert(`You saved '${value}'`);
}

function labelClicked(e: MouseEvent) {
    if (e.shiftKey) {
        console.log(e.cancelable)
        writeValueToDb(prompt(value));
    }
}
</script>

<div on:click={labelClicked}>{value}</div>
