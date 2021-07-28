<script>
  import { toAddress, computeFlow } from "./utility";

  let transferFrom;
  let transferTo = "0xb235B56b91eccb9DbdF811D7b5C45c363AcaE98D";
  let transferMaxValue;

  export let transfers = [];
  export let maxValue = 0;

  let compute = async function() {
    let flow = await computeFlow(
      await toAddress(transferFrom),
      await toAddress(transferTo),
      transferMaxValue - 0
    );
    maxValue = flow.flow;
    transfers = flow.transfers;
  };
</script>

<main class="w-full">
  <input
    bind:value={transferFrom}
    placeholder="enter your circles safe address here"
    class="w-full px-4 py-2 mb-6 text-2xl border border-gray-200 rounded-lg shadow-xl"
  />

  <button class="btn btn-block btn-primary" on:click={compute}>Show now</button>

</main>
