<script lang="ts">
  import { push } from "svelte-spa-router";

  export let symbol: string;
  export let title: string;
  export let balance: string;
  export let variety: number;

  let pictureUrl: string;

  $: {
    pictureUrl = symbol;
  }

  function loadDetailPage() {
    push("#/banking/assets/" + symbol);
  }

</script>

<section
  class="flex items-center justify-center mb-2  "
  on:click={() => loadDetailPage()}
>
  <div class="flex flex-col bg-white shadow p-4 w-full space-y-2 rounded-sm">
    <div class="flex items-center bg-white w-full space-x-2 sm:space-x-6">
      <div class="mr-2 text-center">
        <div class="avatar">
          <div class="rounded-full w-12 h-12 sm:w-12 sm:h-12 m-auto">
            <img src="/logos/{symbol}.png" alt={symbol} class="w-12 h-12" />
          </div>
        </div>
      </div>

      <div class="text-left flex-grow truncate relative">
        <div class="max-w-full truncateThis cursor-pointer">
          <h2 class="text-2xl sm:text-3xl truncate ">
            {title}
            {variety > 1 ? " (" + variety + ")" : ""}
          </h2>
        </div>
      </div>

      <div class="flex flex-1 flex-col justify-items-end">
        <div class="self-end text-transactionpositive text-2xl sm:text-3xl">
          <span>
            {Number.parseFloat(balance).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  </div>
</section>
