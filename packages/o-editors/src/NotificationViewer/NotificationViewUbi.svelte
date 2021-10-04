<script lang="ts">
import { displayCirclesAmount } from "src/shared/functions/displayCirclesAmount";
import Icons from "src/shared/molecules/Icons.svelte";
export let eventData: any;
</script>

<div class="self-center text-6xl text-success font-heading">
  +{displayCirclesAmount(eventData.value)}
  <Icons icon="circlessimple" size="10" />
</div>

<div class="mt-1 text-sm text-center text-dark-lightest">Ca-ching!</div>
