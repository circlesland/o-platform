<script lang="ts">
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import UserImage from "src/shared/atoms/UserImage.svelte";
import Icons from "../../../shared/molecules/Icons.svelte";
import CopyToClipboard from "../../../shared/atoms/CopyClipboard.svelte";
import { Capability, CapabilityType } from "../../../shared/api/data/types";

import {
  CreatedInvitation,
  MyInvitationsDocument,
  MyInvitationsQueryVariables,
} from "../../../shared/api/data/types";
import { ApiClient } from "../../../shared/apiConnection";
import { Environment } from "../../../shared/environment";

import { _ } from "svelte-i18n";
import {me} from "../../../shared/stores/me";

export let capabilities: Capability[] | undefined = [];

let myInvitations: CreatedInvitation[] = [];
let canInvite = false;

async function reload() {
  const sessionInfo = await me.getSessionInfo();
  capabilities = sessionInfo.capabilities;
  canInvite =
    capabilities &&
    capabilities.find((o) => o.type == CapabilityType.Invite) &&
    Environment.allowVerify;

  const invitations = await ApiClient.query<
    CreatedInvitation[],
    MyInvitationsQueryVariables
  >(MyInvitationsDocument, {});

  if (!invitations || !invitations.length) {
    canInvite = false;
  }
  myInvitations = invitations ?? [];
}
reload();

function sortAlphabetically(a, b) {
  return a.name.localeCompare(b.name);
}
</script>

<section class="flex flex-col items-center justify-center p-6 space-y-4">
  <slot name="EditorTitle">
    <div class="w-full text-center">
      <h1 class="text-3xl uppercase font-heading">{$_("dapps.o-dashboard.pages.invites.invites")}</h1>
    </div>
  </slot>
  <slot name="EditorDescription">
    <div class="w-full text-center">
      <span class="text-dark-lightest">
        {#if canInvite}
          {$_("dapps.o-dashboard.pages.invites.canInvite")}<u
            >{$_("dapps.o-dashboard.pages.invites.onlyOnce")}</u
          >.
        {:else}
          {$_("dapps.o-dashboard.pages.invites.canNotInvite1")}<br /><br />
          {$_("dapps.o-dashboard.pages.invites.canNotInvite2")}<br /><br />
          {$_("dapps.o-dashboard.pages.invites.canNotInvite3")}<br /><br />
          {$_("dapps.o-dashboard.pages.invites.canNotInvite4")}
          <a
            href="https://discord.gg/UgCVqFnx"
            target="_blank"
            class="link link-primary">{$_("dapps.o-dashboard.pages.invites.discord")}</a
          >.
        {/if}
      </span>
    </div>
  </slot>
  {#if canInvite}
    <div class="w-full">
      <slot name="EditorMainComponent">
        <div class="flex flex-col w-full space-y-4">
          {#each [...myInvitations].sort(sortAlphabetically) as invitation, index}
            <ItemCard
              params="{{
                edgeless: true,
                inline: true,

                truncateMain: true,
              }}">
              <div slot="itemCardStart">
                <div
                  class="flex items-center content-center self-center justify-center w-20 h-20 overflow-hidden text-center rounded-l-lg has-tooltip"
                  class:bg-success-lighter="{invitation.claimedBy}"
                  class:bg-primary-lighter="{!invitation.claimedBy}">
                  <span
                    class="px-2 ml-12 text-xs bg-white rounded shadow-sm tooltip">
                    {#if !invitation.claimedBy}
                      {$_("dapps.o-dashboard.pages.invites.invitationNotClaimed")}
                    {/if}
                  </span>
                  {#if invitation.claimedBy && invitation.claimedBy.firstName}
                    <UserImage profile="{invitation.claimedBy}" size="{12}" />
                  {:else}
                    <div>
                      <div class="relative">
                        <div
                          class="flex w-12 h-12 bg-white rounded-full "
                          class:mycircle-success="{invitation.claimedBy}"
                          class:mycircle-pending="{!invitation.claimedBy}">
                        </div>
                        <div class="absolute halfCircleIcon">
                          <Icons icon="useradd" />
                        </div>
                      </div>
                    </div>
                  {/if}
                </div>
              </div>
              <div slot="itemCardBody">
                <div class="flex-col flex-grow">
                  <div
                    class="flex flex-row items-center justify-between text-left">
                    <div class="flex-grow min-w-0">
                      <h2
                        class="overflow-hidden text-base whitespace-nowrap overflow-ellipsis">
                        {invitation.claimedBy && invitation.claimedBy.firstName
                          ? `Invitation claimed`
                          : `${invitation.code}`}
                        {#if invitation.code && !invitation.claimedBy}
                          <CopyToClipboard
                            text="{Environment.externalUrl}/#/homepage/invite/{invitation.code}"
                            let:copy>
                            <svg
                              on:click="{copy}"
                              xmlns="http://www.w3.org/2000/svg"
                              class="inline w-4 h-4 cursor-pointer stroke-current text-primary"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor">
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0
                00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0
                012 2"></path>
                            </svg>
                          </CopyToClipboard>
                        {/if}
                      </h2>
                    </div>
                    <div class="self-end pl-2 text-right whitespace-nowrap">
                      <span></span>
                    </div>
                  </div>
                  <div
                    class="flex flex-row items-center justify-between text-left">
                    <div class="flex-grow leading-none">
                      <span class="inline-block text-xs text-dark-lightest">
                        {invitation.name}
                      </span>
                    </div>
                    <div
                      class="text-xs text-right text-dark-lightest whitespace-nowrap leading-non">
                      <slot name="itemCardEndSmallElement">
                        <span class="inline-block"> </span>
                      </slot>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div slot="itemCardEnd">
                <div class="self-end mr-2 text-lg sm:text-3xl">
                  <a
                    href="mailto:hello@world.com?subject=Invitation to Circles Land&body=Hi {invitation.name}! here is an invitation code for Circles Land: {invitation.code}">
                    <button
                      on:click="{(e) => {
                        //console.log('ALKSDJASd');
                      }}"
                      class="self-end text-base btn btn-primary ">
                      <Icons icon="copy" />
                      Copy Link
                    </button>
                  </a>
                </div>
              </div> -->
            </ItemCard>
            <!-- <InfoCard
            params="{{
              headerClass: 'bg-primary',
              headerText: `invite ${index + 1} pending`,
            }}">
            <div slot="infoCardContent" class="w-full p-2">
              <ItemCard
                params="{{
                  edgeless: true,
                  inline: true,
                  title: invitation.name,
                  subTitle: 'use button to send invite',
                  truncateMain: true,
                  noShadow: true,
                }}">
                <div slot="itemCardEnd">
                  <div class="self-end mr-2 text-lg sm:text-3xl">
                    <a
                      href="mailto:hello@world.com?subject=Invitation to Circles Land&body=Hi {invitation.name}! here is an invitation code for Circles Land: {invitation.code}">
                      <button
                        on:click="{(e) => {
                          //console.log('ALKSDJASd');
                        }}"
                        class="self-end text-base btn btn-primary ">
                        <Icons icon="copy" />
                        Copy Link
                      </button>
                    </a>
                  </div>
                </div>
              </ItemCard>
            </div>
          </InfoCard> -->
          {/each}
          <!--
        <InfoCard
          params="{{ headerText: 'invite 2 unlocked', headerClass: 'bg-success' }}">
          <div slot="infoCardContent" class="w-full p-2">
            <ItemCard
              params="{{ imageUrl: 'https://images.unsplash.com/photo-1630904519797-7e2992b13afe?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3NHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', edgeless: true, inline: true, title: 'EMPOWERED ELA LOUIS', subTitle: '2 days ago', truncateMain: true, noShadow: true }}">

              <div slot="itemCardEnd">
                <div class="self-end mr-2 text-lg sm:text-3xl">
                  <button
                    on:click="{e => {
                      console.log('ALKSDJASd');
                    }}"
                    class="self-end text-base btn btn-square btn-primary ">
                    <Icons icon="sendmoney" />
                  </button>
                </div>
              </div>
            </ItemCard>
          </div>
        </InfoCard>

        <InfoCard
          params="{{ headerText: 'invite 1 unlocked', headerClass: 'bg-success' }}">
          <div slot="infoCardContent" class="w-full p-2">
            <ItemCard
              params="{{ imageUrl: 'https://images.unsplash.com/photo-1630644964646-6cc8ac5b47ea?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5NHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', edgeless: true, inline: true, title: 'EMPOWERED Hans-Peter Jacobs', subTitle: '1 day ago', truncateMain: true, noShadow: true }}">

              <div slot="itemCardEnd"></div>
            </ItemCard>
          </div>
        </InfoCard>

    -->
        </div>
      </slot>
    </div>
  {/if}
  <!-- <slot name="EditorActionButtons">
    <div class="w-full">BUTTONS</div>
  </slot> -->
</section>

<style>
.mycircle-success {
  border: 2px solid;
  @apply border-success;
  @apply border-l-success;
}
.mycircle-pending {
  border: 2px solid;
  @apply border-t-success;
  @apply border-l-success;
  @apply border-b-white;
  @apply border-r-white;

  transform: rotate(-45deg);
}
.halfCircleIcon {
  top: 0.6rem;
  left: 0.9rem;
}
</style>
