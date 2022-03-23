<script lang="ts">
import {
    me
} from "../stores/me";

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

export let key: string;
export let lang: string = "en";

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

function switchLanguage() {
    lang = prompt("Which language do you want to translate?");
    ApiClient.query < I18n[], QueryGetStringByLanguageArgs > (GetStringByLanguageDocument, {
            lang: lang,
        })
        .then((i18nResult: I18n[]) => {
            if (i18nResult.length === 0)
                alert("not supported")
            return;
        });
}

function writeValueToDb() {
    ApiClient.query < I18n, MutationUpdateValueArgs > (UpdateValueDocument, {
        lang: lang,
        key: key,
        value: value,
    })
}

function labelClicked(e: MouseEvent) {
    if (e.shiftKey) {
        let langToCreatePrompt = prompt("which language do you want to translate?");
        ApiClient.query < I18n, QueryGetStringByMaxVersionArgs > (GetStringByMaxVersionDocument, {
                lang: langToCreatePrompt,
                key: key
            })
            .then(i18nResult => {
                lang = langToCreatePrompt;
                if (i18nResult == null) {
                    ApiClient.query < I18n, MutationAddNewLangArgs > (AddNewLangDocument, {
                        langToCopyFrom: "en",
                        langToCreate: langToCreatePrompt
                    });
                    alert(`created language-Database and switched to ${langToCreatePrompt}`);
                    (function() {
                        value = prompt(value);
                        writeValueToDb();
                        window.alert(`You saved '${value}'`);
                    })();
                } else {
                    alert(`switched to language ${langToCreatePrompt}`);
                    (function() {
                        value = prompt(value);
                        writeValueToDb();
                        window.alert(`You saved '${value}'`);
                    })();
                }
            });

    }
}
</script>

<div on:click={labelClicked}>{value}</div>
