<script lang="ts">
import { _ } from "svelte-i18n";
export let key: string;
</script>

<span data-i18n-key="{key}">{@html $_(`${key}`)}</span>
