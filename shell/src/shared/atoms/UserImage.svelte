<script lang="ts">
import { AvataarGenerator } from "src/shared/avataarGenerator";
import { push } from "svelte-spa-router";
import { Profile } from "../api/data/types";

export let profile: Profile;
export let size: number = 10;
export let gradientRing: boolean = false;
export let whiteRing: boolean = false;
export let transparent: boolean = false;
export let tooltip: boolean = false;
export let profileLink: boolean = true;

function linkToProfile() {
  if (profileLink) {
    push(`#/friends/${profile.circlesAddress}`);
  }
}

$: console.log("profile: ", profile.firstName);
</script>

{#if profile}
  <div
    class="has-tooltip"
    class:cursor-pointer="{profileLink}"
    on:click="{() => linkToProfile()}">
    {#if tooltip}
      <span class="px-2 mt-12 text-sm bg-white rounded shadow-sm tooltip">
        {profile.firstName
          ? `${profile.firstName} ${profile.lastName ? profile.lastName : ""}`
          : profile.circlesAddress}
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
          alt="{profile
            ? profile.lastName
              ? `${profile.firstName} ${profile.lastName}`
              : profile.firstName
            : 'avatar'}" />
      </div>
    </div>
  </div>
{/if}
