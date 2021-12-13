<script lang="ts">
import { push } from "svelte-spa-router";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import {
  ContactDirection,
  ContactPoint,
  ContactPointSource,
} from "../../../shared/api/data/types";
import { onMount } from "svelte";

export let contact: ContactPoint;

let displayName: string;
let safeAddress: string;
let message: string;

onMount(() => {
  displayName = `${contact.contactAddress_Profile.firstName} ${
    contact.contactAddress_Profile.lastName
      ? contact.contactAddress_Profile.lastName
      : ""
  }`;

  safeAddress = contact.contactAddress;
  message = "";

  const trustMetadata: ContactPointSource = contact.metadata.find(
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

  if (trustIn > 0 && trustOut > 0) {
    message += "mutual trust";
  } else if (!trustIn && trustOut > 0) {
    message += "trusted by you";
  } else if (trustIn > 0 && !trustOut) {
    message += "is trusting you";
  } else {
    message += "not trusted";
  }
});

function loadDetailPage(path) {
  push(`#/contacts/profile/${path}`);
}

function execTransfer(recipientAddress?: string) {
  /*
    window.o.runProcess(transfer, {
      recipientAddress,
      safeAddress: tryGetCurrentSafe()?.safeAddress,
      privateKey: sessionStorage.getItem("circlesKey"),
    });
     */
}

function goToProfile(e, path?: string) {
  if (!path) return;
  e.stopPropagation();
  push(`#/contacts/profile/${path}`);
  return false;
}
</script>

<div on:click="{() => loadDetailPage(safeAddress)}">
  <ItemCard
    params="{{
      edgeless: false,
      imageProfile: contact.contactAddress_Profile,
      title: displayName,
      subTitle: message,
      truncateMain: true,
    }}">
    <div slot="itemCardEnd">
      <div class="self-end text-lg sm:text-3xl"></div>
    </div>
  </ItemCard>
</div>
