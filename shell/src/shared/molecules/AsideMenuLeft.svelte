<script lang="ts">
  import Icons from "./Icons.svelte";
  import UAParser from "ua-parser-js";
  import { createEventDispatcher } from "svelte";

  let isLeftSidebarOpen: boolean = false;

  const uaParser = new UAParser();
  const dispatch = createEventDispatcher();

  let detectedDevice = uaParser.getDevice();
  let isMobile = true;

  if (detectedDevice && detectedDevice.type != "mobile") {
    isMobile = false;
  } else {
    isMobile = true;
  }

  $: {
    if (isLeftSidebarOpen) {
      document.body.style.overflow = "hidden";

      dispatch("isLeftSidebarOpen", {
        state: true,
      });
    } else {
      document.body.style.overflow = "visible";
      dispatch("isLeftSidebarOpen", {
        state: false,
      });
    }
  }
</script>

{#if isMobile}
  <aside class="flex sideBarLeft" class:hidden={!isLeftSidebarOpen}>
    <div class="">
      <!-- Sidebar -->
      <div class="fixed inset-y-0 z-10 flex w-72 sidebar">
        <!-- Sidebar content -->
        <div class="z-10 flex flex-col flex-1 text-white bg-dark">
          <nav class="flex flex-col flex-1 w-64 p-4 mt-4" />
          <div class="flex-shrink-0 p-4 space-y-4">
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2
                  2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1
                  1 0 011 1v4a1 1 0 001 1m-6 0h6"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0
                  01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="absolute z-50 flex justify-center flex-shrink-0 w-12 h-12 px-3 py-3 ml-4 bg-white rounded-full cursor-pointer bottom-4 left-72"
      on:click={() => (isLeftSidebarOpen = false)}
    >
      <Icons icon="buttonleftarrow" />
    </div>
  </aside>
{:else}

  <aside
    class="z-10 flex flex-col flex-1 flex-shrink-0 w-64 h-screen text-white bg-dark"
    class:hidden={!isLeftSidebarOpen}
  >

    <div class="relative flex-shrink-0 w-64 p-4 pt-16 space-y-4">

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
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1
            0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0
            001 1m-6 0h6"
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
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3
            0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span>Logout</span>
      </button>
    </div>
    <!-- <div
      class="absolute z-50 flex justify-center flex-shrink-0 w-12 h-12 px-3 py-3 bg-white rounded-full cursor-pointer bottom-4 text-dark left-72"
      on:click={() => (isLeftSidebarOpen = false)}
    >
      <Icons icon="buttonleftarrow" />
    </div> -->
  </aside>
{/if}

<style>
  .sideBarLeft {
    z-index: 99;
    background-color: rgba(177, 192, 200, 0.4);
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;

    align-items: flex-start;
    justify-content: center;
    overflow-y: hidden;
    @apply pb-20;

    flex-direction: column;
    height: 100%;
    width: 100%;
  }
  .sideBarLeft .sidebar {
    --tw-shadow: 0 25px 50px 82px rgba(0, 0, 0, 0.45);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }
</style>
