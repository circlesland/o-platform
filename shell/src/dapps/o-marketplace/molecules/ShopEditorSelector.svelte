<script lang="ts">
import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();

export let shopIndex;
export let shops;

const selectShop = () => {
  dispatch("indexChange", shopIndex);
  localStorage.setItem("editShopIndex", shopIndex);
};
</script>

<div class="flex flex-col justify-center mb-20 space-y-4">
  <select class="self-center max-w-xs select" bind:value="{shopIndex}" on:change="{selectShop}">
    <option disabled selected>Select a Shop</option>

    {#each shops as shop, i}
      <option value="{i}">Shop: {shop.name}</option>
    {/each}
  </select>
</div>
