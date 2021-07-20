<script lang="ts">
  import UAParser from "ua-parser-js";
  import Icons from "./Icons.svelte";
  import NextNav from "./NextNav/NextNav.svelte";
  import { NavigationManifest } from "@o-platform/o-interfaces/dist/navigationManifest";

  import "simplebar";
  import "simplebar/dist/simplebar.css";

  let isLeftMenuOpen = true;
  let _navManifest: NavigationManifest;
  $: {
    if (isLeftMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }
</script>

<div class="flex flex-row">
  <div
    class="z-10 flex flex-col flex-1 flex-shrink-0 h-screen text-white bg-dark"
    class:hidden={!isLeftMenuOpen}
  >
    <nav class="flex flex-col flex-1 w-64 p-4 mt-4" />
    <div class="relative flex-shrink-0 w-64 p-4 space-y-4">
      <div
        class="absolute z-50 flex justify-center flex-shrink-0 w-12 h-12 px-3 py-3 ml-4 bg-white rounded-full cursor-pointer bottom-14 text-dark right-2"
        on:click={() => (isLeftMenuOpen = false)}
      >
        <Icons icon="buttonleftarrow" />
      </div>
      <a href="#" class="flex items-center space-x-2">
        <svg
          class="w-6 h-6"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
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
        <span>Home</span>
      </a>

      <button class="flex items-center space-x-2">
        <svg
          aria-hidden="true"
          class="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span>Logout</span>
      </button>
    </div>
  </div>
  <div data-simplebar class="w-full">
    <slot name="header" />
    <div class="w-full mx-auto -mt-3 md:w-2/3 xl:w-1/2">
      <slot name="body" />
    </div>
    {#if _navManifest}
      <NextNav navigation={_navManifest} />
    {/if}
  </div>
  <!-- <div class="bg-white w-72">right side</div> -->
</div>
