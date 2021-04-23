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

  $: me;
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
            id: $me.id,
            circlesAddress: $me.circlesAddress,
            avatarCid: $me.avatarCid,
            avatarUrl: $me.avatarUrl,
            avatarMimeType: $me.avatarMimeType,
            firstName: $me.firstName,
            lastName: $me.lastName,
            country: $me.country,
            dream: $me.dream,
          },
          dirtyFlags: {},
          environment: {},
        };
        return ctx;
      }
    );

    window.o.publishEvent(requestEvent);
  }
</script>

<!-- SMALL HEADER START -->
<!-- <div
  class="h-28 flex flex-row  justify-between navbar bg-gradient-to-r from-gradient1 to-gradient2 text-white"
>
  {#if lastLoadedDapp && lastLoadedPage}
    <div class=" pl-2 self-start">
            <span class="text-lg font-circles ">
              {#if lastLoadedDapp.title != lastLoadedPage.title}
                {lastLoadedDapp.title} /
              {/if}{lastLoadedPage.title}</span
            >
    </div>
    <div class="self-start">
      <button
        class=" text-base-300"
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
</div> -->
<!-- SMALL HEADER STOP -->

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
          src={$me && $me.avatarUrl
            ? $me.avatarUrl
            : "https://i.pravatar.cc/500?img=32"}
          alt={$me
            ? $me.lastName
              ? `${$me.firstName} ${$me.lastName}`
              : $me.firstName
            : "avatar"}
        />
      </div>
    </div>
    <div class="">
      <h2>
        {$me ? $me.firstName : "Martin"}
        {$me && $me.lastName ? $me.lastName : ""}
      </h2>
    </div>
    <button class="link link-primary text-primary" on:click={editProfile}
      >Edit Profile</button
    >
  </div>
</div>
