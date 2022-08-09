<script lang="ts">
import DetailActionBar from "../../../../shared/molecules/DetailActionBar.svelte";
import Icons from "../../../../shared/molecules/Icons.svelte";
import { Erc20Transfer, ProfileEvent } from "../../../../shared/api/data/types";
import { displayCirclesAmount } from "../../../../shared/functions/displayCirclesAmount";
import { JumplistItem } from "@o-platform/o-interfaces/dist/routables/jumplist";
import { onMount } from "svelte";
import { banking } from "../../../o-banking.manifest";

import { _ } from "svelte-i18n";

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

  const transfer = <Erc20Transfer>event.payload;

  if (event.direction == "in") {
    title = `${
      event.contact_address_profile.firstName
    } ${$_("dapps.o-contacts.atoms.chatListItems.erc20Transfer.getValues.ifIn.title.sentYou")} ${displayCirclesAmount(
      transfer.value,
      null,
      true,
      false
    )} ${$_("dapps.o-contacts.atoms.chatListItems.erc20Transfer.getValues.ifIn.title.tokens")}`;
  } else {
    title = ` ${$_("dapps.o-contacts.atoms.chatListItems.erc20Transfer.getValues.ifOut.youSent")} ${displayCirclesAmount(
      transfer.value,
      null,
      true,
      false
    )} ${$_("dapps.o-contacts.atoms.chatListItems.erc20Transfer.getValues.ifOut.tokensTo")} ${event.contact_address_profile.firstName}`;
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

<div
  class="flex flex-row items-center content-center space-x-3 {values.titleClass}">
  <Icons icon="{values.icon}" />
  <h1 class="uppercase font-heading">{values.title}</h1>
</div>
<div class="mt-2">
  {values.text}
</div>
