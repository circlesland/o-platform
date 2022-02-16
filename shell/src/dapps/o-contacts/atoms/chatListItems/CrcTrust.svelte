<script lang="ts">
import DetailActionBar from "../../../../shared/molecules/DetailActionBar.svelte";
import Icons from "../../../../shared/molecules/Icons.svelte";
import { CrcTrust, ProfileEvent } from "../../../../shared/api/data/types";
import { JumplistItem } from "@o-platform/o-interfaces/dist/routables/jumplist";
import { onMount } from "svelte";
import { contacts } from "../../../o-contacts.manifest";

import { _ } from "svelte-i18n";

export let event: ProfileEvent;

let values: {
  title: string;
  titleClass: string;
  icon: string;
  actions: JumplistItem[];
};

values = getValues();

onMount(async () => {
  values.actions = await contacts.jumplist.items(
    {
      id: event.direction == "in" ? event.contact_address : event.safe_address,
    },
    null
  );
});

function getValues(): {
  title: string;
  titleClass: string;
  icon: string;
  actions: JumplistItem[];
} {
  let icon = `${$_("dapps.o-contacts.atoms.chatListItems.crcTrust.getValues.icon")}`;
  let title = `${$_("dapps.o-contacts.atoms.chatListItems.crcTrust.getValues.title")}`;
  let titleClass = `${$_("dapps.o-contacts.atoms.chatListItems.crcTrust.getValues.titleClass")}`;
  let actions: JumplistItem[] = [];

  const crcTrust = <CrcTrust>event.payload;

  if (event.direction == "in" && crcTrust.limit == 0) {
    title = `${event.contact_address_profile.firstName} ${$_("dapps.o-contacts.atoms.chatListItems.crcTrust.getValues.untrustedYou")}`;
    titleClass = "text-alert";
  } else if (event.direction == "in" && crcTrust.limit > 0) {
    title = `${event.contact_address_profile.firstName} ${$_("dapps.o-contacts.atoms.chatListItems.crcTrust.getValues.trustedYou")}`;
  } else if (event.direction == "out" && crcTrust.limit == 0) {
    title = `${$_("dapps.o-contacts.atoms.chatListItems.crcTrust.getValues.youUntrusted")} ${event.contact_address_profile.firstName}`;
    titleClass = "text-alert";
  } else if (event.direction == "out" && crcTrust.limit > 0) {
    title = `${$_("dapps.o-contacts.atoms.chatListItems.crcTrust.getValues.youTrusted")} ${event.contact_address_profile.firstName}`;
  }

  return {
    title,
    titleClass,
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
