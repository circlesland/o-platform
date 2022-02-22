<script lang="ts">
import { push } from "svelte-spa-router";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import { Profile } from "../../../shared/api/data/types";
import { displayableName } from "../../../shared/functions/stringHelper";
import { onMount } from "svelte";
import { verification } from "../../o-verification.manifest";

export let param: Profile;

function loadDetailPage(path) {
  push(`#/contacts/profile/${path}`);
}
</script>

<div on:click="{() => loadDetailPage(param.circlesAddress)}">
  <ItemCard
    params="{{
      edgeless: false,
      imageProfile: param,
      title: displayableName(param.firstName, param.lastName),
      subTitle: console.log(param.verifications),
    }}">
    <div slot="itemCardEnd">
      <div class="self-end text-lg sm:text-3xl"></div>
    </div>
  </ItemCard>
</div>
