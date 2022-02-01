<script lang="ts">
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { onMount } from "svelte";
import { createEventDispatcher } from "svelte";
import ButtonGroupContext from "./buttonGroupContext";
import Button from "../atoms/button/Button.svelte";

export let context: ButtonGroupContext;

const dispatch = createEventDispatcher();

function submit() {
  dispatch("submit");
}

console.log("BUTTON CONTEXT:", context);
</script>

{#if context}
  <div
    class="flex justify-center w-full"
    class:flex-col="{context.style == 'stack'}"
    class:space-y-4="{context.style == 'stack'}"
    class:flex-row="{context.style == 'inline'}"
    class:space-x-4="{context.style == 'inline'}">
    {#each context.buttons as button, i}
      <Button context="{button}" on:submit="{submit}" />
    {/each}
  </div>
{/if}
