<script lang="ts">
import { push } from "svelte-spa-router";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import {InvitationRedeemed, NewUser, Profile, ProfileEvent} from "../../../shared/api/data/types";
import { displayableName } from "../../../shared/functions/stringHelper";

export let param: Profile;
export let event: ProfileEvent;

$: {
  if (event && event.payload?.__typename == "InvitationRedeemed") {
    const payload = event.payload as InvitationRedeemed;
    param = payload.redeemedBy_profile;
  }
}

function loadDetailPage(path) {
  push(`#/contacts/profile/${path}`);
}
</script>

<div on:click="{() => loadDetailPage(param.circlesAddress)}">
  <ItemCard
    params="{{
      edgeless: false,
      imageProfile: param,
      title: param.displayName,
      subTitle: `Redeemed at: ${event.timestamp}`
    }}">
    <div slot="itemCardEnd">
      <div class="self-end text-lg sm:text-3xl"></div>
    </div>
  </ItemCard>
</div>
