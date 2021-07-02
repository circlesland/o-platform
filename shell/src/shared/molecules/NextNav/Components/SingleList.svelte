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

<div class="" on:click={() => openList()}>
  <Icons {icon} />
</div>
