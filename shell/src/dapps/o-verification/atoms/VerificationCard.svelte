<script lang="ts">
import { push } from "svelte-spa-router";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import {Verification} from "../../../shared/api/data/types";
import {displayableName} from "../../../shared/functions/stringHelper";

export let param: Verification;

function loadDetailPage(path) {
  push(`#/verification/${path}`);
}
</script>

<div on:click="{() => loadDetailPage(param.verifiedSafeAddress)}">
  <ItemCard
          params="{{
            edgeless: false,
            imageProfile: param.verifiedProfile,
            title: displayableName(param.verifiedProfile.firstName, param.verifiedProfile.lastName),
            subTitle: `Verified by ${param.verifierProfile.name} at ${param.createdAt}`,
            truncateMain: true
          }}">

    <div slot="itemCardEnd">
      <div class="self-end text-lg sm:text-3xl"></div>
    </div>
  </ItemCard>
</div>
