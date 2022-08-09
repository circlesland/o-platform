<script lang="ts">
  import { _ } from "svelte-i18n";
  export let key: string;
  </script>
  <div data-i18n-key="{key}">{@html $_(`${key}`)}</div>