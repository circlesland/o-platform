<script lang="ts">
  import LeftDesktop from "./desktop/Left.svelte";
  import LeftMobile from "./mobile/Left.svelte";
  import RightDesktop from "./desktop/Right.svelte";
  import Center from "./Center.svelte";
  import NextNav from "../../../shared/molecules/NextNav/NextNav.svelte";
  import {NavigationManifest} from "@o-platform/o-interfaces/dist/navigationManifest";
  import ListComponent from "../../../shared/molecules/NextNav/Components/List.svelte";
  import {isMobile} from "../../../shared/functions/isMobile";
  import {RuntimeLayout} from "./layout";
  import Pager from "../views/Pager.svelte";
  import "simplebar";
  import "simplebar/dist/simplebar.css";

  let dapp = "homepage:!";

  export let layout: RuntimeLayout;
  export let navigation: NavigationManifest = {
    navPill: {
      left: {
        component: ListComponent,
        props: {
          icon: "list",
          action: () => {
            if (!layout || !layout.dialogs)
              return;
            layout.dialogs.left.isOpen = !layout.dialogs.left.isOpen;
          },
        },
      }
    }
  };

  $: {
    console.log("Layout - Layout changed:", layout);
  }

  const sliderPages = [
    /*{
    export const sliderPages = [/*{
        title: "Item 1"
    },{
        title: "Item 2"
    }*/
  ];
</script>

{#if layout}
  <div class="absolute flex flex-row w-full overflow-auto">
    <main class="relative z-30 w-full overflow-auto">
      {#if sliderPages && sliderPages.length > 0}
        <Pager pages={sliderPages} />
      {/if}
      <div
        class="flex flex-row w-full mainContent"
        class:mb-16={layout.dialogs.center && !layout.dialogs.center.isOpen && dapp === 'homepage:1'}
        class:blur={layout.dialogs.center && layout.dialogs.center.isOpen}
      >
        <div class="fixed z-50">
          {#if layout.dialogs.left && layout.dialogs.left.isOpen}
            <LeftMobile on:click={() => (layout.dialogs.left.isOpen = false)}>
              <svelte:component
                this={layout.dialogs.left.component}
                {...layout.dialogs.left.params ? layout.dialogs.left.params : {}}
                on:clickedOutside={() => (layout.dialogs.left.isOpen = false)}
                on:clickedItem={() => (layout.dialogs.left.isOpen = false)}
                on:clickedClose={() => (layout.dialogs.left.isOpen = false)}
              />
            </LeftMobile>
            <LeftDesktop>
              <svelte:component
                this={layout.dialogs.left.component}
                {...layout.dialogs.left.params ? layout.dialogs.left.params : {}}
                on:clickedOutside={() => (layout.dialogs.left.isOpen = false)}
                on:clickedItem={() => (layout.dialogs.left.isOpen = false)}
                on:clickedClose={() => (layout.dialogs.left.isOpen = false)}
              />
            </LeftDesktop>
          {/if}
        </div>
        <div class="flex-grow">
          {#if layout.main}
            <svelte:component
              this={layout.main.component}
              {...layout.main.params ? layout.main.params : {}}
            />
          {/if}
        </div>
        <div>
          {#if layout.dialogs.right && layout.dialogs.right.isOpen}
            <RightDesktop>
              <svelte:component
                this={layout.dialogs.right.component}
                {...layout.dialogs.right.params ? layout.dialogs.right.params : {}}
                on:clickedOutside={() => (layout.dialogs.right.isOpen = false)}
                on:clickedItem={() => (layout.dialogs.right.isOpen = false)}
                on:clickedClose={() => (layout.dialogs.right.isOpen = false)}
              />
            </RightDesktop>
          {/if}
        </div>
      </div>
    </main>
  </div>

  {#if navigation}
    <NextNav {navigation} />
  {/if}

  {#if layout.dialogs.center && layout.dialogs.center.isOpen}
    <Center blur="true">
      <svelte:component
        this={layout.dialogs.center.component}
        {...layout.dialogs.center.params ? layout.dialogs.center.params : {}}
      />
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
  .tab:hover,
  .tab:focus,
  .tab:active {
    @apply text-light;
  }

  .tab:hover {
    @apply text-base;
  }

  .isOpen {
    background: transparent;
    border: none;
  }

  /* Background Blurring for firefox and other non supportive browsers */
  @supports not (
    (backdrop-filter: blur(4px)) or (-webkit-backdrop-filter: blur(4px))
  ) {
    .blur {
      filter: blur(4px);
      -webkit-transition: all 0.35s ease-in-out;
      -moz-transition: all 0.35s ease-in-out;
      transition: all 0.35s ease-in-out;
    }

    /* Firefox fix for sticky bottom prev-sibling height */
    main {
      padding-bottom: 4rem;
    }
  }

  .joinnowbutton {
    transform: translate(-50%, 0) !important;
    animation: none !important;
  }

  .joinnowbutton:active:focus,
  .joinnowbutton:active:hover {
    transform: translate(-50%, 0);
    animation: none !important;
  }

  /* .mainContent {
      --tw-text-opacity: 1;
      background-image: linear-gradient(
        180deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(253, 254, 255, 1) 85%,
        rgba(13, 43, 102, 0) 100%
      );
    } */

  nav.carousel:hover {
    @apply cursor-default;
  }

  /* Hide the radio button */
  nav.carousel input[type="radio"] {
    display: none;
  }

  /* All styling takes place on the label element */
  nav.carousel label {
    @apply inline-block;
    @apply bg-dark;
    @apply overflow-hidden;
    @apply rounded-full;
    @apply w-2;
    @apply h-2;
    text-indent: -999px;
    /* box-shadow: inset 0 1px 1px 0 #999; */
  }
  nav.carousel label:hover {
    @apply bg-dark;
    @apply cursor-pointer;
    /* box-shadow: inset 0 1px 1px 0 #777; */
  }
  nav.carousel input:checked + label {
    @apply bg-light;
    /* box-shadow: inset 0 0 1px 1px #087dc0; */
  }
</style>
