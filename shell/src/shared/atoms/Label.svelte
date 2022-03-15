<script lang="ts">
import { GetStringByMaxVersionDocument, I18n, QueryGetStringByMaxVersionArgs } from "../api/data/types";
import { ApiClient } from "../apiConnection";

export let key: string;
export let lang: string;

let value: string;

$: {
  ApiClient.query<I18n, QueryGetStringByMaxVersionArgs>(GetStringByMaxVersionDocument, {
    lang: lang,
    key: key
  })
  .then(i18nResult => {
    value = i18nResult.value;
  });
}
</script>

<style>
/* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->
<p>{value}</p>
