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

<div
  class="w-24 h-12 px-12 py-3 bg-white rounded-full cursor-pointer sm:-ml-12"
  on:click={() => loadLink()}
>
  <div>
    <Icons {icon} />
  </div>
</div>
