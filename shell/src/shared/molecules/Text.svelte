<script lang="ts">
    export let params: {
        text: string
    };
</script>
{params ? params.text : ">> No text <<"}