<script lang="ts">
import { entropyToMnemonic } from "bip39";
import Account from "../../o-passport/pages/Account.svelte";

export let data = [];

$: {
    data;
}

console.log(data)
</script>

<table class="table-fixed" style="width: 100%">
    <tr>
        <th>String</th>
        <th>Key</th>
        <th>Language</th>
        <th>Input</th>
    </tr>
    {#each data as entry}
    <tr class="m-1">
        <td>{entry.value}</td>
        <td class="break-all">{entry.key}</td>
        <td>{entry.lang}</td>
        <td><input type="text"></td>
        <button>Save</button>
    </tr>
    {/each}
</table>
