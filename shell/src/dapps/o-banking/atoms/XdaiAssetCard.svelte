<script lang="ts">
  export let symbol: string;
  export let balance: string;
  export let title: string;
  export let address: String;

  let pictureUrl: string;
  let classes: String;

  $: {
    pictureUrl = symbol;
  }

</script>

<section class="flex items-center justify-center mb-2  ">
  <div class="flex flex-col bg-white shadow p-4 w-full space-y-2 rounded-sm">
    <div class="flex items-center bg-white w-full space-x-2 sm:space-x-6">
      <div class="mr-2 text-center">
        <div class="avatar">
          <div class="rounded-full w-12 h-12 sm:w-12 sm:h-12 m-auto">
            <img src="/logos/{symbol}.png" alt="xdai" class="w-12 h-12" />
          </div>
        </div>
      </div>
      <div class="text-left flex-grow truncate relative">
        <div class="truncateThis">
          <h2 class="text-2xl sm:text-3xl">
            {title}
          </h2>
        </div>
        <p class="text-sm mt-2 text-light">{address}</p>
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
