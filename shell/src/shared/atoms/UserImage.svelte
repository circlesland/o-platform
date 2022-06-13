<script lang="ts">
import { AvataarGenerator } from "src/shared/avataarGenerator";
import { push } from "svelte-spa-router";
import { verify } from "../../dapps/o-verification/processes/verify";
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
    push(`#/contacts/profile/${profile.circlesAddress}`);
    event.stopPropagation();
  }
}
$: {
  if (profile) {
    if (profile.__typename == "Profile") {
      displayName = profile.displayName;
    } else {
      displayName = profile.name ? profile.name : "";
    }
    displayName = displayName.length >= 22 ? displayName.substr(0, 22) + "..." : displayName;
  }
}
</script>

{#if profile}
  <div class="has-tooltip" class:cursor-pointer="{profileLink}" on:click="{(event) => linkToProfile(event)}">
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
      <div class="relative w-{size} h-{size} m-auto rounded-full" class:bg-white="{!transparent}">
        {#if profile.provenUniqueness}
          <img
            src="/icons/verified.svg"
            alt="verified user"
            class="absolute "
            class:right-0="{size >= 15}"
            class:top-0="{size >= 15}"
            class:w-8="{size >= 20}"
            class:h-8="{size >= 20}"
            class:-right-1="{size < 15}"
            class:-top-1="{size < 15}"
            class:w-4="{size < 20}"
            class:h-4="{size < 20}" />
        {/if}
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
