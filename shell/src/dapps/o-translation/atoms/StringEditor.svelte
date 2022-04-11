<script lang="ts">
export let data = [];

$: {
    data;
}


</script>
<div class="table">
    <div class="table-header-group">
        <div class="table-cell">String</div>
        <div class="table-cell">Key</div>
        <div class="table-cell">Language</div>
        <div class="table-cell">Input</div>
    </div>
    {#each data as entry}
    <div class="table-row-group">
        <div class="table-cell break-all w-64 p-1">{entry.value}</div>
        <div class="table-cell break-all">{entry.key}</div>
        <div class="table-cell">{entry.lang}</div>
        <div class="table-cell"><input type="text" placeholder={entry.value}></div>
        <button>Save</button>
    </div>
    {/each}
</div>

