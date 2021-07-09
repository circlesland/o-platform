<script lang="ts">
  import { Process } from "@o-platform/o-process/dist/interfaces/process";
  import { fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import { CancelRequest } from "@o-platform/o-process/dist/events/cancel";
  import { getLastLoadedDapp, getLastLoadedRoutable } from "../../loader";
  import { Page } from "@o-platform/o-interfaces/dist/routables/page";
  import DappNavItem from "./../atoms/DappsNavItem.svelte";
  import ActionListItem from "./../atoms/ActionListItem.svelte";
  import ProcessContainer from "./ProcessContainer.svelte";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
  import { JumplistItem } from "@o-platform/o-interfaces/dist/routables/jumplist";

  import { Link } from "@o-platform/o-interfaces/dist/routables/link";

  let runningProcess: Process | undefined;
  let jumplistItems: JumplistItem[] | undefined;
  let page: Page<any, any>;
  let navigation:
    | {
        icon?: string;
        title: string;
        url: string;
        extern: boolean;
      }[]
    | undefined;


  export function isOpen() : {
    contentType: "process" | "jumplist" | "page" | "navigation",
    isOpen: boolean;
  } {
    if (runningProcess) {
      return { contentType: "process", isOpen: _isOpen };
    } else if (jumplistItems) {
      return { contentType: "jumplist", isOpen: _isOpen };
    } else if (page) {
      return { contentType: "page", isOpen: _isOpen };
    } else if (navigation) {
      return { contentType: "navigation", isOpen: _isOpen };
    }
    throw new Error(`Invalid state`);
  }

  const dispatch = createEventDispatcher();

  $: {
    dispatch("modalOpen", _isOpen);
  }
  let _isOpen = false;

  export function showJumplist(params: { [x: string]: any }) {
    if (!closeModal()) {
      return;
    }

    const lastDapp = getLastLoadedDapp();
    const lastRoutable = getLastLoadedRoutable();

    let combinedItems: { [x: string]: JumplistItem } = {};

    if (lastDapp.jumplist) {
      try {
        lastDapp.jumplist.items(params, lastDapp).forEach((o) => {
          combinedItems[o.key] = o;
        });
      } catch (e) {
        console.error(`Cannot load the dapp's jumplist`);
      }
    }
    if (lastRoutable.type == "page") {
      const pageJumplist = (<Page<any, any>>lastRoutable).jumplist;
      if (pageJumplist) {
        try {
          pageJumplist.items(params, lastDapp).forEach((o) => {
            combinedItems[o.key] = o;
          });
        } catch (e) {
          console.error(`Cannot load the page's jumplist.`);
        }
      }
    }
    jumplistItems = Object.values(combinedItems);
    _isOpen = true;
  }

  export function showNavigation(dapp: DappManifest<any>) {
    if (!closeModal()) {
      return;
    }
    const routables = dapp.routables.filter(
      (o) => (o.type === "page" || o.type === "link") && !o.isSystem
    );
    navigation = routables.map((o) => {
      if (o.type == "page") {
        return {
          title: o.title,
          icon: o.icon,
          url:
            getLastLoadedDapp().routeParts.join("/") +
            "/" +
            o.routeParts.join("/"),
          extern: false,
        };
      } else {
        return {
          title: o.title,
          icon: o.icon,
          url: (<Link<any, any>>o).url({}, getLastLoadedDapp()),
          extern: (<Link<any, any>>o).openInNewTab,
        };
      }
    });
    _isOpen = true;
  }

  export function showProcess(processId: string) {
    if (!closeModal()) {
      return;
    }
    runningProcess = window.o.stateMachines.findById(processId);
    if (!_isOpen && runningProcess) {
      _isOpen = true;
    }
  }

  export function showPage(page:Page<any, any>) {
    if (!closeModal()) {
      return;
    }
    page = page;
  }

  export function closeModal(): boolean {
    if (runningProcess && _isOpen) {
      runningProcess.sendEvent(new CancelRequest());
      return false;
    }
    if (!runningProcess && _isOpen) {
      _isOpen = false;
    }
    runningProcess = undefined;
    jumplistItems = undefined;
    navigation = undefined;
    dispatch("navigation", null);
    return true;
  }

  const onKeyDown = (e) => {
    if (e.key !== "Escape") return;

    closeModal();
  };
</script>

{#if _isOpen}
  <aside
    id="modalAside"
    on:keydown={onKeyDown}
    aria-labelledby="modal-heading"
    aria-modal="true"
    tabIndex={-1}
    role="dialog"
    in:fade={{ duration: 50 }}
    out:fade={{ duration: 50 }}
    on:click|self={closeModal}
    class="z-40 pt-2 text-base overlay"
  >
    <div
      class="w-full p-2 mt-1 modalAsideContentContainer"
      on:click|self={closeModal}
    >
      <div
        class="w-full bg-white rounded-lg modalAsideContent md:w-2/3 xl:w-1/2"
      >
        <div class="modalAsideScrollableContent">
          <div class="w-full m-auto">
            {#if runningProcess}
              <ProcessContainer
                process={runningProcess}
                on:navigation={(event) => dispatch("navigation", event.detail)}
                on:stopped={() => {
                  runningProcess = null;
                  closeModal();
                }}
              />
            {:else if navigation}
              <div class="flex flex-col p-4 space-y-6">
                {#each navigation as item}
                  <DappNavItem
                    segment={item.url}
                    title={item.title}
                    icon={item.icon}
                    external={item.extern}
                    on:navigate={closeModal}
                  />
                {/each}
              </div>
            {:else if jumplistItems}
              <div
                class="flex flex-wrap items-center justify-center p-4 space-x-10"
              >
                {#each jumplistItems as item}
                  <ActionListItem
                    clickOnly={true}
                    segment=""
                    icon={item.icon}
                    title={item.title}
                    on:navigate={() => {
                      if (item.event) {
                        window.o.publishEvent(item.event);
                      }
                      if (item.action) {
                        item.action();
                      }
                    }}
                  />
                {/each}
              </div>
            {:else}
              Nothing to show
            {/if}
          </div>
        </div>
      </div>
    </div>
  </aside>
{/if}

<style>
  * {
    box-sizing: border-box;
  }
  aside {
    /* z-index: 1000; */
    background-color: rgba(177, 192, 200, 0.4);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    overflow-y: hidden;
    @apply pb-20;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
  .modalAsideContentContainer {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    justify-content: flex-end;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 4.25rem;
  }
  .modalAsideContent {
    flex-grow: 0;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
  .modalAsideScrollableContent {
    flex-grow: 1;
    overflow: auto;
    min-height: 0;
  }
  /* Background Blurring for firefox and other non supportive browsers lies in App.svelte through the .blur class */
  @supports (backdrop-filter: blur(4px)) or (-webkit-backdrop-filter: blur(4px)) {
    aside {
      opacity: 1;
      -webkit-backdrop-filter: blur(4px);
      backdrop-filter: blur(4px);
    }
  }
</style>
