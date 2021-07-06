<script lang="ts">
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import {upsertIdentity, upsertIdentityOnlyWhereDirty} from "../processes/upsertIdentity";
  import { me } from "../../../shared/stores/me";
  import { Profile } from "../data/api/types";
  import { loadProfile } from "../processes/identify/services/loadProfile";
  import TopNav from "src/shared/atoms/TopNav.svelte";
  import PageHeader from "src/shared/atoms/PageHeader.svelte";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";

  let profile: Profile;

  export let params: {
    profileId?: string;
  };

  async function execLoadProfile(profileId?: string) {
    if (profileId && parseInt(profileId)) {
      profile = await loadProfile(parseInt(profileId));
    }
  }

  let avatarUrl: string = "";
  $: {
    if (params && params.profileId) {
      execLoadProfile(params ? params.profileId : $me.id.toString());
    } else if ($me) {
      profile = $me;
    }

    if (profile && profile.avatarUrl) {
      avatarUrl = profile.avatarUrl;
    } else if (profile) {
      avatarUrl = AvataarGenerator.generate(profile.circlesAddress);
    } else {
      avatarUrl = AvataarGenerator.default();
    }
  }

  function editProfileField(dirtyFlags: { [x: string]: boolean }) {
    window.o.runProcess(upsertIdentityOnlyWhereDirty, profile, dirtyFlags);
  }
</script>

<TopNav />

<PageHeader
  heightClass="h-72"
  headerBackground="/images/common/headerbackground/header-background-passport.jpg"
>
  <div class="self-center block mt-4 text-center">
    <div class="avatar">
      <div class="mb-4 rounded-full w-36 h-36">
        <img
          src={avatarUrl}
          alt={profile
            ? profile.lastName
              ? `${profile.firstName} ${profile.lastName}`
              : profile.firstName
            : "avatar"}
        />
      </div>
      <button
        class="relative self-start link link-primary text-primary text-2xs top-1 right-2"
        on:click={() => editProfileField({ avatarUrl: true })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="relative top-0 right-0 w-3 h-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
          />
        </svg>
      </button>
    </div>
    <div class="">
      <h2 class="text-2xl">
        {profile ? profile.firstName : ""}
        {profile && profile.lastName ? profile.lastName : ""}
        <button
          class="self-start -mt-2 -mr-3 link link-primary text-primary text-2xs"
          on:click={() => editProfileField({ firstName: true, lastName: true })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="relative top-0 right-0 w-3 h-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
            />
          </svg>
        </button>
      </h2>
    </div>
  </div>
</PageHeader>
