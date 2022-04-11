<script lang="ts">
export let data = [];

$: {
    data;
}


</script>

<table class="table-fixed" style="width: 100%">
    <tr>
        <th>String</th>
        <th>Key</th>
        <th>Language</th>
        <th>Input</th>
    </tr>
    {#each data as entry}
    <tr>
        <td>{entry.value}</td>
        <td class="break-all">{entry.key}</td>
        <td>{entry.lang}</td>
        <td><input type="text" placeholder={entry.value}></td>
        <button>Save</button>
    </tr>
    {/each}
</table>
