<script lang="ts">
import NotificationProfile from "./NotificationProfile.svelte";
import NotificationViewMutualFriends from "./NotificationViewMutualFriends.svelte";
import { displayCirclesAmount } from "src/shared/functions/displayCirclesAmount";
import { CrcHubTransfer, ProfileEvent } from "../../api/data/types";
import Icons from "src/shared/molecules/Icons.svelte";
import { me } from "../../stores/me";

export let event: ProfileEvent;

let payload: CrcHubTransfer = <CrcHubTransfer>event.payload;
let message: string;

if (payload) {
  message = payload.tags?.find(
    (o) => o.typeId === "o-banking:transfer:message:1"
  )?.value;
}
</script>

<div class="flex flex-col space-y-4">
  <div class="self-center text-6xl text-center text-success font-heading">
    +{displayCirclesAmount(
      payload.flow,
      event.timestamp,
      ($me && $me.displayTimeCircles !== undefined ? $me.displayTimeCircles : true) || ($me && $me.displayTimeCircles !== undefined ? $me.displayTimeCircles : true) === undefined
    )}
    <Icons icon="circlessimple" size="10" />
  </div>

  <div class="self-center pb-2 text-2xl text-center font-heading">from</div>
  <div class="pb-4">
    <NotificationProfile profile="{payload.from_profile}" />
  </div>

  {#if message}
    <div class="w-full m-auto text-center text-dark-lightest">
      {message}
    </div>
  {/if}
</div>

<!-- <NotificationViewMutualFriends eventData="{eventData}" /> -->
