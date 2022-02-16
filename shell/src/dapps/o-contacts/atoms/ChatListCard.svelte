<script lang="ts">
import { push } from "svelte-spa-router";
import { Currency } from "../../../shared/currency";
import { displayCirclesAmount } from "../../../shared/functions/displayCirclesAmount";
import { me } from "../../../shared/stores/me";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import {
  Contact,
  ContactDirection,
  ContactPoint,
  EventType,
  Profile,
} from "../../../shared/api/data/types";
import DateView from "../../../shared/atoms/Date.svelte";

import { _ } from "svelte-i18n";

export let param: Contact;

let displayName: string;
let message: string;
let contactProfile: Profile;

// God Help us all...
if (param.contactAddress_Profile) {
  contactProfile = param.contactAddress_Profile;
} else {
  contactProfile = {
    id: 0,
    firstName: param.contactAddress,
    circlesAddress: param.contactAddress,
  };
}

displayName =
  contactProfile.firstName +
  (contactProfile.lastName ? " " + contactProfile.lastName : "");
displayName =
  displayName.length >= 28 ? displayName.substr(0, 28) + "..." : displayName;

const trustMetadata: ContactPoint = param.metadata.find(
  (p) => p.name === "CrcTrust"
);
let trustIn = 0;
let trustOut = 0;
if (trustMetadata) {
  trustMetadata.directions.forEach((d, i) => {
    if (d == ContactDirection.In) {
      trustIn = parseInt(trustMetadata.values[i]);
    } else if (d == ContactDirection.Out) {
      trustOut = parseInt(trustMetadata.values[i]);
    }
  });
}
let trustStatus = `${$_("dapps.o-contacts.atoms.chatListCard.trustStatus")}`;
if (trustIn > 0 && trustOut > 0) {
  trustStatus = `${$_("dapps.o-contacts.atoms.chatListCard.mutualTrust")}`;
} else if (!trustIn && trustOut > 0) {
  trustStatus = `${$_("dapps.o-contacts.atoms.chatListCard.trustedByYou")}`;
} else if (trustIn > 0 && !trustOut) {
  trustStatus = `${$_("dapps.o-contacts.atoms.chatListCard.isTrustingYou")}`;
} else {
  trustStatus = `${$_("dapps.o-contacts.atoms.chatListCard.notTrusted")}`;
}

const unixTimestamp = parseInt(param.lastContactAt);
const jsonTimestamp = new Date(unixTimestamp).toJSON();
const mostRecentContactPoint: ContactPoint = param.metadata.find(
  (o: ContactPoint) => o.timestamps.find((o) => o == param.lastContactAt)
);
const mostRecentIndex = mostRecentContactPoint.timestamps.indexOf(
  param.lastContactAt
);
const mostRecentDirection = mostRecentContactPoint.directions[mostRecentIndex];
const mostRecentValue = mostRecentContactPoint.values[mostRecentIndex];

const mostRecentDisplayEvent = {
  type: mostRecentContactPoint.name,
  direction: mostRecentDirection,
  value: mostRecentValue,
};

if (mostRecentDisplayEvent.direction == ContactDirection.In) {
  switch (mostRecentDisplayEvent.type) {
    case EventType.CrcTrust:
      message = `${displayName} ${
        mostRecentDisplayEvent.value > 0 ? `${$_("dapps.o-contacts.atoms.chatListCard.trusted")}` : `${$_("dapps.o-contacts.atoms.chatListCard.untrusted")}`
      } ${$_("dapps.o-contacts.atoms.chatListCard.you")}`;
      break;
    case EventType.CrcHubTransfer:
      message = `${displayName} ${$_("dapps.o-contacts.atoms.chatListCard.sentYou")} ${Currency.instance().displayAmount(
        mostRecentDisplayEvent.value,
        null,
        "EURS"
      )} ${Currency.currencySymbol[$me.displayCurrency]} €`;
      break;
    case EventType.Erc20Transfer:
      message = `${displayName} ${$_("dapps.o-contacts.atoms.chatListCard.sentYou")} ${displayCirclesAmount(
        mostRecentDisplayEvent.value,
        null,
        false
      )} ${$_("dapps.o-contacts.atoms.chatListCard.tokens")}`;
      break;
    case EventType.ChatMessage:
      message = `${displayName} ${$_("dapps.o-contacts.atoms.chatListCard.wrote")} ${mostRecentDisplayEvent.value}`;
      break;
    case EventType.InvitationRedeemed:
      message = `${displayName} ${$_("dapps.o-contacts.atoms.chatListCard.redeemedYourInvitation")}`;
      break;
    case EventType.MembershipOffer:
      message = `${displayName} ${$_("dapps.o-contacts.atoms.chatListCard.invitedYouTo")} ${mostRecentDisplayEvent.value}`;
      break;
  }
} else {
  switch (mostRecentDisplayEvent.type) {
    case EventType.CrcTrust:
      message = `${$_("dapps.o-contacts.atoms.chatListCard.You")} ${
        mostRecentDisplayEvent.value > 0 ? `${$_("dapps.o-contacts.atoms.chatListCard.trusted")}` : `${$_("dapps.o-contacts.atoms.chatListCard.untrusted")}`
      } ${displayName}`;
      break;
    case EventType.CrcHubTransfer:
      message = `${$_("dapps.o-contacts.atoms.chatListCard.youSent")} ${displayName} 
      ${Currency.instance().displayAmount(
        mostRecentDisplayEvent.value,
        null,
        "EURS"
      )} €`;
      break;
    case EventType.Erc20Transfer:
      message = `${$_("dapps.o-contacts.atoms.chatListCard.youSent")} ${displayName}
      ${displayCirclesAmount(
        mostRecentDisplayEvent.value,
        null,
        true,
        false
      )} ${$_("dapps.o-contacts.atoms.chatListCard.token")}`;
      break;
    case EventType.ChatMessage:
      message = `${$_("dapps.o-contacts.atoms.chatListCard.youWrote")} ${mostRecentDisplayEvent.value}`;
      break;
    case EventType.InvitationRedeemed:
      message = `${displayName} ${$_("dapps.o-contacts.atoms.chatListCard.invitedYouToCirclesLand")}`;
      break;
    case EventType.MembershipOffer:
      message = `${$_("dapps.o-contacts.atoms.chatListCard.youInvited")} ${displayName} ${$_("dapps.o-contacts.atoms.chatListCard.to")} ${mostRecentDisplayEvent.value}`;
      break;
  }
}

// displayName += ` | ${trustStatus}`;

function loadDetailPage(path) {
  push(`#/contacts/chat/${path}`);
}

function goToProfile(e, path?: string) {
  if (!path) return;
  e.stopPropagation();
  push(`#/contacts/profile/${path}`);
}
</script>

<!-- on:click|stopPropagation="{() => loadDetailPage(param.contactAddress)}" -->
<div class="cursor-pointer">
  <ItemCard
    params="{{
      edgeless: false,
      imageProfile: param.contactAddress_Profile,
      title: displayName,
      subTitle: message,
      action: () => loadDetailPage(param.contactAddress),
      profileLink: true,
      mobileTextCutoff: 24,
    }}">
    <div slot="itemCardEndSmallElement">
      {#if param.timestamp}
        <DateView time="{jsonTimestamp}" />
      {/if}
    </div>
  </ItemCard>
</div>
