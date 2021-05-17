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
    if (profile.displayName) {
      isLoading = false;
    }
  }
</script>

{#if isLoading}
  <LoadingIndicator />
{:else}
  {#if lastLoadedDapp && lastLoadedPage}
    <div
      class="flex flex-row  justify-between navbar bg-gradient-to-r from-gradient1 to-gradient2 text-white sticky -top-0.5 z-10"
    >
      <div class="pt-0 pl-2 flex flex-row w-full justify-between ">
        <div
          class="self-start cursor-pointer"
          on:click|once={() => history.back()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 inline-block mr-1 -mt-1"
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
      </div>
    </div>
  {/if}
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
