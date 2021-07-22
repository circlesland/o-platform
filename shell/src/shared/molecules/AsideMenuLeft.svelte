<script lang="ts">
  import Icons from "./Icons.svelte";
  import UAParser from "ua-parser-js";
  import { fly } from "svelte/transition";
  import { getRouteList } from "./../functions/GetNavigationManifest.svelte";
  import { createEventDispatcher } from "svelte";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { clickOutside } from "src/shared/functions/clickOutside.ts";

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

  let x = -500;
  let visible = false;
  let animationSpeed: number = 220;

  const uaParser = new UAParser();
  const dispatch = createEventDispatcher();

  let detectedDevice = uaParser.getDevice();
  let isMobile = true;

  if (detectedDevice && detectedDevice.type != "mobile") {
    isMobile = false;
  } else {
    isMobile = true;
    animationSpeed = 50;
  }

  export function showNavigation(dapp: DappManifest<any>) {
    navigation = getRouteList(dapp, runtimeDapp);
    if (isLeftSidebarOpen) {
      setTimeout(() => {
        dispatch("openLeftSidebar", {
          state: false,
        });
      }, 120);
      isLeftSidebarOpen = false;
      visible = false;
    } else {
      setTimeout(() => {
        dispatch("openLeftSidebar", {
          state: true,
        });
        isLeftSidebarOpen = true;
      }, animationSpeed);
      visible = true;
    }
  }

  function handleCloseSideBar() {
    console.log("YEAH");
    if (isLeftSidebarOpen) {
      setTimeout(() => {
        dispatch("openLeftSidebar", {
          state: false,
        });
        isLeftSidebarOpen = false;
      }, animationSpeed);

      visible = false;
    }
  }

  function handleClickOutside(event) {
    handleCloseSideBar();
  }
</script>

{#if isMobile}

  <aside class="flex sideBarLeft" class:hidden={!isLeftSidebarOpen}>
    <div class="">
      <!-- Sidebar -->
      {#if visible}
        <div
          class="fixed inset-y-0 z-10 flex w-72 sidebar"
          in:fly|local={{ x, delay: 50 }}
          out:fly|local={{ x: x, duration: 120 }}
        >
          <!-- Sidebar content -->

          <div
            class="z-10 flex flex-col flex-1 text-white bg-dark"
            use:clickOutside
            on:click_outside={handleClickOutside}
          >
            <nav class="flex flex-col flex-1 w-64 p-4 mt-4" />
            <div class="relative flex-shrink-0 w-64 p-6 pt-4 pb-8 space-y-6">
              {#if navigation}
                {#each navigation as navItem}
                  <a
                    href="/#/{navItem.url}"
                    class="flex content-center justify-start space-x-2"
                    target={navItem.extern ? '_blank' : '_self'}
                    on:click={() => handleCloseSideBar()}
                  >
                    <Icons icon={navItem.icon} />
                    <div>{navItem.title}</div>
                  </a>
                {/each}
              {/if}
            </div>
          </div>

        </div>
      {/if}
    </div>
    <div
      class="fixed z-50 flex justify-center flex-shrink-0 w-12 h-12 px-3 py-4 ml-4 bg-white rounded-full cursor-pointer bottom-6 left-72"
      on:click={() => handleCloseSideBar()}
    >
      <Icons icon="buttonleftarrow" />
    </div>
  </aside>

{:else}

  {#if visible}
    <aside
      class="fixed z-50 flex flex-col flex-1 flex-shrink-0 w-64 h-screen text-white top-10 bg-dark"
      in:fly|local={{ x, delay: 50 }}
      out:fly|local={{ x: x, duration: 1420 }}
    >

      <div
        class="relative flex-shrink-0 w-64 h-screen p-4 pt-16 space-y-6 text-left"
        use:clickOutside
        on:click_outside={handleClickOutside}
      >
        {#if navigation}
          {#each navigation as navItem}
            <a
              href="/#/{navItem.url}"
              class="flex content-center justify-start space-x-2"
              on:click={() => handleCloseSideBar()}
              target={navItem.extern ? '_blank' : '_self'}
            >
              <Icons icon={navItem.icon} />
              <div>{navItem.title}</div>
            </a>
          {/each}
        {/if}

      </div>
    </aside>
  {/if}
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
