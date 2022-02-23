<script lang="ts">
import NotificationProfile from "./NotificationProfile.svelte";
import { Currency } from "../../../shared/currency";
import { CrcHubTransfer, ProfileEvent } from "../../api/data/types";
import { me } from "../../stores/me";
import { _ } from "svelte-i18n";

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
    +{Currency.instance().displayAmount(
      payload.flow,
      event.timestamp,
      $me.displayCurrency
    )}

    <span class=" font-primary"
      >{Currency.currencySymbol[$me.displayCurrency]}</span>
  </div>
  <div class="self-center pb-2 text-2xl text-center font-heading">{$_("shared.melecules.notificationViewer.molecules.notificationViewTransfer.from")}</div>
  <div class="pb-4">
    <NotificationProfile profile="{payload.from_profile}" />
  </div>

  {#if message}
    <div class="w-full m-auto text-center text-dark-lightest">
      {message}
    </div>
  {/if}
</div>
