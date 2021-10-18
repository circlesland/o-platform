<script lang="ts">
import { push } from "svelte-spa-router";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import { Organisation } from "../../../shared/api/data/types";

export let param: Organisation;

function loadDetailPage(path) {
  push(`#/coops/${path}`);
}

function goToProfile(e, path?: string) {
  if (!path) return;
  e.stopPropagation();
  push(`#/friends/${path}`);
  return false;
}
</script>

<div on:click="{() => loadDetailPage(param.circlesAddress)}">
  <ItemCard
    params="{{
      edgeless: false,
      imageProfile: param,
      title: param.name,
      subTitle: param.circlesAddress,
      truncateMain: true,
    }}">
    <div slot="itemCardEnd">
      <div class="self-end text-lg sm:text-3xl"></div>
    </div>
  </ItemCard>
</div>
