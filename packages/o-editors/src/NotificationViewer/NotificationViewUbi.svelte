<script lang="ts">
import { displayCirclesAmount } from "src/shared/functions/displayCirclesAmount";
import {me} from "../../../../shell/src/shared/stores/me";
import Icons from "src/shared/molecules/Icons.svelte";
export let eventData: any;

console.log(eventData);
</script>

<div class="self-center text-6xl text-success font-heading">
  +{displayCirclesAmount(eventData.value, eventData.time,  $me.displayTimeCircles || $me.displayTimeCircles === undefined)}
  <Icons icon="circlessimple" size="10" />
</div>

<div class="mt-1 text-sm text-center text-dark-lightest">Ca-ching!</div>
