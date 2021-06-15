<script lang="ts">
  import { push } from "svelte-spa-router";
  import Icons from "./../../Icons.svelte";

  export let icon: any = null;
  export let link: string = null;

  function loadLink() {
    if (link) {
      push(link);
    }
  }

</script>

<div on:click={() => loadLink()} class="cursor-pointer">
  <Icons {icon} />
</div>
