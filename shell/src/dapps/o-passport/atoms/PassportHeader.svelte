<script lang="ts">
  import { onMount } from "svelte";
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import { upsertIdentity } from "../processes/upsertIdentity";
  import { getLastLoadedDapp, getLastLoadedPage } from "../../../loader";
  import { PageManifest } from "@o-platform/o-interfaces/dist/pageManifest";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
  import { me } from "../../../shared/stores/me";
  import { Profile } from "../data/api/types";
  import { loadProfile } from "../processes/identify/services/loadProfile";

  let profile: Profile;

  export let params: {
    profileId?: string;
  };

  async function execLoadProfile(profileId?: string) {
    if (profileId && parseInt(profileId)) {
      profile = await loadProfile(parseInt(profileId));
    }
  }

  $: {
    if (params && params.profileId) {
      execLoadProfile(params ? params.profileId : $me.id.toString());
    } else if ($me) {
      profile = $me;
    }
  }

  let lastLoadedPage: PageManifest;
  let lastLoadedDapp: DappManifest<any>;

  onMount(() => {
    lastLoadedPage = getLastLoadedPage();
    lastLoadedDapp = getLastLoadedDapp();
  });

  function editProfile() {
    const requestEvent = new RunProcess<ShellProcessContext>(
      shellProcess,
      true,
      async (ctx) => {
        ctx.childProcessDefinition = upsertIdentity;
        ctx.childContext = {
          data: {
            id: profile.id,
            circlesAddress: profile.circlesAddress,
            circlesSafeOwner: profile.circlesSafeOwner,
            avatarCid: profile.avatarCid,
            avatarUrl: profile.avatarUrl,
            avatarMimeType: profile.avatarMimeType,
            firstName: profile.firstName,
            lastName: profile.lastName,
            country: profile.country,
            dream: profile.dream,
          },
        };
        return ctx;
      }
    );

    window.o.publishEvent(requestEvent);
  }

  function editProfileField(dirtyFlags: { [x: string]: boolean }) {
    const requestEvent = new RunProcess<ShellProcessContext>(
      shellProcess,
      true,
      async (ctx) => {
        ctx.childProcessDefinition = {
          id: upsertIdentity.id,
          name: upsertIdentity.name,
          stateMachine: (processId?: string) =>
            (<any>upsertIdentity).stateMachine(processId, true),
        };
        ctx.childContext = {
          data: {
            id: profile.id,
            circlesAddress: profile.circlesAddress,
            circlesSafeOwner: profile.circlesSafeOwner,
            avatarCid: profile.avatarCid,
            avatarUrl: profile.avatarUrl,
            avatarMimeType: profile.avatarMimeType,
            firstName: profile.firstName,
            lastName: profile.lastName,
            country: profile.country,
            dream: profile.dream,
          },
          dirtyFlags: dirtyFlags,
        };
        return ctx;
      }
    );

    window.o.publishEvent(requestEvent);
  }
</script>

<div
  class="h-80 flex flex-col items-stretch navbar bg-gradient-to-r from-gradient1 to-gradient2 text-white"
>
  {#if lastLoadedDapp && lastLoadedPage}
    <div class="flex flex-row  justify-between">
      <div class=" pl-2 self-start ">
        <span class="text-lg font-circles ">
          {#if lastLoadedDapp.title != lastLoadedPage.title}
            {lastLoadedDapp.title} /
          {/if}{lastLoadedPage.title}</span
        >
      </div>
      <div class="self-end">
        <button
          class=" text-white font-light font-circles"
          on:click={() => (window.location = "/#/dashboard")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </button>
      </div>
    </div>
  {/if}

  <div class="self-center text-center mt-6 block">
    <div class="avatar">
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
      <button
        class="link link-primary text-primary text-2xs self-start relative top-1 right-2"
        on:click={() => editProfileField({ avatarUrl: true })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3 w-3 relative top-0 right-0"
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
      <h2>
        {profile ? profile.firstName : "Martin"}
        {profile && profile.lastName ? profile.lastName : ""}
        <button
          class="link link-primary text-primary text-2xs self-start -mt-2 -mr-3"
          on:click={() => editProfileField({ firstName: true, lastName: true })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3 w-3 relative top-0 right-0"
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
    {#if $me && profile && $me.id == profile.id}
      <button class="link link-primary text-primary" on:click={editProfile}
        >Edit Profile</button
      >
    {/if}
  </div>
</div>
