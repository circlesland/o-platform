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
          <div class="relative flex-shrink-0 w-64 p-4 pt-4 space-y-4">
            <!-- {#each navigation as navItem}
              <a href={navItem.url} class="flex items-center space-x-2">
                <Icons icon={navItem.icon} />
                <span>{navItem.title}</span>
              </a>
            {/each} -->

          </div>
        </div>
      </div>
    </div>
    <div
      class="absolute z-50 flex justify-center flex-shrink-0 w-12 h-12 px-3 py-3
      ml-4 bg-white rounded-full cursor-pointer bottom-4 left-72"
      on:click={() => (isLeftSidebarOpen = false)}
    >
      <Icons icon="buttonleftarrow" />
    </div>
  </aside>
{:else}

  <aside
    class="z-50 top-10 fixed flex flex-col flex-1 flex-shrink-0 w-64 h-screen
    text-white bg-dark"
    class:hidden={!isLeftSidebarOpen}
  >

    <div class="relative flex-shrink-0 w-64 p-4 pt-16 space-y-4 text-left">
      {#if navigation}
        {#each navigation as navItem}
          <a
            href={navItem.url}
            class="flex content-center justify-start space-x-2"
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
