<script lang="ts">
  import Icons from "./Icons.svelte";
  import LinkPill from "../atoms/LinkPill.svelte";
  import UAParser from "ua-parser-js";
  import { fly } from "svelte/transition";
  import { getRouteList } from "./../functions/GetNavigationManifest.svelte";
  import { createEventDispatcher } from "svelte";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { clickOutside } from "src/shared/functions/clickOutside.ts";
  import { run } from "svelte/internal";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";

  export let routable: Routable;
  export let runtimeDapp: RuntimeDapp<any>;
  export let isLeftSidebarOpen: boolean = false;

  let navigation:
    | {
        icon?: string;
        title: string;
        url: string;
        extern: boolean;
        isActive: boolean;
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

  $: {
    if (!isMobile) {
      showNavigation(runtimeDapp, routable);
      isLeftSidebarOpen = true;
    }
  }
  export function showNavigation(dapp: DappManifest<any>, routable: Routable) {
    navigation = getRouteList(dapp, runtimeDapp, routable);

    if (isLeftSidebarOpen) {
      dispatch("openLeftSidebar", {
        state: false,
      });
      isLeftSidebarOpen = false;
      visible = false;
    } else {
      dispatch("openLeftSidebar", {
        state: true,
      });
      isLeftSidebarOpen = true;
      visible = true;
    }
  }

  function handleCloseSideBar() {
    if (isMobile) {
      if (isLeftSidebarOpen) {
        dispatch("openLeftSidebar", {
          state: false,
        });
        isLeftSidebarOpen = false;
        visible = false;
      }
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
                  href={navItem.extern ? navItem.url : '/#/' + navItem.url}
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

    </div>
    <div
      class="fixed z-50 flex justify-center flex-shrink-0 w-12 h-12 px-3 py-4 ml-4 bg-white rounded-full cursor-pointer bottom-6 left-72"
      on:click={() => handleCloseSideBar()}
    >
      <Icons icon="buttonleftarrow" />
    </div>
  </aside>

{:else}

  <aside
    class="z-50 flex flex-col flex-1 flex-shrink-0 w-64 h-screen mt-12"
    class:hidden={!isLeftSidebarOpen}
  >

    <div class="">
      <!-- Sidebar -->

      <div class="fixed inset-y-0 z-10 flex w-72 sidebar">
        <!-- Sidebar content -->

        <div class="z-10 flex flex-col flex-1 ">
          <nav class="flex flex-col flex-1 w-64 p-4 mt-4" />
          <div class="relative flex-shrink-0 w-64 p-6 pt-4 pb-20 space-y-2">
            {#if navigation}
              {#each navigation as navItem}
                <LinkPill
                  props={{ icon: navItem.icon, text: navItem.title, link: navItem.url, isActive: navItem.isActive }}
                />
              {/each}
            {/if}
          </div>
        </div>

      </div>

    </div>

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
