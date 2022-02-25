<script lang="ts">
import { Organisation } from "../../../shared/api/data/types";

import LoadingIndicator from "../../../shared/atoms/LoadingIndicator.svelte";
import UserImage from "../../../shared/atoms/UserImage.svelte";
import { me } from "../../../shared/stores/me";
import { loadOrganisationsBySafeAddress } from "../../../shared/api/loadOrganisationsBySafeAddress";
import { getCountryName } from "../../../shared/countries";
import { onMount } from "svelte";
import ContactCard from "../../o-contacts/atoms/ContactCard.svelte";
import { _ } from "svelte-i18n";

export let id: string;

let isLoading = true;
let profile: Organisation;
let isMe: boolean;
let name: string;
let isEditable: boolean = false;

async function loadProfile() {
  if (!id) {
    console.warn(
      `No organisation specified ('id' must contain the circlesAddress of an organisation)`
    );
    return;
  }

  const organisations = await loadOrganisationsBySafeAddress([id]);
  if (organisations.length == 1) {
    await setOrganisation(organisations[0]);
  } else {
    console.warn(
      `None or multiple organisations found for safe address '${id}'.`
    );
    return;
  }

  isMe = profile.id == ($me ? $me.id : 0);
  isLoading = false;
  name = profile.name ?? profile.circlesAddress;
}

async function setOrganisation(apiProfile: Organisation) {
  const trust = undefined;

  profile = apiProfile;
}

onMount(() => loadProfile());

function editProfile() {}
</script>

{#if isLoading}
  <div class="p-5">
    <LoadingIndicator />
  </div>
{:else}
  <div class="p-5">
    <header class="grid overflow-hidden bg-white h-72 ">
      <div class="w-full text-center">
        <h1 class="text-3xl uppercase font-heading">
          {$_("dapps.o-verification.pages.verificationDetail.profile")}
        </h1>
      </div>
      <div
        class="flex flex-col items-center self-center w-full m-auto text-center justify-self-center ">
        <UserImage
          profile="{profile}"
          size="{36}"
          gradientRing="{true}"
          profileLink="{false}" />

        {#if profile && profile.circlesAddress}
          <div class="mt-4 text-3xl">
            {profile.name ? profile.name : profile.circlesAddress}
          </div>
        {/if}
        {#if profile && profile.city}
          <div class="mt-1 text-sm text-dark-lightest">
            {profile.city ? profile.city.name : ""}

            {profile.city
              ? ", " + profile.city.country
              : ", " + getCountryName(profile)}
          </div>
        {/if}
      </div>
    </header>
    <div class="flex flex-col">
      <div class="mt-4">
        <div class="">
          {#if profile && profile.circlesAddress}
            {#if profile.trustsYou}
              <section class="justify-center mb-2 ">
                <div class="flex flex-col w-full pt-2 space-y-1">
                  <div class="text-left text-2xs text-dark-lightest">
                    {$_("dapps.o-verification.pages.verificationDetail.trust")}
                  </div>
                  <div class="flex flex-wrap content-start">
                    {#if profile.trustsYou > 0}
                      {$_(
                        "dapps.o-verification.pages.verificationDetail.isTrustingYou"
                      )}
                    {/if}
                  </div>
                </div>
              </section>
            {/if}

            <section class="justify-center mb-2 ">
              <div class="flex flex-col w-full pt-2 space-y-1">
                <div class="text-left text-2xs text-dark-lightest">
                  {$_(
                    "dapps.o-verification.pages.verificationDetail.description"
                  )}
                </div>

                <div class="flex items-center w-full text-lg">
                  {#if profile && profile.description}{profile.description}{/if}
                  {#if isEditable}
                    <button
                      class="link link-primary text-primary text-2xs"
                      on:click="{() => editProfile({ dream: true })}">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3 h-3"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          d="M13.586 3.586a2 2 0 112.828
                          2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3
                          14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                      </svg>
                    </button>
                  {/if}
                </div>
              </div>
            </section>
          {/if}

          {#if !isMe && profile.circlesAddress}
            <section class="justify-center">
              <div class="flex flex-col w-full pt-2 space-y-1">
                <div class="mb-1 text-left text-2xs text-dark-lightest">
                  {$_("dapps.o-verification.pages.verificationDetail.address")}
                </div>

                <div class="flex items-center w-full text-2xs">
                  {profile.circlesAddress}
                </div>
              </div>
            </section>
          {/if}

          <section class="justify-center">
            <div class="flex flex-col w-full pt-2 space-y-1">
              <div class="mb-1 text-left text-2xs text-dark-lightest">
                {$_("dapps.o-verification.pages.verificationDetail.members")}
              </div>

              <div class="flex items-center w-full text-2xs">
                {#each profile.members as member}
                  <ContactCard contact="{{ contactAddressProfile: member }}" />
                {/each}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
{/if}
