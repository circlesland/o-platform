<script lang="ts">
import NotificationProfile from "./NotificationProfile.svelte";
import { Currency } from "../../../shared/currency";
import { CrcHubTransfer, ProfileEvent } from "../../api/data/types";
import Icons from "../../../shared/molecules/Icons.svelte";
import { me } from "../../stores/me";
import { _ } from "svelte-i18n";
import Label from "../../atoms/Label.svelte";

export let event: ProfileEvent;

let payload: CrcHubTransfer = <CrcHubTransfer>event.payload;
let message: string;

if (payload) {
  message = payload.tags?.find(
    (o) => o.typeId === "o-banking:transfer:message:1"
  )?.value;
}
let amountTime = Currency.instance()
  .displayAmount(
    payload && payload.flow ? payload.flow.toString() : "0",
    event.timestamp,
    "TIME_CRC",
    null
  )
  .toString();
</script>

<div class="flex flex-col">
  <div class="self-center text-6xl text-center text-success font-heading">
    +{Currency.instance().displayAmount(
      payload.flow,
      event.timestamp,
      $me.displayCurrency
    )}

    <span class=" font-primary"
      >{Currency.currencySymbol[$me.displayCurrency]}</span>
  </div>
  {#if amountTime}
    <div class="self-center text-center">
      <div class="justify-self-center text-dark-dark">
        {amountTime}
        <Icons icon="timeCircle" size="{4}" customClass="inline" />
      </div>
    </div>
  {/if}
  <div class="self-center pb-2 mt-4 text-2xl text-center font-heading">
    <Label key="shared.molecules.notificationViewer.molecules.notificationViewTransfer.from"></Label>
  </div>
  <div class="pb-4">
    <NotificationProfile profile="{payload.from_profile}" />
  </div>

  {#if message}
    <div class="w-full m-auto text-center text-dark-lightest">
      {message}
    </div>
  {/if}
</div>
