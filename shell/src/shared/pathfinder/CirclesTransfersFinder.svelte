<script>
import { toAddress, computeFlow } from './utility';


let transferFrom;
let transferTo = "0x580816b8bEb4D1bca5b48Af07Cd989b6fFed6904";
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
    <input bind:value={transferFrom} placeholder="enter here you circles safe address" class="w-full px-4 py-2 mb-6 text-2xl border border-gray-200 rounded-lg shadow-xl"><br>
    <button
        class="btn btn-block btn-primary"
        on:click={compute}
    >
 
        Calculate amount
    </button>                                                     

</main>

<style>
</style>