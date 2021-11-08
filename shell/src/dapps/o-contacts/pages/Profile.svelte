<script lang="ts">
import { transfer } from "../../o-banking/processes/transfer";
import { setTrust } from "../../o-banking/processes/setTrust";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { invite } from "../../o-passport/processes/invite/invite";
import { getCountryName } from "../../../shared/countries";
import CopyClipBoard from "../../../shared/atoms/CopyClipboard.svelte";
import UserImage from "src/shared/atoms/UserImage.svelte";
import { upsertIdentity } from "../../o-passport/processes/upsertIdentity";
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
  CommonTrust,
  CommonTrustDocument,
  Membership,
  Profile,
} from "../../../shared/api/data/types";

export let id: string;
export let jumplist: Jumplist<any, any> | undefined;
export let runtimeDapp: RuntimeDapp<any>;

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
  if ($me) {
    inviteLink = `${window.location.protocol}//${window.location.host}/#/friends/${$me.id}`;
  }
}

let shellEventSubscription: Subscription;

onDestroy(() => shellEventSubscription.unsubscribe());

let isEditable: boolean = false;
let isLoading: boolean = true;
let isMe: boolean = false;
let name: string;

let commonTrusts: CommonTrust[] = [];
let profile: {
  id?: number;
  dream?: string;
  country?: string;
  safeAddress?: string;
  displayName: string;
  avatarUrl?: string;
  avatarCid?: string;
  avatarMimeType?: string;
  firstName?: string;
  lastName?: string;
  circlesAddress?: string;
  circlesSafeOwner?: string;
  cityGeonameid?: number;
  city: any;
  // The incoming trust limit
  trustsYou?: any;
  // The outgoing trust limit
  youTrust?: any;
  memberships: Membership[];
} = {};

async function loadProfile() {
  // console.log("LOADING PROFILE!!!");
  if (!id) {
    console.warn(
      `No profile specified ('id' must contain safeAddress or profileId)`
    );
    return;
  }

  if (Number.parseInt(id) && !id.startsWith("0x")) {
    const profile = await loadProfileByProfileId(Number.parseInt(id));
    await setProfile(profile);
  } else if (RpcGateway.get().utils.isAddress(id)) {
    const profile = await loadProfileBySafeAddress(id);
    await setProfile(profile);
  } else {
    throw new Error(`id isn't an integer nor an eth address.`);
  }
  isMe = profile.id == ($me ? $me.id : 0);
  isLoading = false;
  name = profile.safeAddress;

  // console.log("PROFILE: ", profile);
}

async function setProfile(apiProfile: Profile) {
  const trust = undefined;
  isEditable = $me && $me.id === apiProfile.id;

  if ($me.circlesAddress !== apiProfile.circlesAddress) {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const result = await apiClient.query({
      query: CommonTrustDocument,
      variables: {
        safeAddress1: $me.circlesAddress.toLowerCase(),
        safeAddress2: apiProfile.circlesAddress.toLowerCase(),
      },
    });
    if (result.errors) {
      throw new Error(
        `Couldn't load a profile with safeAddress '${
          apiProfile.circlesAddress
        }': ${JSON.stringify(result.errors)}`
      );
    }
    commonTrusts = result.data.commonTrust.filter((o) => o.profile);
  } else {
    commonTrusts = [];
  }

  profile = {
    id: apiProfile.id,
    avatarUrl: apiProfile.avatarUrl,
    dream: apiProfile.dream,
    country: apiProfile.country,
    safeAddress: apiProfile.circlesAddress,
    firstName: apiProfile.firstName,
    lastName: apiProfile.lastName,
    circlesAddress: apiProfile.circlesAddress,
    circlesSafeOwner: apiProfile.circlesSafeOwner,
    displayName: `${apiProfile.firstName} ${
      apiProfile.lastName ? apiProfile.lastName : ""
    }`,
    trusting: undefined,
    trustedBy: undefined,
    cityGeonameid: apiProfile.cityGeonameid,
    city: apiProfile.city,
    trustsYou: apiProfile.trustsYou ?? 0,
    youTrust: apiProfile.youTrust ?? 0,
    memberships: apiProfile.memberships,
  };
}

function execTransfer() {
  if (!profile || !$me.circlesAddress || isMe) return;

  window.o.runProcess(transfer, {
    safeAddress: $me.circlesAddress,
    recipientAddress: profile.safeAddress,
    recipientProfileId: profile.id,
  });
}

function execTrust() {
  if (!profile || !$me.circlesAddress || isMe) return;

  window.o.runProcess(setTrust, {
    safeAddress: $me.circlesAddress,
    trustLimit: 100,
    trustReceiver: profile.safeAddress,
    privateKey: sessionStorage.getItem("circlesKey"),
  });
}

function execUntrust() {
  if (!profile || !$me.circlesAddress || isMe) return;

  window.o.runProcess(setTrust, {
    safeAddress: $me.circlesAddress,
    trustLimit: 0,
    trustReceiver: profile.safeAddress,
    privateKey: sessionStorage.getItem("circlesKey"),
  });
}

function execInvite() {
  if (!profile || !$me.circlesAddress || !profile.id || isMe) return;

  window.o.runProcess(invite, {
    safeAddress: $me.circlesAddress,
    inviteProfileId: profile.id,
  });
}

const copy = () => {
  const app = new CopyClipBoard({
    target: document.getElementById("clipboard"),
    props: { name },
  });
  app.$destroy();
};

function editProfile(onlyThesePages?: string[]) {
  if (!profile || !profile.id || !isEditable) return;

  window.o.runProcess(upsertIdentity, profile, {}, onlyThesePages);
}

let inviteLink: string = "";
const copyInviteLink = () => {
  const app = new CopyClipBoard({
    target: document.getElementById("clipboardInviteLink"),
    props: { name: inviteLink },
  });
  app.$destroy();
};

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

        {#if profile && profile.safeAddress}
          <div class="mt-4 text-3xl">
            {profile.displayName
              ? profile.displayName.length >= 22
                ? profile.displayName.substr(0, 22) + "..."
                : profile.displayName
              : profile.safeAddress.substr(0, 22) + "..."}
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
          {#if !profile.safeAddress && !isMe}
            <section class="justify-center mb-2 ">
              <div
                class="flex flex-col w-full p-4 space-y-2 bg-white rounded-sm shadow">
                <div
                  class="text-left text-2xs text-dark-lightesttext-dark-lightest">
                  This citizen is waiting to be empowered by you.
                </div>

                {#if $me && $me.id !== profile.id && $me.circlesAddress}
                  <div class="flex items-center w-full space-x-2 sm:space-x-4">
                    <div class="w-full">
                      <button
                        class="h-auto btn btn-block btn-primary"
                        on:click="{execInvite}">
                        Invite {profile.displayName} now
                      </button>
                    </div>
                  </div>
                {:else}
                  <div class="flex items-center w-full space-x-2 sm:space-x-4">
                    <div class="text-left">
                      <div class="inline-block break-all">
                        <div
                          class="flex items-center w-full space-x-2 sm:space-x-4">
                          <!-- TODO: Safe wasn't opened before so we don't know our balance (at least not on $mySafe)  -->
                        </div>
                      </div>
                    </div>
                  </div>
                {/if}
              </div>
            </section>
          {/if}
          {#if !profile.safeAddress && isMe}
            <!-- Create safe  -->
            <section class="mb-8">
              <div class="w-full px-2 pb-4 -mt-3 bg-white rounded-sm shadow">
                <div class="px-4 py-2 mr-4 -ml-3 text-center "></div>
                <div style="text-align: center">
                  <p class="w-64 m-auto mt-2 text-2xl font-bold text-gradient">
                    You're almost there.
                  </p>
                  <p class="mt-4 text">
                    Copy the invite link and send it to someone who's already a
                    citizen of CirclesLand:
                  </p>
                  <div
                    class="mt-4 mb-4 text-xs break-all"
                    id="clipboardInviteLink">
                    <input
                      type="text"
                      class="hidden"
                      bind:value="{inviteLink}" />
                    <div class="inline-block text-2xl">
                      <button
                        class="btn btn-primary"
                        on:click="{copyInviteLink}">
                        Copy Invite Link
                      </button>
                    </div>

                    <div class="block mt-2 text-sm text-light ">
                      {inviteLink}
                    </div>
                  </div>
                  <p class="text">
                    If you don't know anybody who has Circles yet, ask nicely in
                    our
                    <a
                      href="https://discord.gg/33bPcyF5JN"
                      target="_blank"
                      class="btn-link">
                      Discord
                    </a>
                    if someone can invite you.
                  </p>
                  <p class="pb-4 mt-4 text-xs">
                    alternatively,
                    <a href="#/dashboard/become-a-hub" class="btn-link">
                      become a hub
                    </a>
                  </p>
                  <div class="mr-1 text-primary"></div>
                </div>
              </div>
            </section>
          {/if}

          {#if profile && profile.safeAddress}
            {#if profile.youTrust || profile.trustsYou}
              <section class="justify-center mb-2 ">
                <div class="flex flex-col w-full pt-2 space-y-1">
                  <div class="text-left text-2xs text-dark-lightest">Trust</div>
                  <div class="flex flex-wrap content-start">
                    {#if profile.youTrust > 0 && profile.trustsYou > 0}
                      mututal trust
                    {:else if !profile.youTrust && profile.trustsYou > 0}
                      is trusting you
                    {:else if profile.youTrust > 0 && !profile.trustsYou}
                      you are trusting
                    {/if}
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
            <section class="justify-center mb-2 ">
              <div class="flex flex-col w-full pt-2 space-y-1">
                <div class="text-left text-2xs text-dark-lightest">
                  Member at
                </div>
                <div class="flex flex-row flex-wrap mt-2 ">
                  {#if profile.memberships.length}
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
                  {:else}
                    No memberships
                  {/if}
                </div>
              </div>
            </section>
            {#if profile && profile.dream}
              <section class="justify-center mb-2 ">
                <div class="flex flex-col w-full pt-2 space-y-1">
                  <div class="text-left text-2xs text-dark-lightest">
                    Passion
                  </div>

                  <div class="flex items-center w-full text-lg">
                    {profile.dream}
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

            <!-- <section class="justify-center mb-2 ">
              <div class="flex flex-col w-full py-2 space-y-1">
                <div class="mb-1 text-left text-2xs text-dark-lightest">
                  Address
                </div>

                <div class="flex items-center w-full">
                  <div class="inline-block break-all" id="clipboard">
                    {#if profile}
                      <input
                        name="name"
                        type="text"
                        class="hidden"
                        bind:value="{name}" />
                      {profile.safeAddress ? profile.safeAddress : ''}
                    {/if}
                    <div
                      class="relative inline-block text-primary cursor-pointertext-center -bottom-1"
                      on:click="{copy}"
                      alt="Copy to Clipboard">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 stroke-current transform
                        group-hover:rotate-[-4deg] transition"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0
                          002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0
                          002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </section> -->
          {/if}

          {#if !isMe && (profile.trusting || profile.trustedBy)}
            <section class="justify-center">
              <div class="flex flex-col w-full py-2 space-y-1">
                <div class="mb-1 text-left text-2xs text-dark-lightest">
                  Trust
                </div>

                <div class="flex items-center w-full">
                  {#if profile.trusting && profile.trustedBy}
                    You are trusting {profile.displayName}
                    {profile.trusting}%
                    <br />
                    {profile.displayName} is trusting you {profile.trustedBy}%
                  {:else if profile.trusting && !profile.trustedBy}
                    You are trusting {profile.displayName} {profile.trusting}%
                  {:else if !profile.trusting && profile.trustedBy}
                    {profile.displayName} is trusting you {profile.trustedBy}%
                  {/if}
                </div>
              </div>
            </section>
          {/if}

          {#if !isMe && profile.safeAddress}
            <section class="justify-center">
              <div class="flex flex-col w-full pt-2 space-y-1">
                <div class="mb-1 text-left text-2xs text-dark-lightest">
                  Address
                </div>

                <div class="flex items-center w-full text-2xs">
                  {profile.safeAddress}
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
