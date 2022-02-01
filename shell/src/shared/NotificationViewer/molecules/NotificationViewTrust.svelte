<script lang="ts">
import { onMount } from "svelte";
import NotificationProfile from "./NotificationProfile.svelte";
import NotificationViewMutualFriends from "./NotificationViewMutualFriends.svelte";
import ProcessNavigation from "@o-platform/o-editors/src/ProcessNavigation.svelte";
import { NotificationViewerContext } from "@o-platform/o-editors/src/notificationViewerContext";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { CrcTrust, ProfileEvent } from "../../api/data/types";
import { setTrust } from "../../../dapps/o-banking/processes/setTrust";
import { UserActions, UserActionItem } from "../../../shared/userActions";
import { createEventDispatcher } from "svelte";
import ButtonContext from "../../atoms/button/buttonContext";
import ButtonGroupContext from "../../molecules/buttonGroupContext";
import ButtonGroup from "../../molecules/ButtonGroup.svelte";

export let event: ProfileEvent;
export let context: NotificationViewerContext;

const dispatch = createEventDispatcher();

let payload: CrcTrust = <CrcTrust>event.payload;
let userActions: UserActionItem[];
let buttonGroup: ButtonGroupContext;

function submit() {
  dispatch("submit");
}

onMount(async () => {
  userActions = await UserActions.getSingleAction(
    event.contact_address_profile,
    "setTrust"
  );

  console.log("useract: ", userActions[0]);
  let trustbutton: ButtonContext = {
    label: `Trust ${event.contact_address_profile.firstName}  `,
    color: "primary",
    action: async () => await userActions[0].action(),
  };

  let dismissButton: ButtonContext = {
    label: "Dismiss",
    color: "light",
    action: async () => dispatch("submit"),
  };

  buttonGroup = {
    style: "inline",
    buttons: [dismissButton, trustbutton],
  };

  console.log("ACTII: ", userActions);
  context.params.view.submitButtonText = "Trust Back";
});
</script>

<div class="flex flex-col space-y-4">
  <NotificationProfile
    profile="{event.contact_address_profile}"
    showPassion="{false}" />

  {#if payload.limit == 0}
    <div class="text-center text-dark-lightest">
      {event.contact_address_profile
        ? event.contact_address_profile.firstName
        : event.contact_address_profile.circlesAddress} has removed their trust to
      you.
    </div>
  {:else}
    <div class="text-center text-dark-lightest">
      {event.contact_address_profile
        ? event.contact_address_profile.firstName
        : event.contact_address_profile.circlesAddress} is trusting you now.
    </div>
  {/if}
</div>
<!-- <div class="pt-4">
  <ButtonGroup context="{buttonGroup}" on:submit="{submit}" />
</div> -->

<!-- <ProcessNavigation on:buttonClick="{submit}" context="{context}" /> -->
<!-- <NotificationViewMutualFriends eventData="{eventData}" /> -->
