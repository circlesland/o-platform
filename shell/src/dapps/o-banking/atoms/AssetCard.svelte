<script lang="ts">
  import { push } from "svelte-spa-router";
  import Card from "src/shared/atoms/Card.svelte";

  export let symbol: string;
  export let title: string;
  export let balance: string;
  export let variety: number;

  let pictureUrl: string;

  $: {
    pictureUrl = symbol;
  }
</script>

<section
  class="flex items-center justify-center mb-2 "
  on:click={() => push(`#/banking/assets/${symbol}`)}
>
  <Card>
    <div class="flex items-center w-full space-x-2 bg-white sm:space-x-6">
      <div class="mr-2 text-center">
        <div class="avatar">
          <div class="w-12 h-12 m-auto rounded-full sm:w-12 sm:h-12">
            <img src="/logos/{symbol}.png" alt={symbol} class="w-12 h-12" />
          </div>
        </div>
      </div>

      <div class="relative flex-grow text-left truncate">
        <div class="max-w-full cursor-pointer truncateThis">
          <h2 class="text-2xl truncate sm:text-3xl ">
            {title} {variety > 1 ? ' (' + variety + ')' : ''}
          </h2>
        </div>
      </div>

      <div class="flex flex-col flex-1 justify-items-end">
        <div class="self-end text-2xl text-primary sm:text-3xl">
          <span>{Number.parseFloat(balance).toFixed(2)}</span>
        </div>
      </div>
    </div>
  </Card>
</section>
