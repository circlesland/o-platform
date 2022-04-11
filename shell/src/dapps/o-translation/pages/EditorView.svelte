<script lang="ts">
import {
    onMount
} from "svelte";
import { data } from "vis-network";

import {
    GetAllStringsDocument,
    GetAllStringsQuery,
    I18n
} from "../../../shared/api/data/types";

import {
    ApiClient
} from "../../../shared/apiConnection";
import StringEditor from "../atoms/StringEditor.svelte";

let key: string;
let value: string;
let i18nData: I18n[];



onMount(
    async () => {
        i18nData = await ApiClient.query < I18n[], GetAllStringsQuery > (GetAllStringsDocument, {});
        console.log(i18nData)
    }
)

const stringSubmitHandler = (event) => {
    event.preventDefault();
    i18nData = i18nData.filter(item => item.value.indexOf(value) !== -1)
    console.log(i18nData)
}


const keySubmitHandler = (event) => {
    event.preventDefault();
    i18nData = i18nData.filter(item => item.key.indexOf(key) !== -1)
    console.log(i18nData)
}
</script>

<section class="flex flex-col items-center justify-center p-6">
    <div class="w-full flex flex-row flex-wrap items-stretch" style="background-color: blue;">

        <form on:change={keySubmitHandler}  class="">
            <input bind:value={key} class="m-1" type="text" placeholder="dapps.o-banking...">
        </form>
        <form on:change={stringSubmitHandler} action="">
            <input bind:value={value} class="m-1" type="text" placeholder="String">
        </form>

    </div>

    <div class="w-full text-center" style="background-color: blue;">
        <StringEditor data={i18nData}/>
    </div>
</section>
