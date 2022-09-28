<script>
	import AdjacencyGraph from './CirclesAdjacencyGraph.svelte';
	import TransferGraph from './CirclesTransferGraph.svelte';
	import TransfersFinder from './CirclesTransfersFinder.svelte';

	import { formatValue } from './utility.js';
	import Label from "../../../shared/atoms/Label.svelte";
	import { _ } from "svelte-i18n"; 

	let maxValue = '0';
	let transfers = [];
</script>

<main>
	<TransfersFinder bind:maxValue={maxValue} bind:transfers={transfers}></TransfersFinder>
	<hr/>
	<p>{$_("shared.pathfinder.app.visualizingFlowOf", { values: { flow: formatValue(maxValue)}})}</p>
	<TransferGraph transfers={transfers}></TransferGraph>
	<AdjacencyGraph></AdjacencyGraph>
	<hr/>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>