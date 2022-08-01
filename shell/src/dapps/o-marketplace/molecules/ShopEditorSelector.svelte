<script lang="ts">
import { createEventDispatcher } from "svelte";
import { onMount } from "svelte";

const dispatch = createEventDispatcher();

export let shopIndex;
export let shops;
let selectedIndex = 0;

onMount(() => {
  selectedIndex = parseInt(shopIndex) || 0;
});

const selectShop = () => {
  dispatch("indexChange", selectedIndex);
  localStorage.setItem("editShopIndex", selectedIndex.toString());
};
</script>

{#if selectedIndex !== undefined}
  <div class="flex flex-col justify-center mb-20 space-y-4">
    <select class="self-center max-w-xs select" bind:value="{selectedIndex}" on:change="{selectShop}">
      <option disabled selected>Select a Shop</option>

      {#each shops as shop, i}
        <option value="{i}">Shop: {shop.name}</option>
      {/each}
    </select>
  </div>
{/if}
