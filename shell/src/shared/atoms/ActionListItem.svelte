<script lang="ts">
  import { getContext } from "svelte";
  import { createEventDispatcher } from "svelte";
  import Router, { push } from "svelte-spa-router";
  import Icons from "../molecules/Icons.svelte";

  const dispatch = createEventDispatcher();

  export let segment = null;
  export let title: string = null;
  export let icon: string = null;
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
      push("/" + segment);
      dispatch("navigate");
    }
  }
</script>

<div
  on:click={setSegment}
  class="flex-grow flex flex-col items-center text-xs text-center cursor-pointer
  "
>
  <div class="text-center">
    <Icons {icon} />
  </div>
  <span class="block mt-2">{title}</span>
</div>
