<script lang="ts">
import { GetAllStringsDocument, I18n } from "../../../shared/api/data/types";

import { ApiClient } from "../../../shared/apiConnection";

let lang: string;
let key: string = "dapps.o-banking.atoms.transferConfirmation.paymentPath";
let value: string;

const submitHandler = (event) => {
    event.preventDefault();
    ApiClient.query < I18n > (GetAllStringsDocument, {
    })
    .then(i18nResult => {
        value = i18nResult.value;
        key = i18nResult.key;
        console.log(i18nResult)
    });

}


</script>

<section class="flex flex-col items-center justify-center p-6">
    <div class="w-full flex flex-row flex-wrap items-stretch" style="background-color: blue;">

        <form on:submit={submitHandler}  class="">
            <input class="m-1" type="text" value="dapps.o-banking...">
            <input type="submit" value="Seach Key">            
        </form>
        <form action="">
            <input class="m-1" type="text" value="String">
            <input type="submit" value="Seach String">            
        </form>



    </div>

    <div class="w-full text-center" style="background-color: blue;"><h1>Hallo</h1></div>
</section>
