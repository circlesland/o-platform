<script lang="ts">
  import TransferGraph from '../../../shared/pathfinder/CirclesTransferGraph.svelte';
  import TransfersFinder from '../../../shared/pathfinder/CirclesTransfersFinder.svelte';

  import { formatValue } from '../../../shared/pathfinder/utility.js';

  let maxValue = '0';
  let transfers = [];
</script>

<main>
  <TransfersFinder bind:maxValue={maxValue} bind:transfers={transfers}></TransfersFinder>
  <hr/>
  <p>Visualizing flow of {formatValue(maxValue)}</p>
  <TransferGraph transfers={transfers}></TransferGraph>
  <hr/>
</main>
