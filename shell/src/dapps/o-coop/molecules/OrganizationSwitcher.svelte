<script lang="ts">
import { onMount } from "svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { loadProfile } from "../../o-passport/processes/identify/services/loadProfile";
import { me } from "../../../shared/stores/me";
import { Profile, Organisation } from "../../../shared/api/data/types";
import UserImage from "../../../shared/atoms/UserImage.svelte";
import { clickOutside } from "../../../shared/functions/clickOutside";
import { createEventDispatcher } from "svelte";

import { _ } from "svelte-i18n";

let myProfile: Profile;
let organisations: [] = [];
let profile: Profile;

$: name = profile?.circlesAddress ? profile.circlesAddress : "";

$: {
  if ($me) {
    profile = $me;
  } else {
    profile = undefined;
  }
}
onMount(async () => {
  myProfile = await loadProfile();
  if (myProfile.memberships && myProfile.memberships.length > 0) {
    const myMemberships = myProfile.memberships
      //.filter((o) => o.isAdmin)
      .map((o) => o.organisation);
    organisations = <any>[myProfile, ...myMemberships].map((o) => {
      const displayName = (<any>o).firstName
        ? (<any>o).firstName + " " + (<any>o).lastName
        : (<any>o).name;
      return {
        value: o,
        label: displayName,
      };
    });
  }
});

const dispatch = createEventDispatcher();
function clickedOutside() {
  dispatch("click_outside");
}

function switchProfile(profile: Profile | Organisation) {
  clickedOutside();
  window.o.publishEvent(<PlatformEvent>{
    type: "shell.loggedOut",
  });

  window.o.publishEvent(<PlatformEvent>{
    type: "shell.authenticated",
    profile: profile,
  });
  location.reload();
}
</script>

<div class="cls" on:click="{() => clickedOutside()}" use:clickOutside>
  {#if myProfile && organisations}
    <div class="absolute top-0 right-0 z-10 flex flex-col">
      <div class="relative self-end text-primary right-14 top-5">
        {$_("dapps.o-coop.molecules.switchProfile")}
      </div>
      {#each organisations as organisation}
        {#if organisation.value.circlesAddress != $me.circlesAddress}
          <div class="relative mb-4 right-3 top-10">
            <div
              class="flex flex-row items-center px-4 py-2 space-x-2 text-lg bg-white rounded-full shadow-md cursor-pointer"
              on:click="{() => switchProfile(organisation.value)}">
              <UserImage
                profile="{organisation.value}"
                size="{8}"
                profileLink="{false}"
                gradientRing="{true}" />
              <div class="text-dark-dark">
                {organisation.label}
              </div>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
.cls {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
  min-width: 100%;
  min-height: 100%;
  opacity: 1;
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
}
</style>
