<script lang="ts">
import { onMount } from "svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { loadProfile } from "../../o-passport/processes/identify/services/loadProfile";
import { me } from "../../../shared/stores/me";
import { Profile } from "../../../shared/api/data/types";
import UserImage from "../../../shared/atoms/UserImage.svelte";
import { clickOutside } from "../../../shared/functions/clickOutside";
import { createEventDispatcher } from "svelte";

let myProfile: Profile;
let organizations: [] = [];
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
      .filter((o) => o.isAdmin)
      .map((o) => o.organisation);
    organizations = <any>[myProfile, ...myMemberships].map((o) => {
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

function switchProfile(profile: Profile) {
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

<template lang="pug">
  div.cls(on:click!="{() => clickedOutside()}", use:clickOutside)
  +if('myProfile && organizations')
    div.flex.flex-col.z-10.absolute.right-0.top-0
      div.self-end.text-primary.relative.right-14.top-5 Switch Profile
      +each(`organizations as organization`)
        +if('organization.value.circlesAddress != $me.circlesAddress')
          div.relative.right-3.top-10
            div.flex.flex-row.items-center.px-4.py-2.space-x-2.rounded-full.bg-white.shadow-sm.text-lg.cursor-pointer(on:click!="{() => switchProfile(organization.value)}")
              UserImage(profile="{organization.value}" size="{8}" profileLink="{false}" gradientRing="{true}")
              div.text-dark-dark {organization.label}
          //- div.flex.flex-row.cursor-pointer.space-x-2.self-end(on:click!="{() => switchProfile(organization.value)}")
          //-   div.self-center.text-dark-dark {organization.label}
          //-   UserImage(profile="{organization.value}" size="{8}" profileLink="{false}" gradientRing="{true}")

</template>

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
