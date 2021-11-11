<script lang="ts">
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { getCountryName } from "../../../shared/countries";
import UserImage from "src/shared/atoms/UserImage.svelte";
import { me } from "../../../shared/stores/me";
import LoadingIndicator from "../../../shared/atoms/LoadingIndicator.svelte";
import { onDestroy, onMount } from "svelte";
import { Subscription } from "rxjs";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import DetailActionBar from "../../../shared/molecules/DetailActionBar.svelte";
import { Jumplist } from "@o-platform/o-interfaces/dist/routables/jumplist";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { loadProfileByProfileId } from "../../../shared/api/loadProfileByProfileId";
import { loadProfileBySafeAddress } from "../../../shared/api/loadProfileBySafeAddress";
import {
  AggregatesDocument,
  AggregateType,
  CommonTrust,
  CommonTrustDocument,
  Membership,
  Contact,
  ContactPointSource,
  ContactDirection,
  Profile,
} from "../../../shared/api/data/types";

export let id: string;
export let jumplist: Jumplist<any, any> | undefined;
export let runtimeDapp: RuntimeDapp<any>;

let error: string | undefined = undefined;
let displayName: string;
let trustMessage: string;
let isLoading: boolean = true;
let isMe: boolean = false;
let commonTrusts: CommonTrust[] = [];
let profile: Profile;
let contact: Contact;

onMount(() => {
  shellEventSubscription = window.o.events.subscribe(
    async (event: PlatformEvent) => {
      if (event.type != "shell.refresh" || (<any>event).dapp != "banking:1") {
        return;
      }
      await loadProfile();
      // console.log("AWAIT LOADPRO");
    }
  );

  if (id) {
    isLoading = true;
    // console.log("LOADPRO IF CONTEXT");
    loadProfile();
  }
});

$: {
  if (id) {
    isLoading = true;
    // console.log("LOADPRO NOCHMAL");
    loadProfile();
  }
}

let shellEventSubscription: Subscription;

onDestroy(() => shellEventSubscription.unsubscribe());

async function loadProfile() {
  // console.log("LOADING PROFILE!!!");
  if (!id) {
    console.warn(
      `No profile specified ('id' must contain safeAddress or profileId)`
    );
    return;
  }
  // Load Contact
  const safeAddress = $me.circlesAddress.toLowerCase();
  const apiClient = await window.o.apiClient.client.subscribeToResult();

  const c = await apiClient.query({
    query: AggregatesDocument,
    variables: {
      types: [AggregateType.Contacts],
      safeAddress: safeAddress,
      filter: {
        contacts: {
          addresses: [id],
        },
      },
    },
  });

  if (c.errors?.length > 0) {
    error = `Couldn't read the contacts of safe ${safeAddress}: \n${c.errors
      .map((o) => o.message)
      .join("\n")}`;
    return;
  }

  const contact: Contact = c.data.aggregates[0].payload.contacts.length
    ? c.data.aggregates[0].payload.contacts[0]
    : null;

  // Load Profile
  if (Number.parseInt(id) && !id.startsWith("0x")) {
    let apiProfile: Profile | Contact = await loadProfileByProfileId(
      Number.parseInt(id)
    );
    apiProfile = contact ? contact : apiProfile;
    await setProfile(apiProfile);
  } else if (RpcGateway.get().utils.isAddress(id)) {
    let apiProfile: Profile | Contact = await loadProfileBySafeAddress(id);
    apiProfile = contact ? contact : apiProfile;
    await setProfile(apiProfile);
  } else {
    throw new Error(`id isn't an integer nor an eth address.`);
  }

  isMe = profile.id == ($me ? $me.id : 0);
  isLoading = false;
}

async function setProfile(apiProfile: Profile | Contact) {
  const trust = undefined;

  console.log("PROFFF", apiProfile.__typename);
  if (apiProfile.__typename == "Contact") {
    contact = apiProfile;
  } else {
    contact = {
      contactAddress: apiProfile.circlesAddress,
      contactAddress_Profile: {
        id: apiProfile.id,
        avatarUrl: apiProfile.avatarUrl,
        dream: apiProfile.dream,
        country: apiProfile.country,
        firstName: apiProfile.firstName,
        lastName: apiProfile.lastName,
        city: apiProfile.city,
        memberships: apiProfile.memberships,
      },
      metadata: null,
      lastContactAt: null,
    };
  }

  if ($me.circlesAddress !== contact.contactAddress) {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const result = await apiClient.query({
      query: CommonTrustDocument,
      variables: {
        safeAddress1: $me.circlesAddress.toLowerCase(),
        safeAddress2: contact.contactAddress.toLowerCase(),
      },
    });
    if (result.errors) {
      throw new Error(
        `Couldn't load a profile with safeAddress '${
          contact.contactAddress
        }': ${JSON.stringify(result.errors)}`
      );
    }
    commonTrusts = result.data.commonTrust.filter((o) => o.profile);
  } else {
    commonTrusts = [];
  }

  displayName = contact.contactAddress_Profile.firstName
    ? contact.contactAddress_Profile.firstName +
      (contact.contactAddress_Profile.lastName
        ? " " + contact.contactAddress_Profile.lastName
        : "")
    : contact.contactAddress;
  displayName =
    displayName.length >= 22 ? displayName.substr(0, 22) + "..." : displayName;

  profile = contact.contactAddress_Profile;

  if (contact.metadata) {
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
      trustMessage = "mutual trust";
    } else if (!trustIn && trustOut > 0) {
      trustMessage = "trusted by you";
    } else if (trustIn > 0 && !trustOut) {
      trustMessage = "is trusting you";
    } else {
      trustMessage = "not trusted";
    }
  }
}

async function getJumplist() {
  const jumpListItems = await jumplist.items({ id: id }, runtimeDapp);
  return jumpListItems;
}

let promise = getJumplist();
</script>

{#if isLoading}
  <div class="p-5">
    <LoadingIndicator />
  </div>
{:else}
  <div class="p-5 pb-0">
    <header class="grid overflow-hidden bg-white h-72 ">
      <div class="w-full text-center">
        <h1 class="text-3xl uppercase font-heading">PROFILE</h1>
      </div>
      <div
        class="flex flex-col items-center self-center w-full m-auto text-center justify-self-center ">
        <UserImage
          profile="{profile}"
          size="{36}"
          gradientRing="{true}"
          profileLink="{false}" />

        {#if profile && contact.contactAddress}
          <div class="mt-4 text-3xl">
            {displayName}
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
          {#if profile}
            {#if trustMessage}
              <section class="justify-center mb-2 ">
                <div class="flex flex-col w-full pt-2 space-y-1">
                  <div class="text-left text-2xs text-dark-lightest">Trust</div>
                  <div class="flex flex-wrap content-start">
                    {trustMessage}
                  </div>
                </div>
              </section>
            {/if}
            <section class="justify-center mb-2 ">
              <div class="flex flex-col w-full pt-2 space-y-1">
                <div class="text-left text-2xs text-dark-lightest">
                  Mutual Friends
                </div>
                <div class="flex flex-row flex-wrap mt-2 ">
                  {#if commonTrusts.length}
                    {#each commonTrusts as commonTrust}
                      {#if commonTrust.profile}
                        <div class="mt-2 mr-2">
                          <UserImage
                            profile="{commonTrust.profile}"
                            tooltip="{true}"
                            gradientRing="{true}" />
                        </div>
                      {/if}
                    {/each}
                  {:else}
                    No mutual friends
                  {/if}
                </div>
              </div>
            </section>
            {#if profile.memberships.length}
              <section class="justify-center mb-2 ">
                <div class="flex flex-col w-full pt-2 space-y-1">
                  <div class="text-left text-2xs text-dark-lightest">
                    Member at
                  </div>
                  <div class="flex flex-row flex-wrap mt-2 ">
                    {#each profile.memberships as membership}
                      {#if membership.organisation}
                        <div class="mt-2 mr-2">
                          <UserImage
                            profile="{membership.organisation}"
                            tooltip="{true}"
                            gradientRing="{true}" />
                        </div>
                      {/if}
                    {/each}
                  </div>
                </div>
              </section>
            {/if}
            {#if profile && profile.dream}
              <section class="justify-center mb-2 ">
                <div class="flex flex-col w-full pt-2 space-y-1">
                  <div class="text-left text-2xs text-dark-lightest">
                    Passion
                  </div>

                  <div class="flex items-center w-full text-lg">
                    {profile.dream}
                  </div>
                </div>
              </section>
            {/if}
          {/if}

          {#if !isMe && contact.contactAddress}
            <section class="justify-center">
              <div class="flex flex-col w-full pt-2 space-y-1">
                <div class="mb-1 text-left text-2xs text-dark-lightest">
                  Address
                </div>

                <div class="flex items-center w-full text-2xs">
                  {contact.contactAddress}
                </div>
              </div>
            </section>
          {/if}
        </div>
      </div>

      {#if jumplist && !isMe}
        <div class="sticky bottom-0 left-0 right-0 w-full pb-5 bg-white">
          {#await promise}
            <p>...loading</p>
          {:then jumpListItems}
            <DetailActionBar actions="{jumpListItems}" />
          {/await}
        </div>
      {/if}
    </div>
  </div>
{/if}
