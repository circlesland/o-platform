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
  on:click="{setSegment}"
  class="flex flex-col items-center flex-grow py-2 text-xs text-center rounded-lg cursor-pointer bg-light-lighter">
  <div class="text-center">
    <Icons {icon} />
  </div>
  <span class="block mt-2 text-3xs sm:text-sm">{title}</span>
</div>
