<script lang="ts">
  import { push } from "svelte-spa-router";
  import ItemCard from "../../../shared/atoms/ItemCard.svelte";
  import {Organisation} from "../../../shared/api/data/types";

  export let organisation: Organisation;

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

<div on:click="{() => loadDetailPage(organisation.circlesAddress)}">
  <ItemCard
    params="{{ edgeless: false, imageProfile: organisation, title: organisation.name, subTitle: organisation.circlesAddress, truncateMain: true }}">

    <div slot="itemCardEnd">
      <div class="self-end text-lg sm:text-3xl"></div>
    </div>
  </ItemCard>
</div>
