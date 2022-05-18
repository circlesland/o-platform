<script lang="ts">
import { onMount } from "svelte";

import {
  AggregatesDocument,
  AggregateType,
  Erc721Token,
  Organisation,
  ProfileAggregate,
  ProfileBySafeAddressDocument,
  ProfileBySafeAddressQueryVariables,
  QueryAggregatesArgs,
} from "../../../shared/api/data/types";

import UserImage from "../../../shared/atoms/UserImage.svelte";
import { ApiClient } from "../../../shared/apiConnection";
import { me } from "../../../shared/stores/me";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import LoadingIndicator from "../../../shared/atoms/LoadingIndicator.svelte";
import Profile from "../../o-contacts/pages/Profile.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let loading = true;
let balances: Erc721Token[] = [];
let issuerProfile: Profile | Organisation;

onMount(async () => {
  const aggregates = await ApiClient.query<ProfileAggregate[], QueryAggregatesArgs>(AggregatesDocument, {
    types: [AggregateType.Erc721Tokens],
    safeAddress: $me.circlesAddress,
  });

  const erc721Balances: ProfileAggregate = aggregates.find((o) => o.type == AggregateType.Erc721Tokens);
  if (!erc721Balances || erc721Balances.payload.__typename !== AggregateType.Erc721Tokens) {
    throw new Error(`Couldn't find the Erc721Tokens in the query result.`);
  }

  issuerProfile = await ApiClient.query<Profile, ProfileBySafeAddressQueryVariables>(ProfileBySafeAddressDocument, {
    safeAddress: "0xf9342ea6f2585d8c2c1e5e78b247ba17c32af46a",
  });
  console.log("alskdjasld", issuerProfile);

  balances = erc721Balances.payload.balances;
  loading = false;
});
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto -mt-3 lg:w-4/5 ">
  {#if loading}
    <div class="p-5">
      <LoadingIndicator />
    </div>
  {/if}
  <div class="grid grid-cols-1 mb-10 gap-x-4 gap-y-8 auto-rows-fr marketplace-grid">
    {#if balances}
      {#each balances.reverse() as token}
        <section class="flex items-start pb-2 bg-white shadow-md rounded-xl">
          <div class="flex flex-col w-full ">
            <header class="rounded-t-xl headerImageContainer">
              <div class="relative rounded-t-xl image-wrapper">
                <img
                  src="{token.token_url ? token.token_url : '/images/market/circles-no-image.jpg'}"
                  alt=""
                  class="rounded-t-xl" />
                <div
                  class="absolute right-0 px-2 mt-2 text-lg rounded-l-full sm:text-xl lg:pb-2 lg:pt-3 lg:pl-4 lg:pr-2 lg:text-3xl font-heading top-2 bg-light-lightest">
                  {token.token_name} (#{token.token_no})
                </div>
              </div>
            </header>
            <div
              class="relative flex flex-row items-center content-start p-2 pt-4 pl-4 space-x-4 text-base font-medium text-left">
              <div class="inline-flex">
                <UserImage profile="{issuerProfile[0]}" size="{10}" gradientRing="{true}" />
              </div>
              <div>
                {issuerProfile ? issuerProfile[0].displayName : ""}
              </div>
            </div>
          </div>
        </section>
      {/each}
    {:else if !loading}
      No items
    {/if}
  </div>
</div>

<style>
/* Ensure image is always 16:9 Ratio */
.headerImageContainer {
  max-width: none;
}

.image-wrapper {
  position: relative;
  /* padding-bottom: 56.2%;b 16:9 */
  padding-bottom: 75%; /* 4:3 */
}

.image-wrapper img {
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
