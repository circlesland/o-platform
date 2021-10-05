<script lang="ts">
import Profile from "src/shared/api/data/types";
import UserImage from "src/shared/atoms/UserImage.svelte";

export let profile: Profile;
export let targetCirclesAddress: string;
export let showPassion: boolean = true;

console.log("Parammarama", profile);
</script>

{#if profile && profile.circlesAddress}
  <div
    class="flex flex-col items-center self-center w-full m-auto text-center justify-self-center ">
    <UserImage profile="{profile}" size="{36}" gradientRing="{true}" />

    <div class="mt-4 text-3xl">
      {profile
        ? profile.lastName
          ? `${profile.firstName} ${profile.lastName}`
          : profile.firstName
        : profile.firstName}
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
