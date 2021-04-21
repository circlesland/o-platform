<script lang="ts">
  import { onMount } from "svelte";
  import { showToast } from "../toast";

  export let name;

  let textarea;

  onMount(() => {
    textarea.select();
    document.execCommand("copy");
    showToast("success", "Copied to Clipboard!");
  });
</script>

<textarea bind:value={name} bind:this={textarea} />
