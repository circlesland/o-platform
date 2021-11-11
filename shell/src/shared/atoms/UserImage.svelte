<script lang="ts">
import { AvataarGenerator } from "src/shared/avataarGenerator";
import { push } from "svelte-spa-router";
import { Profile, Organisation } from "../api/data/types";

export let profile: Profile | Organisation;
export let size: number = 10;
export let gradientRing: boolean = false;
export let whiteRing: boolean = false;
export let transparent: boolean = false;
export let tooltip: boolean = false;
export let profileLink: boolean = true;
let displayName: string = "";

function linkToProfile(event) {
  if (profileLink) {
    event.stopPropagation();
    push(`#/friends/${profile.circlesAddress}`);
  }
}

if (profile.__typename == "Profile") {
  if (profile.firstName) {
    displayName = `${profile.firstName} ${
      profile.lastName ? profile.lastName : ""
    }`;
  } else {
    displayName = profile.circlesAddress;
  }
} else {
  displayName = profile.name ? profile.name : "";
}
displayName =
  displayName.length >= 22 ? displayName.substr(0, 22) + "..." : displayName;
</script>

{#if profile}
  <div
    class="has-tooltip"
    class:cursor-pointer="{profileLink}"
    on:click="{(event) => linkToProfile(event)}">
    {#if tooltip}
      <span class="px-2 mt-12 text-sm bg-white rounded shadow-sm tooltip">
        {displayName}
      </span>
    {/if}

    <div
      class="self-center text-center rounded-full justify-self-center"
      class:rounded-corners-gradient-borders="{gradientRing}"
      class:rounded-corners-white-borders="{whiteRing}"
      style="padding: {size >= 20 ? `4px` : `1px`}">
      <div
        class="w-{size} h-{size} m-auto rounded-full"
        class:bg-white="{!transparent}">
        <img
          class="rounded-full w-{size} h-{size}"
          src="{profile && profile.avatarUrl
            ? profile.avatarUrl
            : profile.circlesAddress
            ? AvataarGenerator.generate(profile.circlesAddress.toLowerCase())
            : AvataarGenerator.default()}"
          alt="{displayName}" />
      </div>
    </div>
  </div>
{/if}
