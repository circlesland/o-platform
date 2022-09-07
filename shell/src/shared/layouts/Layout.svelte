<script lang="ts">
import LeftDesktop from "./desktop/Left.svelte";
import LeftMobile from "./mobile/Left.svelte";
import RightDesktop from "./desktop/Right.svelte";
import Center from "./Center.svelte";
import NextNav from "../molecules/NextNav/NextNav.svelte";
import { NavigationManifest } from "@o-platform/o-interfaces/dist/navigationManifest";

import { RuntimeLayout } from "./layout";

import { createEventDispatcher } from "svelte";
import { media } from "../stores/media";

let dapp = "homepage:1";
let menuOpen: boolean;

const eventDispatcher = createEventDispatcher();

export let layout: RuntimeLayout;
export let navigation: NavigationManifest;

$: {
  // console.log("LayoutChanged:", layout);
  if (
    (layout?.dialogs.center && layout?.dialogs.center.isOpen) ||
    ($media.small && layout?.dialogs.left && layout?.dialogs.left.isOpen)
  ) {
    menuOpen = true;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";

    // document.getElementById("main").style.height = "100%";
    document.body.style.height = "100%";
    document.body.style.width = "100%";
  } else {
    menuOpen = false;
    document.body.style.overflow = "inherit";
    document.body.style.position = "inherit";

    // document.getElementById("main").style.height = "inherit";
    document.body.style.height = "inherit";
    document.body.style.width = "inherit";
  }
}

function handleClickOutside(event) {
  event.preventDefault();
  window.o.publishEvent({
    type: "shell.requestCloseModal",
  });
}

function onkeydown(e: KeyboardEvent) {
  if (e.key == "Escape") {
    window.o.publishEvent({ type: "process.cancelRequest" });
  }
}
</script>

<svelte:window on:keydown="{onkeydown}" />
{#if layout}
  <div class="absolute flex flex-row w-full overflow-auto">
    <main id="main" class="relative w-full overflow-auto overflow-hidden">
      <div
        class="flex flex-row w-full bg-dappbackground mainContent"
        class:mb-16="{layout.dialogs.center && !layout.dialogs.center.isOpen && dapp === 'homepage:1'}"
        class:blur="{layout.dialogs.center && layout.dialogs.center.isOpen}">
        <div class="z-50">
          {#if layout.dialogs.left && layout.dialogs.left.isOpen}
            {#if $media.small}
              <LeftMobile>
                <svelte:component
                  this="{layout.dialogs.left.component}"
                  {...layout.dialogs.left.params ? layout.dialogs.left.params : {}}
                  on:clickedOutside="{() =>
                    eventDispatcher('clickedOutside', {
                      position: 'left',
                    })}"
                  on:clickedItem="{() =>
                    eventDispatcher('clickedItem', {
                      position: 'left',
                    })}"
                  on:clickedClose="{() =>
                    eventDispatcher('clickedClose', {
                      position: 'left',
                    })}" />
              </LeftMobile>
            {:else if $media.large}
              <LeftDesktop>
                <svelte:component
                  this="{layout.dialogs.left.component}"
                  {...layout.dialogs.left.params ? layout.dialogs.left.params : {}}
                  on:clickedOutside="{() =>
                    eventDispatcher('clickedOutside', {
                      position: 'left',
                    })}"
                  on:clickedItem="{() =>
                    eventDispatcher('clickedItem', {
                      position: 'left',
                    })}"
                  on:clickedClose="{() =>
                    eventDispatcher('clickedClose', {
                      position: 'left',
                    })}" />
              </LeftDesktop>
            {/if}
          {/if}
        </div>
        <div class="flex-grow">
          {#if layout.main}
            <svelte:component this="{layout.main.component}" {...layout.main.params ? layout.main.params : {}} />
          {/if}
        </div>
        <div>
          {#if layout.dialogs.right && layout.dialogs.right.isOpen}
            <RightDesktop>
              <svelte:component
                this="{layout.dialogs.right.component}"
                {...layout.dialogs.right.params ? layout.dialogs.right.params : {}}
                on:clickedOutside="{() =>
                  eventDispatcher('clickedOutside', {
                    position: 'right',
                  })}"
                on:clickedItem="{() =>
                  eventDispatcher('clickedItem', {
                    position: 'right',
                  })}"
                on:clickedClose="{() =>
                  eventDispatcher('clickedClose', {
                    position: 'right',
                  })}" />
            </RightDesktop>
          {/if}
        </div>
      </div>
    </main>
  </div>
  {#if layout.main && layout.main.runtimeDapp.featuredAction}
    {#await layout.main.runtimeDapp.featuredAction() then action}
      {#if action}
        <div
          class="fixed z-10 flex flex-col items-center justify-end w-32 h-12 -ml-16 left-1/2 bottom-20"
          class:hidden="{menuOpen}">
          <section class="mb-4">
            <button class="w-32 rounded-full btn btn-primary" on:click="{action.action}">
              {action.text}
            </button>
          </section>
        </div>
      {/if}
    {/await}
  {/if}
  {#if navigation}
    <NextNav navigation="{navigation}" />
  {/if}

  {#if layout.dialogs.center && layout.dialogs.center.isOpen}
    <Center blur="true" on:clickedOutside="{handleClickOutside}">
      <svelte:component
        this="{layout.dialogs.center.component}"
        {...layout.dialogs.center.params ? layout.dialogs.center.params : {}} />
    </Center>
  {/if}
{/if}

<style>
/* Background Blurring for firefox and other non supportive browsers */
@supports not ((backdrop-filter: blur(4px)) or (-webkit-backdrop-filter: blur(4px))) {
  .blur {
    filter: blur(4px);
    -webkit-transition: all 0.35s ease-in-out;
    -moz-transition: all 0.35s ease-in-out;
    transition: all 0.35s ease-in-out;
    margin: 0;
  }
}
main {
  z-index: 9;
}
:global(.menu-open main) {
  z-index: 12;
}
</style>
