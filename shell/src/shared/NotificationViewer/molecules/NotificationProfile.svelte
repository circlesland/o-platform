<script lang="ts">
import UserImage from "src/shared/atoms/UserImage.svelte";
import { Profile, Organisation } from "../../api/data/types";

export let profile: Profile | Organisation;
export let targetCirclesAddress: string;
export let showPassion: boolean = true;
let displayName: string;

if (profile.__typename == "Profile") {
  displayName = `${profile.firstName} ${
    profile.lastName ? profile.lastName : ""
  }`;
} else {
  displayName = profile.name ? profile.name : "";
}
displayName =
  displayName.length >= 22 ? displayName.substr(0, 22) + "..." : displayName;
</script>

{#if profile && profile.circlesAddress}
  <div
    class="flex flex-col items-center self-center w-full m-auto text-center justify-self-center ">
    <UserImage profile="{profile}" size="{36}" gradientRing="{true}" />

    <div class="mt-4 text-3xl">
      {displayName}
    </div>

    {#if profile && profile.city}
      <div class="mt-1 text-sm text-dark-lightest">
        {profile.city ? profile.city.name : ""}
        {profile.city ? ", " + profile.city.country : ""}
      </div>
    {/if}
  </div>

  {#if showPassion && profile.dream}
    <div>
      <div class="text-left text-2xs text-dark-lightest">Passion</div>
      <div class="text-lg">
        {profile.dream}
      </div>
    </div>
  {/if}
{:else if targetCirclesAddress}
  <div
    class="flex flex-col items-center self-center w-full m-auto text-center justify-self-center ">
    {targetCirclesAddress}
  </div>
{/if}
