<script lang="ts">
  import { onMount } from "svelte";
  import { getLastLoadedDapp, getLastLoadedPage } from "../../../loader";
  import { PageManifest } from "@o-platform/o-interfaces/dist/pageManifest";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";

  let lastLoadedPage: PageManifest;
  let lastLoadedDapp: DappManifest<any>;
  export let user;

  onMount(() => {
    lastLoadedPage = getLastLoadedPage();
    lastLoadedDapp = getLastLoadedDapp();
  });
</script>

<!-- BANKING HEADER START -->
<div
  class="h-80 flex flex-col items-stretch navbar bg-gradient-to-r from-gradient1 to-gradient2 text-white"
>
  {#if lastLoadedDapp && lastLoadedPage}
    <div
      class="h-24 flex flex-row  justify-between navbar bg-gradient-to-r from-gradient1 to-gradient2 text-white"
    >
      <div class=" pl-2 self-start">
        <a on:click={() => history.back()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 inline-block -mt-1 mr-1"
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
        </a>
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
    </div>
  {/if}
  <div class="self-center text-center mb-2 block">
    <span class="inline-block text-6xl sm:text-8xl font-circles">{user}</span>
  </div>
</div>
