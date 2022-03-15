<script lang="ts">
import { GetStringsByMaxVersionDocument, I18n, QueryGetStringsByMaxVersionArgs } from "../api/data/types";
import { ApiClient } from "../apiConnection";

let key: string = "en";
let lang: string = "common.trusted";


const String = async () => {
  const i18nresult = await ApiClient.query<I18n, QueryGetStringsByMaxVersionArgs>(GetStringsByMaxVersionDocument, {lang: "en", key: "common.trusted"});

  return JSON.stringify(i18nresult.value);
}

</script>

<style>
/* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->

<p>{String()}</p>
