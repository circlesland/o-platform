<script lang="ts">
import LeftDesktop from "./desktop/Left.svelte";
import LeftMobile from "./mobile/Left.svelte";
import RightDesktop from "./desktop/Right.svelte";
import Center from "./Center.svelte";
import NextNav from "src/shared/molecules/NextNav/NextNav.svelte";
import { NavigationManifest } from "@o-platform/o-interfaces/dist/navigationManifest";
import { isMobile } from "src/shared/functions/isMobile";
import { RuntimeLayout } from "./layout";
import Pager from "src/shared/molecules/Pager.svelte";
import "simplebar";
import "simplebar/dist/simplebar.css";
import { createEventDispatcher } from "svelte";
import { media } from "../stores/media";

let dapp = "homepage:!";

const eventDispatcher = createEventDispatcher();

export let layout: RuntimeLayout;
export let navigation: NavigationManifest;

const sliderPages = [
  /*{
    export const sliderPages = [/*{
        title: "Item 1"
    },{
        title: "Item 2"
    }*/
];
$: {
  console.log("LayoutChanged:", layout);
  if (
    (layout.dialogs.center && layout.dialogs.center.isOpen) ||
    ($media.small && layout.dialogs.left && layout.dialogs.left.isOpen)
  ) {
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.height = "100%";
    document.body.style.width = "100%";
  } else {
    document.body.style.overflow = "inherit";
    document.body.style.position = "inherit";
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
    <main class="relative z-30 w-full overflow-auto overflow-hidden">
      {#if sliderPages && sliderPages.length > 0}
        <Pager pages="{sliderPages}" />
      {/if}
      <div
        class="flex flex-row w-full bg-gray-100 mainContent"
        class:mb-16="{layout.dialogs.center &&
          !layout.dialogs.center.isOpen &&
          dapp === 'homepage:1'}"
        class:blur="{layout.dialogs.center && layout.dialogs.center.isOpen}">
        <div class="z-50">
          {#if layout.dialogs.left && layout.dialogs.left.isOpen}
            {#if $media.small}
              <LeftMobile>
                <svelte:component
                  this="{layout.dialogs.left.component}"
                  {...layout.dialogs.left.params
                    ? layout.dialogs.left.params
                    : {}}
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
                  {...layout.dialogs.left.params
                    ? layout.dialogs.left.params
                    : {}}
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
            <svelte:component
              this="{layout.main.component}"
              {...layout.main.params ? layout.main.params : {}} />
          {/if}
        </div>
        <div>
          {#if layout.dialogs.right && layout.dialogs.right.isOpen}
            <RightDesktop>
              <svelte:component
                this="{layout.dialogs.right.component}"
                {...layout.dialogs.right.params
                  ? layout.dialogs.right.params
                  : {}}
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

{#if !isMobile()}
  <style>
  nav.carousel:hover {
    @apply cursor-default;
  }

  /* Hide the radio button */
  nav.carousel input[type="radio"] {
    display: none;
  }
  </style>
{/if}

<style>
/* Background Blurring for firefox and other non supportive browsers */
@supports not (
  (backdrop-filter: blur(4px)) or (-webkit-backdrop-filter: blur(4px))
) {
  .blur {
    filter: blur(4px);
    -webkit-transition: all 0.35s ease-in-out;
    -moz-transition: all 0.35s ease-in-out;
    transition: all 0.35s ease-in-out;
    margin: -9px -1px -41px -11px;
  }
}
</style>
