<script lang="ts">
import { displayCirclesAmount } from "src/shared/functions/displayCirclesAmount";
import { me } from "../../stores/me";
import Icons from "src/shared/molecules/Icons.svelte";
import { CrcMinting, ProfileEvent } from "../../api/data/types";
export let event: ProfileEvent;
let payload: CrcMinting = <CrcMinting>event.payload;
</script>

<div class="mt-1 text-sm text-center text-dark-lightest">Ca-ching!</div>

<div class="self-center text-6xl text-center text-success font-heading">
  +{displayCirclesAmount(
    payload.value,
    event.timestamp,
    $me.displayTimeCircles || $me.displayTimeCircles === undefined
  )}
  <Icons icon="circlessimple" size="10" />
</div>
