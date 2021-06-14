<script lang="ts">
  import TopNav from "src/shared/atoms/TopNav.svelte";

  let isLoading: boolean = true;

  export let profile: {
    id?: number;
    dream?: string;
    country?: string;
    safeAddress?: string;
    displayName: string;
    avatarUrl?: string;
    avatarCid?: string;
    avatarMimeType?: string;
    firstName?: string;
    lastName?: string;
    circlesAddress?: string;
    circlesSafeOwner?: string;

    // The incoming trust limit
    trustedBy?: number;
    // The outgoing trust limit
    trusting?: number;
  } = {};

  $: {
    if (profile.displayName) {
      isLoading = false;
    }
  }

</script>

<TopNav showBackArrow={true} />

<div
  class="flex flex-col items-stretch w-full text-white h-60 justify-items-stretch bg-primarydark"
>
  {#if !isLoading}
    <div class="self-center text-center avatar justify-self-center">
      <div class="mb-4 rounded-full w-36 h-36">
        <img
          src={profile && profile.avatarUrl ? profile.avatarUrl : ""}
          alt={profile
            ? profile.lastName
              ? `${profile.firstName} ${profile.lastName}`
              : profile.firstName
            : "avatar"}
        />
      </div>
    </div>
    <div class="self-center flex-grow text-center justify-self-start">
      <h2>
        {profile ? profile.firstName : ""}
        {profile && profile.lastName ? profile.lastName : ""}
      </h2>
    </div>
  {/if}
</div>
