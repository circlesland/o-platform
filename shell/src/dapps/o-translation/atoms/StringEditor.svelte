<script lang="ts">
export let data = [];

$: {
    data;
}


</script>
<div class="table">
    <div class="table-header-group">
        <div class="table-cell p-1">String</div>
        <div class="table-cell p-1">Key</div>
        <div class="table-cell p-1">Language</div>
        <div class="table-cell p-1">Input</div>
    </div>
    {#each data as entry}
    <div class="table-row-group">
        <div class="table-cell break-all w-64 p-1">{entry.value}</div>
        <div class="table-cell break-all p-1">{entry.key}</div>
        <div class="table-cell p-1">{entry.lang}</div>
        <div class="table-cell p-1"><input class="input" type="text" placeholder={entry.value}></div>
        <button>Save</button>
    </div>
    {/each}
</div>

