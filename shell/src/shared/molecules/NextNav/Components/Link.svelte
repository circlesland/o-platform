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
  class="w-24 h-12 px-12 py-3 -ml-6 bg-white rounded-full cursor-pointer xs:-ml-10 sm:-ml-12"
  on:click={() => loadLink()}
>
  <div class="pl-2 xs:pl-0">
    <Icons {icon} />
  </div>
</div>
