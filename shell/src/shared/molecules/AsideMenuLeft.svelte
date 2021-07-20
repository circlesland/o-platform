<script lang="ts">
  import Icons from "./Icons.svelte";
  import UAParser from "ua-parser-js";
  import { getRouteList } from "./../functions/GetNavigationManifest.svelte";
  import { createEventDispatcher } from "svelte";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";

  export let runtimeDapp: RuntimeDapp<any>;
  let isLeftSidebarOpen: boolean = false;
  let navigation:
    | {
        icon?: string;
        title: string;
        url: string;
        extern: boolean;
      }[]
    | undefined;

  const uaParser = new UAParser();
  const dispatch = createEventDispatcher();

  let detectedDevice = uaParser.getDevice();
  let isMobile = true;

  if (detectedDevice && detectedDevice.type != "mobile") {
    isMobile = false;
  } else {
    isMobile = true;
  }

  export function showNavigation(dapp: DappManifest<any>) {
    navigation = getRouteList(dapp, runtimeDapp);
    if (isLeftSidebarOpen) {
      isLeftSidebarOpen = false;
      dispatch("openLeftSidebar", {
        state: false,
      });
    } else {
      isLeftSidebarOpen = true;
      dispatch("openLeftSidebar", {
        state: true,
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
          <div class="relative flex-shrink-0 w-64 p-6 pt-4 pb-8 space-y-6">
            {#if navigation}
              {#each navigation as navItem}
                <a
                  href="/#/{navItem.url}"
                  class="flex content-center justify-start space-x-2"
                  on:click={() => (isLeftSidebarOpen = false)}
                >
                  <Icons icon={navItem.icon} />
                  <div>{navItem.title}</div>
                </a>
              {/each}
            {/if}
          </div>
        </div>
      </div>
    </div>
    <div
      class="absolute z-50 flex justify-center flex-shrink-0 w-12 h-12 px-3 py-4 ml-4 bg-white rounded-full cursor-pointer bottom-6 left-72"
      on:click={() => (isLeftSidebarOpen = false)}
    >
      <Icons icon="buttonleftarrow" />
    </div>
  </aside>
{:else}

  <aside
    class="fixed z-50 flex flex-col flex-1 flex-shrink-0 w-64 h-screen text-white top-10 bg-dark"
    class:hidden={!isLeftSidebarOpen}
  >

    <div class="relative flex-shrink-0 w-64 p-4 pt-16 space-y-6 text-left">
      {#if navigation}
        {#each navigation as navItem}
          <a
            href="/#/{navItem.url}"
            class="flex content-center justify-start space-x-2"
            on:click={() => (isLeftSidebarOpen = false)}
          >
            <Icons icon={navItem.icon} />
            <div>{navItem.title}</div>
          </a>
        {/each}
      {/if}

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
