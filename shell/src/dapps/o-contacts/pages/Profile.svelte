<script lang="ts">
import { getCountryName } from "../../../shared/countries";
import UserImage from "src/shared/atoms/UserImage.svelte";
import { me } from "../../../shared/stores/me";
import LoadingIndicator from "../../../shared/atoms/LoadingIndicator.svelte";
import DetailActionBar from "../../../shared/molecules/DetailActionBar.svelte";
import { showToast } from "../../../shared/toast";

import {
  Capability,
  CapabilityType,
  CommonTrust,
  CommonTrustDocument,
  CommonTrustQueryVariables,
  Contact,
  ContactDirection,
  ContactPoint,
  EventType,
  Profile,
  VerifySafeDocument,
  RevokeSafeVerificationDocument,
} from "../../../shared/api/data/types";
import { contacts } from "../../../shared/stores/contacts";
import { ApiClient } from "../../../shared/apiConnection";
import { getSessionInfo } from "../../o-passport/processes/identify/services/getSessionInfo";
import { isMobile } from "../../../shared/functions/isMobile";
import { UserActions, UserActionItem } from "../../../shared/userActions";

import { _ } from "svelte-i18n";

export let id: string;

export let capabilities: Capability[] | undefined;

let error: string | undefined = undefined;
let displayName: string;
let trustMessage: string;
let isLoading: boolean = true;
let isMe: boolean = false;
let commonTrusts: CommonTrust[] = [];
let profile: Profile;
let contact: Contact;

let detailActions: UserActionItem[];

$: {
  isLoading = true;
  setProfile(id).then(() => (isLoading = false));
}

async function setProfile(id: string) {
  const c = await contacts.findBySafeAddress(id);
  if (!c) {
    return;
  }

  contact = c;
  profile = c.contactAddress_Profile;

  if ($me.circlesAddress !== contact.contactAddress) {
    commonTrusts = (
      await ApiClient.query<CommonTrust[], CommonTrustQueryVariables>(
        CommonTrustDocument,
        {
          safeAddress1: $me.circlesAddress.toLowerCase(),
          safeAddress2: contact.contactAddress.toLowerCase(),
        }
      )
    ).filter((o) => o.profile);
  } else {
    commonTrusts = [];
  }

  displayName = contact.contactAddress_Profile.firstName
    ? contact.contactAddress_Profile.firstName +
      (contact.contactAddress_Profile.lastName
        ? " " + contact.contactAddress_Profile.lastName
        : "")
    : contact.contactAddress;

  // displayName =
  //   displayName.length >= 22 ? displayName.substr(0, 22) + "..." : displayName;

  profile = contact.contactAddress_Profile;

  detailActions = await UserActions.getAvailableActions(profile);

  if (contact.metadata) {
    const trustMetadata: ContactPoint = contact.metadata.find(
      (p) => p.name === EventType.CrcTrust
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
      trustMessage = `${$_("dapps.o-contacts.pages.profile.mutualTrust")}`;
    } else if (!trustIn && trustOut > 0) {
      trustMessage = `${$_("dapps.o-contacts.pages.profile.trustedByYou")}`;
    } else if (trustIn > 0 && !trustOut) {
      trustMessage = `${$_("dapps.o-contacts.pages.profile.isTrustingYou")}`;
    } else {
      trustMessage = `${$_("dapps.o-contacts.pages.profile.notTrusted")}`;
    }
  }

  isMe = profile.id == ($me ? $me.id : 0);

  const verifyData = [
    {
      key: "verify",
      icon: "check",
      title: `${$_("dapps.o-contacts.pages.profile.verify")}`,
      mutation: VerifySafeDocument,
    },
    {
      key: "revoke",
      icon: "trash",
      title: `${$_("dapps.o-contacts.pages.profile.revoke")}`,
      mutation: RevokeSafeVerificationDocument,
    },
  ];
  const sessionInfo = await getSessionInfo();
  capabilities = sessionInfo.capabilities;
  const canVerify =
    capabilities &&
    capabilities.find((o) => o.type == CapabilityType.Verify) &&
    "__ALLOW_VERIFY__" == "true";

  const verifyProfile = {
    key: "verify",
    icon: "check",
    title: `${$_("dapps.o-contacts.pages.profile.verify")}`,
    action: async () => {
      const apiClient = await window.o.apiClient.client.subscribeToResult();
      await apiClient.mutate({
        mutation: VerifySafeDocument,
        variables: {
          safeAddress: id,
        },
      });
      showToast(
        "success",
        `${$_("dapps.o-contacts.pages.profile.accountVeryfied")}`
      );

      isLoading = true;
      setProfile(id).then(() => (isLoading = false));
    },
  };

  const unverifyProfile = {
    key: "evoke",
    icon: "trash",
    colorClass: "",
    title: `${$_("dapps.o-contacts.pages.profile.verifiedClickToRevoke")}`,
    action: async () => {
      const apiClient = await window.o.apiClient.client.subscribeToResult();
      await apiClient.mutate({
        mutation: RevokeSafeVerificationDocument,
        variables: {
          safeAddress: id,
        },
      });

      showToast(
        "error",
        `${$_("dapps.o-contacts.pages.profile.accountVerificationRevoked")}`
      );

      isLoading = true;
      setProfile(id).then(() => (isLoading = false));
    },
  };
  console.log("banni", unverifyProfile);

  const bannedProfile = {
    key: "banned",
    icon: "trash",
    colorClass: "text-alert-dark",
    title: `${$_("dapps.o-contacts.pages.profile.revokedUppercase")}`,
    action: () => {},
  };

  if (canVerify && profile.verifications) {
    if (
      profile.verifications &&
      profile.verifications[0] &&
      profile.verifications[0].revokedAt
    ) {
      detailActions.push(bannedProfile);
    } else {
      if (profile.verifications.length) {
        detailActions.push(unverifyProfile);
      } else {
        detailActions.push(verifyProfile);
      }
    }
  }
}
</script>

{#if isLoading}
  <div class="p-5">
    <LoadingIndicator />
  </div>
{:else}
  <div class="p-5 pb-0">
    <header class="grid overflow-hidden bg-white h-72 ">
      <div class="w-full text-center">
        <h1 class="text-3xl uppercase font-heading">
          {$_("dapps.o-contacts.pages.profile.profile")}
        </h1>
      </div>
      <div
        class="flex flex-col items-center self-center w-full m-auto text-center justify-self-center ">
        <UserImage
          profile="{profile}"
          size="{36}"
          gradientRing="{true}"
          profileLink="{false}" />

        {#if profile && contact.contactAddress}
          <div
            class="mt-4 break-words"
            class:text-3xl="{!isMobile() && !displayName.startsWith('0x')}"
            class:text-xs="{displayName.startsWith('0x')}">
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
                  <div class="text-left text-2xs text-dark-lightest">
                    {$_("dapps.o-contacts.pages.profile.trust")}
                  </div>
                  <div class="flex flex-wrap content-start">
                    {trustMessage}
                  </div>
                </div>
              </section>
            {/if}
            <section class="justify-center mb-2 ">
              <div class="flex flex-col w-full pt-2 space-y-1">
                <div class="text-left text-2xs text-dark-lightest">
                  {$_("dapps.o-contacts.pages.profile.mutualFriends")}
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
                    {$_("dapps.o-contacts.pages.profile.noMutualFriends")}
                  {/if}
                </div>
              </div>
            </section>
            {#if profile.memberships && profile.memberships.length}
              <section class="justify-center mb-2 ">
                <div class="flex flex-col w-full pt-2 space-y-1">
                  <div class="text-left text-2xs text-dark-lightest">
                    {$_("dapps.o-contacts.pages.profile.memberAt")}
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
            {#if profile.verifications && profile.verifications.length}
              <section class="justify-center mb-2 ">
                <div class="flex flex-col w-full pt-2 space-y-1">
                  <div class="text-left text-2xs text-dark-lightest">
                    {$_("dapps.o-contacts.pages.profile.verifiedBy")}
                  </div>
                  <div class="flex flex-row flex-wrap mt-2 ">
                    {#each profile.verifications as verification}
                      {#if verification.verifierProfile}
                        <div class="mt-2 mr-2">
                          <UserImage
                            profile="{verification.verifierProfile}"
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
                    {$_("dapps.o-contacts.pages.profile.passion")}
                  </div>

                  <div class="flex items-center w-full text-lg">
                    {profile.dream}
                  </div>
                </div>
              </section>
            {/if}
          {/if}

          {#if !isMe && contact && contact.contactAddress}
            <section class="justify-center">
              <div class="flex flex-col w-full pt-2 space-y-1">
                <div class="mb-1 text-left text-2xs text-dark-lightest">
                  {$_("dapps.o-contacts.pages.profile.address")}
                </div>
                <div class="flex items-center w-full text-2xs">
                  {contact.contactAddress}
                </div>
              </div>
            </section>
          {/if}
        </div>
      </div>

      {#if profile && detailActions && !isMe}
        <div class="sticky bottom-0 left-0 right-0 w-full pb-5 bg-white">
          <DetailActionBar actions="{detailActions}" />
        </div>
      {/if}
    </div>
  </div>
{/if}
