<script lang="ts">
import { Currency } from "../../../shared/currency";
import { me } from "../../stores/me";

import { CrcMinting, ProfileEvent } from "../../api/data/types";

import { _ } from "svelte-i18n";

export let event: ProfileEvent;

let payload: CrcMinting = <CrcMinting>event.payload;
</script>

<div class="mt-1 text-sm text-center text-dark-lightest">{$_("shared.melecules.notificationViewer.molecules.notificationViewUbi.caChing")}</div>

<div class="self-center text-6xl text-center text-success font-heading">
  +{Currency.instance().displayAmount(
    payload.value,
    event.timestamp,
    $me.displayCurrency
  )}

  <span class=" font-primary"
    >{Currency.currencySymbol[$me.displayCurrency]}</span>
</div>
