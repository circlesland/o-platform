<script lang="ts">
    import TopNav from "src/shared/atoms/TopNav.svelte";

  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import { upsertIdentity } from "../../o-passport/processes/upsertIdentity";
  import { me } from "../../../shared/stores/me";
  import LoadingIndicator from "../../../shared/atoms/LoadingIndicator.svelte";

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

{#if isLoading}
  <LoadingIndicator />
{:else}
  <div
    class="h-60 flex flex-col w-full items-stretch justify-items-stretch  bg-gradient-to-r from-gradient1 to-gradient2 text-white"
  >
    <div class="avatar self-center justify-self-center text-center">
      <div class="w-36 h-36 rounded-full mb-4">
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
    <div class="self-center flex-grow justify-self-start text-center">
      <h2>
        {profile ? profile.firstName : ""}
        {profile && profile.lastName ? profile.lastName : ""}
      </h2>
    </div>
  </div>
{/if}
