<script lang="ts">
import { push } from "svelte-spa-router";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import {NewUser, Profile, ProfileEvent} from "../../../shared/api/data/types";
import { displayableName } from "../../../shared/functions/stringHelper";

export let param: Profile;
export let event: ProfileEvent;

$: {
  if (event && event.payload?.__typename == "NewUser") {
    const newUser = event.payload as NewUser;
    param = newUser.profile;
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
      title: `${displayableName(param.firstName, param.lastName)} `,
      subTitle: 'verification unknown',
    }}">
    <div slot="itemCardEnd">
      <div class="self-end text-lg sm:text-3xl"></div>
    </div>
  </ItemCard>
</div>
