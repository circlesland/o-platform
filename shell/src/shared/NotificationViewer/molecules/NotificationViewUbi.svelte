<script lang="ts">
import { Currency } from "../../../shared/currency";
import { me } from "../../stores/me";
import Icons from "../../../shared/molecules/Icons.svelte";
import { CrcMinting, ProfileEvent } from "../../api/data/types";

import Label from "../../../shared/atoms/Label.svelte";

export let event: ProfileEvent;

let payload: CrcMinting = <CrcMinting>event.payload;

let amountTime = Currency.instance()
  .displayAmount(payload && payload.value ? payload.value.toString() : "0", event.timestamp, "TIME_CRC", null)
  .toString();
</script>

<div class="mt-1 text-sm text-center text-dark-lightest">
  <Label key="shared.molecules.notificationViewer.molecules.notificationViewUbi.caChing" />
</div>

<div class="self-center text-6xl text-center text-success font-heading">
  +{Currency.instance().displayAmount(payload.value, event.timestamp, $me.displayCurrency)}

  <span class=" font-primary">{Currency.currencySymbol[$me.displayCurrency]}</span>
</div>
{#if amountTime}
  <div class="self-center text-center">
    <div class="justify-self-center text-dark-dark">
      {amountTime}

      <Icons icon="timeCircle" size="{4}" customClass="inline" />
    </div>
  </div>
{/if}
