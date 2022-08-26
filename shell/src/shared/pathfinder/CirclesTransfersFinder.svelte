<script>
  import { toAddress, computeFlow } from "./utility";
  import Label from "../../shared/atoms/Label.svelte";

  let transferFrom;
  let transferTo = "0xb235B56b91eccb9DbdF811D7b5C45c363AcaE98D";
  let transferMaxValue = "9999999999999999999999999999";

  export let transfers = [];
  export let maxValue = 0;

  let compute = async function() {
    let flow = await computeFlow(
      await toAddress(transferFrom),
      await toAddress(transferTo),
      transferMaxValue
    );
    maxValue = flow.flow;
    transfers = flow.transfers;
  };
</script>

<main class="w-full">
  <input
    bind:value={transferFrom}
    placeholder="enter circles safe address "
    class="w-full mb-4 input input-lg input-bordered"
  />

  <button class="btn btn-block btn-primary" on:click={compute}><Label key="shared.pathfinder.circlesTransferFinder.showNow"  /></button>

</main>
