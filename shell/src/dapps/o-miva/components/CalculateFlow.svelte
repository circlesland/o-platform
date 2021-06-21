<script lang="ts">
  import TransferGraph from "../../../shared/pathfinder/CirclesTransferGraph.svelte";
  import TransfersFinder from "../../../shared/pathfinder/CirclesTransfersFinder.svelte";

  import { formatValue } from "../../../shared/pathfinder/utility.js";

  let maxValue = "0";
  let transfers = [];

</script>

<div class="bg-gray-50">
  <div
    class="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-2xl md:px-24 lg:px-8 lg:py-20"
  >
    <div class="mx-auto mb-10 lg:max-w-2xl sm:text-center">
      <p
        class="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider uppercase rounded-full text-primary bg-teal-accent-400"
      >
        Calculate paymentpath
      </p>
      <h2
        class="max-w-lg mx-auto mb-6 text-3xl font-bold tracking-tight text-center   sm:text-4xl sm:leading-none"
      >
        Check your maximum amount of Circles
      </h2>
      <p class="text-xl text-gray-600">
        that you can use to buy MIVA Supertoken
      </p>
      <div class="mt-8">
        <TransfersFinder bind:maxValue bind:transfers />
      </div>
    </div>
  </div>
  <div class="w-full mx-auto text-center">
    <p
      class="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider uppercase rounded-full text-primary bg-teal-accent-400"
    >
      you can use up to
    </p>
    <h3
      class="max-w-lg mx-auto mb-6 text-3xl font-bold tracking-tight text-center   sm:text-4xl sm:leading-none"
    >
      {formatValue(maxValue)} Circles
    </h3>
    <TransferGraph {transfers} />
  </div>
</div>
