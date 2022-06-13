<script lang="ts">
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import {onMount} from "svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let rows:any[] = [];

async function refresh() {
  const result = await fetch("http://stats.pingdom.com/4r8akov2me6s/checks?sEcho=1&iColumns=9&sColumns=status%2Cname%2Cday1%2Cday2%2Cday3%2Cday4%2Cday5%2Cday6%2Cday7&iDisplayStart=0&iDisplayLength=10&mDataProp_0=0&mDataProp_1=1&mDataProp_2=2&mDataProp_3=3&mDataProp_4=4&mDataProp_5=5&mDataProp_6=6&mDataProp_7=7&mDataProp_8=8&sSearch=&bRegex=false&sSearch_0=&bRegex_0=false&bSearchable_0=false&sSearch_1=&bRegex_1=false&bSearchable_1=true&sSearch_2=&bRegex_2=false&bSearchable_2=true&sSearch_3=&bRegex_3=false&bSearchable_3=true&sSearch_4=&bRegex_4=false&bSearchable_4=true&sSearch_5=&bRegex_5=false&bSearchable_5=true&sSearch_6=&bRegex_6=false&bSearchable_6=true&sSearch_7=&bRegex_7=false&bSearchable_7=true&sSearch_8=&bRegex_8=false&bSearchable_8=true&iSortingCols=1&iSortCol_0=1&sSortDir_0=asc&bSortable_0=true&bSortable_1=true&bSortable_2=true&bSortable_3=true&bSortable_4=true&bSortable_5=true&bSortable_6=true&bSortable_7=true&bSortable_8=true", {
    "headers": {
      "accept": "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9",
      "x-requested-with": "XMLHttpRequest"
    },
    "referrer": "http://stats.pingdom.com/4r8akov2me6s",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  });
  const jsonResponse = await result.json();
  rows = jsonResponse.aaData;
}

onMount(() => {
  /*
  const intervalHandle = setInterval(() => {
    refresh();
  }, 5000);
  return () => {
    clearInterval(intervalHandle);
  }
   */
})

</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />
<div>
  {#each rows as row}
    {@html row.join("")}
  {/each}
  <iframe class="w-full" height="600" src="http://stats.pingdom.com/4r8akov2me6s"></iframe>
</div>

<style>
</style>
