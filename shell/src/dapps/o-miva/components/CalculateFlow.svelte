<script lang="ts">
  import TransferGraph from "../../../shared/pathfinder/CirclesTransferGraph.svelte";
  import TransfersFinder from "../../../shared/pathfinder/CirclesTransfersFinder.svelte";

  import { formatValue } from "../../../shared/pathfinder/utility.js";

  let maxValue = "0";
  let transfers = [];
</script>

<div class="bg-background">
  <div
    class="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-2xl md:px-24 lg:px-8 lg:py-20"
  >
    <div class="mx-auto mb-2 text-center lg:max-w-2xl">
      <p
        class="inline-block px-3 py-px mb-4 text-sm tracking-wider uppercase r text-primary "
      >
        Calculate paymentpath
      </p>
      <h2
        class="max-w-lg mx-auto mb-6 text-3xl text-center font-heading sm:text-4xl sm:leading-none"
      >
        Display payment path to
        <br />
        Full Node
      </h2>
      <div class="mt-8">
        <TransfersFinder bind:maxValue bind:transfers />
      </div>
    </div>
  </div>
  <div class="w-full mx-auto text-center">
    <p
      class="inline-block px-3 py-px mb-4 text-xs tracking-wider uppercase rounded-full text-primary bg-teal-accent-400"
    >
      you can use up to
    </p>
    <h3
      class="max-w-lg mx-auto mb-6 text-3xl tracking-tight text-center font-heading sm:text-4xl sm:leading-none"
    >
      <div class="flex flex-row justify-center space-x-2">
        <div class="inline-block tracking-wide text-7xl font-heading">
          {formatValue(maxValue)}
        </div>
        <div class="self-center">
          <svg
            class="inline w-8 h-8 mt-2 -ml-3"
            viewBox="0 0 229 255"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M118.5 237C150.437 237 179.424 224.366 200.734 203.822C209.904
              197.627 215.933 187.136 215.933 175.236C215.933 156.198 200.499
              140.764 181.461 140.764C170.572 140.764 160.863 145.812 154.545
              153.695L154.457 153.627C145.313 163.112 132.476 169.012 118.261
              169.012C90.4957 169.012 67.9879 146.504 67.9879 118.739C67.9879
              90.9745 90.4957 68.4667 118.261 68.4667C132.339 68.4667 145.067
              74.254 154.193 83.5795L154.29 83.5037C160.581 90.2293 169.535
              94.4328 179.471 94.4328C198.51 94.4328 213.944 78.9988 213.944
              59.9601C213.944 48.1884 208.043 37.7949 199.039 31.5755C177.899
              11.9794 149.599 0 118.5 0C53.0543 0 0 53.0543 0 118.5C0 183.946
              53.0543 237 118.5 237Z"
              fill="currentColor"
            />
            <ellipse
              cx="118.979"
              cy="118.739"
              rx="26.5727"
              ry="26.3333"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </h3>
    <TransferGraph {transfers} />
  </div>
</div>
