<script lang="ts">
  import Icons from "./../../Icons.svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let icon: any = null;

  function openList() {
    dispatch("menuButton", {
      menuButton: "open",
    });
  }

</script>

<div on:click={() => openList()}>
  <Icons {icon} />
</div>
