<script lang="ts">
  import { getContext } from "svelte";
  import { createEventDispatcher } from "svelte";
  import Router, { push } from "svelte-spa-router";
  import Icons from "../molecules/Icons.svelte";

  const dispatch = createEventDispatcher();

  export let segment = null;
  export let title: string = null;
  export let external: boolean = false;
  export let clickOnly: boolean = false;
  const current = getContext("nav");

  function setSegment() {
    if (clickOnly) {
      dispatch("navigate");
      return;
    }
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
  class="flex flex-row self-start w-full space-x-10 cursor-pointer"
>
  <div class="">
    <Icons icon={title.toLowerCase()} />
  </div>
  <div>{title}</div>
</div>
