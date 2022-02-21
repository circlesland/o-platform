<script lang="ts">
import { push } from "svelte-spa-router";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import { Verification } from "../../../shared/api/data/types";
import { displayableName } from "../../../shared/functions/stringHelper";
import dayjs from "dayjs";

export let param: Verification;

function loadDetailPage(path) {
  push(`#/contacts/profile/${path}`);
}
</script>

<div on:click="{() => loadDetailPage(param.verifiedSafeAddress)}">
  <ItemCard
    params="{{
      edgeless: false,
      imageProfile: param.verifiedProfile,
      title: displayableName(
        param.verifiedProfile.firstName,
        param.verifiedProfile.lastName
      ),
      subTitle: window.i18n("dapps.o-verification.atoms.verificationCard.subdtitle", { values: { name: param.verifierProfile.name, date: dayjs(param.createdAt).format('DD.MM.YYYY')}}),
      truncateMain: true,
    }}">
    <div slot="itemCardEnd">
      <div class="self-end text-lg sm:text-3xl"></div>
    </div>
  </ItemCard>
</div>
`Verified by ${param.verifierProfile.name} on ${dayjs(
  param.createdAt
).format('DD.MM.YYYY')}`