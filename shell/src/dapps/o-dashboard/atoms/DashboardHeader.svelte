<script lang="ts">
  import { onMount } from "svelte";
  import { getLastLoadedDapp, getLastLoadedPage } from "../../../loader";
  import { PageManifest } from "@o-platform/o-interfaces/dist/pageManifest";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
  import gql from "graphql-tag";
  import { me } from "../../../shared/stores/me";

  let lastLoadedPage: PageManifest;
  let lastLoadedDapp: DappManifest<any>;

  $: me;

  onMount(() => {
    lastLoadedPage = getLastLoadedPage();
    lastLoadedDapp = getLastLoadedDapp();
  });
</script>

<!-- DASHBOARD HEADER START -->
<div
  class="h-80 flex flex-col items-stretch navbar bg-gradient-to-r from-gradient1 to-gradient2 text-white"
>
  {#if lastLoadedDapp && lastLoadedPage && lastLoadedPage.routeParts.length > 0}
    <div class="pt-0 pl-2 flex flex-row  justify-between">
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
  {:else if lastLoadedDapp && lastLoadedPage}
    <div class="flex flex-row items-stretch pl-2">
      <span class="flex-grow text-lg font-circles"
        >{#if lastLoadedDapp.title != lastLoadedPage.title}
          {lastLoadedDapp.title} /
        {/if}{lastLoadedPage.title}</span
      >
      <div class="self-end">
        <button
          class=" text-white"
          on:click|once={() => (window.location = "/")}
          >Website
        </button>
      </div>
    </div>
  {/if}

  <div class="self-center text-center mt-6 block">
    <div class="avatar">
      <div class="w-36 h-36 rounded-full mb-4">
        <img
          src={$me && $me.avatarUrl ? $me.avatarUrl : ""}
          alt={$me
            ? $me.lastName
              ? `${$me.firstName} ${$me.lastName}`
              : $me.firstName
            : "avatar"}
        />
      </div>
    </div>
    <div class="text-xl">
      <strong>Welcome {$me ? $me.firstName : ""}</strong>
    </div>
  </div>
</div>
<!-- DASHBOARD HEADER STOP -->
