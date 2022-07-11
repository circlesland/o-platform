<script lang="ts">
import DetailActionBar from "../../../../shared/molecules/DetailActionBar.svelte";
import Icons from "../../../../shared/molecules/Icons.svelte";
import { Currency } from "../../../../shared/currency";
import {
  CrcHubTransfer,
  ProfileEvent,
} from "../../../../shared/api/data/types";
import { displayCirclesAmount } from "../../../../shared/functions/displayCirclesAmount";
import { me } from "../../../../shared/stores/me";
import { JumplistItem } from "@o-platform/o-interfaces/dist/routables/jumplist";
import { onMount } from "svelte";
import { banking } from "../../../o-banking.manifest";

import { _ } from "svelte-i18n";
import TransactionCard from "../../../o-banking/atoms/TransactionCard.svelte";

export let event: ProfileEvent;

let values: {
  title: string;
  titleClass: string;
  text: string;
  icon: string;
  actions: JumplistItem[];
};

values = getValues();

onMount(async () => {
  values.actions = await banking.jumplist.items(
    {
      id: event.contact_address,
    },
    null
  );
});

function getValues(): {
  title: string;
  titleClass: string;
  text: string;
  icon: string;
  actions: JumplistItem[];
} {
  let icon = "sendmoney";
  let title = "";
  let titleClass = "";
  let text = "";
  let actions: JumplistItem[] = [];

  const hubTransfer = <CrcHubTransfer>event.payload;
  const messageTag = hubTransfer.tags.find(
    (o) => o.typeId === "o-banking:transfer:message:1"
  );
  if (messageTag) {
    text = messageTag.value;
  }

  if (event.direction == "in") {
    title = `${event.contact_address_profile.firstName} ${$_(
      "dapps.o-contacts.atoms.chatListItems.crcHubTransfer.getValues.ifIn"
    )} ${Currency.instance().displayAmount(
      hubTransfer.flow,
      null,
      $me.displayCurrency
    )} ${Currency.currencySymbol[$me.displayCurrency]}`;
  } else {
    title = ` ${$_(
      "dapps.o-contacts.atoms.chatListItems.crcHubTransfer.getValues.ifOut.youSent"
    )} ${Currency.instance().displayAmount(
      hubTransfer.flow,
      null,
      $me.displayCurrency
    )} ${Currency.currencySymbol[$me.displayCurrency]} ${$_(
      "dapps.o-contacts.atoms.chatListItems.crcHubTransfer.getValues.ifOut.to"
    )} ${event.contact_address_profile.firstName}`;
  }

  return {
    title,
    titleClass,
    text,
    icon,
    actions,
  };
}
</script>

<TransactionCard event="{event}" />
