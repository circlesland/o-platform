<script lang="ts">

import DetailActionBar from "../../../../shared/molecules/DetailActionBar.svelte";
import Icons from "../../../../shared/molecules/Icons.svelte";
import {
  InvitationRedeemed,
  ProfileEvent,
} from "../../../../shared/api/data/types";
import { JumplistItem } from "@o-platform/o-interfaces/dist/routables/jumplist";
import { onMount } from "svelte";

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
  values.actions = [];
});

function getValues(): {
  title: string;
  titleClass: string;
  text: string;
  icon: string;
  actions: JumplistItem[];
} {
  let icon = "trust";
  let title = "";
  let titleClass = "";
  let text = "";
  let actions: JumplistItem[] = [];

  const invitationRedeemed = <InvitationRedeemed>event.payload;
  title = `${invitationRedeemed.redeemedBy_profile.firstName} redeemed your invitation.`;

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
