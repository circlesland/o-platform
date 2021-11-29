<script lang="ts">
import DetailActionBar from "../../../../shared/molecules/DetailActionBar.svelte";
import Icons from "../../../../shared/molecules/Icons.svelte";
import {
  CrcHubTransfer,
  ProfileEvent,
} from "../../../../shared/api/data/types";
import { displayCirclesAmount } from "../../../../shared/functions/displayCirclesAmount";
import { me } from "../../../../shared/stores/me";
import { JumplistItem } from "@o-platform/o-interfaces/dist/routables/jumplist";
import { onMount } from "svelte";
import { banking } from "../../../o-banking.manifest";

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
      id: event.contact_address
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
    title = `${
      event.contact_address_profile.firstName
    } sent you ${displayCirclesAmount(
      hubTransfer.flow,
      null,
      true,
      ($me && $me.displayTimeCircles !== undefined ? $me.displayTimeCircles : true) || ($me && $me.displayTimeCircles !== undefined ? $me.displayTimeCircles : true) === undefined
    )} CRC`;
  } else {
    title = ` You sent ${displayCirclesAmount(
      hubTransfer.flow,
      null,
      true,
      ($me && $me.displayTimeCircles !== undefined ? $me.displayTimeCircles : true) || ($me && $me.displayTimeCircles !== undefined ? $me.displayTimeCircles : true) === undefined
    )} CRC to ${event.contact_address_profile.firstName}`;
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
<div class="mt-4">
  <DetailActionBar actions="{values.actions}" />
</div>
