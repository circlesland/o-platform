<script lang="ts">
  import { getContext } from "svelte";
  import { createEventDispatcher } from "svelte";
  import Router, { push } from "svelte-spa-router";
  import Icons from "../molecules/Icons.svelte";

  const dispatch = createEventDispatcher();

  export let segment = null;
  export let title: string = null;
  export let external: boolean = false;
  const current = getContext("nav");

  function setSegment() {
    if (external) {
      window.open(segment, "_blank").focus();
      dispatch("navigate");
    } else {
      push(segment);
      dispatch("navigate");
    }
  }

</script>

<div
  on:click={setSegment}
  class:active={$current === segment}
  class="flex flex-row self-start space-x-10 cursor-pointer text-secondary"
>
  <div class="text-secondary">
    <Icons icon={title.toLowerCase()} />
  </div>
  <div>{title}</div>
</div>

<style>
  .active {
    @apply text-secondary;
  }

</style>
