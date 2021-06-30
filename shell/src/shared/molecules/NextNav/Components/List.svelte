<script lang="ts">
  import Icons from "./../../Icons.svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let icon: any = null;
  export let action: any = null;

  function openList() {
    dispatch("menuButton", {
      menuButton: "open",
      action: action,
    });
  }
</script>

<div
  class="w-24 h-12 px-5 py-3 bg-white rounded-full cursor-pointer sm:-mr-12"
  on:click={() => openList()}
>
  <div>
    <Icons {icon} />
  </div>
</div>
