<script lang="ts">
  import DetailActionBar from "../../../../shared/molecules/DetailActionBar.svelte";
  import Icons from "../../../../shared/molecules/Icons.svelte";
  import {
    InvitationRedeemed,
    ProfileEvent,
  } from "../../../../shared/api/data/types";
  import { JumplistItem } from "@o-platform/o-interfaces/dist/routables/jumplist";
  import { onMount } from "svelte";

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
    values.actions = [];
  });

  function getValues(): {
    title: string;
    titleClass: string;
    text: string;
    icon: string;
    actions: JumplistItem[];
  } {
    let icon = `${$_("dapps.o-contacts.atoms.chatListItems.invitationRedeemed.getValues.icon")}`;
    let title = `${$_("dapps.o-contacts.atoms.chatListItems.invitationRedeemed.getValues.title")}`;
    let titleClass = `${$_("dapps.o-contacts.atoms.chatListItems.invitationRedeemed.getValues.titleClass")}`;
    let text = `${$_("dapps.o-contacts.atoms.chatListItems.invitationRedeemed.getValues.text")}`;
    let actions: JumplistItem[] = [];

    const invitationRedeemed = <InvitationRedeemed>event.payload;
    title = `${invitationRedeemed.redeemedBy_profile.firstName} ${$_("dapps.o-contacts.atoms.chatListItems.invitationRedeemed.getValues.invitationRedeemed.title")}`

    return {
      title,
      titleClass,
      text,
      icon,
      actions,
    };
  }
</script>

<div class="flex flex-row items-center content-center space-x-3 {values.titleClass}">
    <Icons icon="{values.icon}" />
    <h1 class="uppercase font-heading">{values.title}</h1>
</div>
<div class="mt-2">
    {values.text}
</div>
<div class="mt-4">
    <DetailActionBar actions="{values.actions}" />
</div>
