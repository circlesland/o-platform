<script>
  import {toAddress, computeFlow} from "./utility";
  import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";

  let transferFrom;
  let transferTo = "0xb235B56b91eccb9DbdF811D7b5C45c363AcaE98D";
  let transferMaxValue = "9999999999999999999999999999";

  export let transfers = [];
  export let maxValue = 0;
  export let message = "";

  let compute = async function() {
    message = "Loading ...";
    try {
      let flow = await computeFlow(
              await toAddress(transferFrom.trim()),
              await toAddress(transferTo),
              transferMaxValue
      );
      maxValue = flow.flow;
      transfers = flow.transfers;
      message = "";
    } catch (e) {
      message = e.message;
    }
  };
</script>

<main class="w-full">
  <input
    bind:value={transferFrom}
    placeholder="enter circles safe address "
    class="w-full mb-4 input input-lg input-bordered"
  />


  {#if transferFrom && RpcGateway.get().utils.isAddress(transferFrom.trim())}
    <button class="btn btn-block btn-primary" on:click={compute}>Show now</button>
  {:else}
    <button class="btn btn-block btn-disabled" disabled on:click={compute}>Show now</button>
  {/if}

</main>
