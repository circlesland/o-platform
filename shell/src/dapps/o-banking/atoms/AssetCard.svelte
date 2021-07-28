<script lang="ts">
  import { push } from "svelte-spa-router";
  import Card from "src/shared/atoms/Card.svelte";
  import ItemCard from "../../../shared/atoms/ItemCard.svelte";

  export let symbol: string;
  export let title: string;
  export let balance: string;
  export let variety: number;
  export let description: string;

  let pictureUrl: string;

  $: {
    pictureUrl = symbol;
  }
</script>

<div on:click={() => push(`#/banking/assets/${symbol}`)}>
  <ItemCard
    params={{ edgeless: false, imageUrl: pictureUrl, title: title, subTitle: description, truncateMain: true, shadow: true }}
  >
    <div slot="itemCardStart">
      <div class="avatar">
        <div class="m-auto mt-1 rounded-full w-11 h-11 sm:w-12 sm:h-12">
          <img src="/logos/{symbol}.png" alt={symbol} class="w-12 h-12" />
        </div>
      </div>
    </div>
    <div slot="itemCardEnd">
      <div class="self-end text-right text-success">
        <span>{Number.parseFloat(balance).toFixed(2)}</span>
      </div>
      <div class="self-end text-xs text-dark-lightest whitespace-nowrap">
        {#if variety}{variety} different {title}{/if}
      </div>
    </div>

  </ItemCard>
</div>
