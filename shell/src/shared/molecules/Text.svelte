<script lang="ts">
    export let params: {
        text: string
    };
</script>
{params ? params.text : window.o.i18n("shared.molecules.text.noText")}