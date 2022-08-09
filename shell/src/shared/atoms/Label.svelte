<script lang="ts">
  import Label from "../../../shared/atoms/Label.svelte";
  export let key: string;
  </script>
  <div data-i18n-key="{key}">{@html $_(`${key}`)}</div>