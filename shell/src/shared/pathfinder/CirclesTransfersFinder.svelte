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

<main>
    <h1>Computer Transfers</h1>
    <input bind:value={transferFrom} placeholder="from">
    <button on:click={compute}>compute</button>
</main>

<style>
</style>