<script lang="ts">
import ItemCard from "../../../shared/atoms/ItemCard.svelte";

import UserImage from "src/shared/atoms/UserImage.svelte";
import Icons from "../../../shared/molecules/Icons.svelte";
import { createInvite } from "../../o-onboarding/processes/createInvite/createInvite";
import {
  ClaimedInvitationDocument,
  CreatedInvitation,
  MyInvitationsDocument,
} from "../../../shared/api/data/types";
import InvitationRedeemed from "../../o-contacts/atoms/chatListItems/InvitationRedeemed.svelte";

let myInvitations: CreatedInvitation[] = [];

async function reload() {
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const result = await apiClient.query({
    query: MyInvitationsDocument,
  });
  if (result.data) {
    myInvitations = result.data.myInvitations;
    console.log("myInvitations: ", myInvitations);
  }
}
reload();
</script>

<section class="flex flex-col items-center justify-center p-6 space-y-4">
  <slot name="EditorSteps">
    <!-- <div>
      <NavSteps steps="{[0, 0, 0]}" />
    </div> -->
  </slot>
  <slot name="EditorTitle">
    <div class="w-full text-center">
      <h1 class="text-3xl uppercase font-heading">Invites</h1>
    </div>
  </slot>
  <slot name="EditorDescription">
    <div class="w-full text-center">
      <span class="text-dark-lightest"
        >Here you can create invitation Codes to invite other people.</span>
    </div>
  </slot>

  <div class="w-full">
    <slot name="EditorMainComponent">
      <div class="flex flex-col w-full space-y-4">
        {#each myInvitations as invitation, index}
          <ItemCard
            params="{{
              edgeless: true,
              inline: true,
              title:
                invitation.claimedBy && invitation.claimedBy.firstName
                  ? `Invitation claimed`
                  : `${invitation.code}`,
              subTitle: invitation.name,
              truncateMain: true,
              noShadow: true,
            }}">
            <div slot="itemCardStart">
              <div
                class="flex items-center content-center self-center justify-center w-20 h-20 overflow-hidden text-center rounded-l-lg has-tooltip"
                class:bg-success-lighter="{invitation.claimedBy}"
                class:bg-primary-lighter="{!invitation.claimedBy}">
                <span
                  class="px-2 ml-12 text-xs bg-white rounded shadow-sm tooltip">
                  {#if !invitation.claimedBy}
                    Invitation has not yet been claimed
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
  <slot name="EditorDescription">
    <div class="w-full text-center">
      <button
        on:click="{(e) => {
          window.o.runProcess(createInvite, {
            successAction: () => {
              reload();
            },
          });
        }}"
        class="self-end text-base btn btn-primary ">
        Create new Invitation
      </button>
    </div>
  </slot>
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
