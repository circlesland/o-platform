<script lang="ts">
  import { onMount } from "svelte";
  import { getLastLoadedDapp, getLastLoadedPage } from "../../../loader";
  import { PageManifest } from "@o-platform/o-interfaces/dist/pageManifest";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import { upsertIdentity } from "../../o-passport/processes/upsertIdentity";
  import { me } from "../../../shared/stores/me";
  import LoadingIndicator from "../../../shared/atoms/LoadingIndicator.svelte";

  let lastLoadedPage: PageManifest;
  let lastLoadedDapp: DappManifest<any>;
  let isEditable: boolean = false;
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

  onMount(() => {
    lastLoadedPage = getLastLoadedPage();
    lastLoadedDapp = getLastLoadedDapp();
  });

  $: {
    isEditable = $me && $me.id === profile.id;
    if (profile.displayName) {
      isLoading = false;
    }
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
  class="h-72 flex flex-col items-stretch navbar bg-gradient-to-r from-gradient1 to-gradient2 text-white"
>
  {#if isLoading}
    <LoadingIndicator />
  {:else}
    {#if lastLoadedDapp && lastLoadedPage}
      <div
        class="h-14 pt-0 flex flex-row  justify-between navbar bg-gradient-to-r from-gradient1 to-gradient2 text-white"
      >
        <div class="self-start cursor-pointer" on:click={() => history.back()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 inline-block mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span class="text-lg font-circles">
            {#if lastLoadedDapp.title != lastLoadedPage.title}
              {lastLoadedDapp.title} /
            {/if}
            {lastLoadedPage.title}
          </span>
        </div>
        {#if isEditable}
          <div class="self-start">
            <button
              class=" text-white"
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
        {/if}
      </div>
    {/if}
    <div class="self-center text-center block">
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
        {#if isEditable}
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
        {/if}
      </div>
      <div class="">
        <h2>
          {profile ? profile.firstName : ""}
          {profile && profile.lastName ? profile.lastName : ""}
          {#if isEditable}
            <button
              class="link link-primary text-primary text-2xs self-start -mt-2 -mr-3"
              on:click={() =>
                editProfileField({ firstName: true, lastName: true })}
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
          {/if}
        </h2>
      </div>
    </div>
  {/if}
</div>
