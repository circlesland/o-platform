<script lang="ts">
  import Icons from "../../../shared/molecules/Icons.svelte";
  import LeftDesktop from "./desktop/Left.svelte";
  import Home from "../../o-homepage/pages/Home.svelte";
  import RightDesktop from "./desktop/Right.svelte";
  import Text from "../views/Text.svelte";
  import NavigationList from "../views/NavigationList.svelte";
  import FilterList from "../views/FilterList.svelte";
  import Center from "./Center.svelte";
  import NextNav from "../../../shared/molecules/NextNav/NextNav.svelte";
  import {NavigationManifest} from "@o-platform/o-interfaces/dist/navigationManifest";
  import ListComponent from "../../../shared/molecules/NextNav/Components/List.svelte";
  import ActionButtonComponent from "../../../shared/molecules/NextNav/Components/ActionButton.svelte";
  import LinkComponent from "../../../shared/molecules/NextNav/Components/Link.svelte";
  import {Layout} from "./layout";

  // Import Swiper styles
  import "swiper/swiper-bundle.css";

  import "swiper/components/navigation/navigation.min.css";
  import "swiper/components/pagination/pagination.min.css";

  // import Swiper core and required modules
  import SwiperCore, { Pagination, Navigation } from "swiper/core";

  // install Swiper modules
  SwiperCore.use([Navigation, Pagination]);

  let layout:Layout = {
    main: {
      component: Home,
      params: {}
    },
    dialogs: {
      left: {
        isOpen: false,
        component: NavigationList,
        params: {}
      },
      center: {
        isOpen: false,
        component: Text,
        params: {text: "CENTER"}
      },
      right: {
        isOpen: false,
        component: FilterList,
        params: {}
      }
    }
  }

  let navigation: NavigationManifest = {
    navPill: {
      left: {
        component: ListComponent,
        props: {
          icon: "list",
          action: () => {
            layout.dialogs.left.isOpen = !layout.dialogs.left.isOpen;
          },
        },
      },
      center: {
        component: ActionButtonComponent,
        props: {
          icon: "logo",
          action: () => {
            layout.dialogs.center.isOpen = !layout.dialogs.center.isOpen;
          }
        },
      },
      right: {
        component: LinkComponent,
        props: {
          icon: "home",
          action: () => {
            alert("Home sweet home")
          },
        },
      },
    },
    leftSlot: {
      component: LinkComponent,
      props: {
        icon: "list",
        action: () => layout.dialogs.left.isOpen = !layout.dialogs.left.isOpen
      },
    }
  };
</script>

<div class="absolute flex flex-row w-full overflow-auto">
  <main class="relative z-30 w-full overflow-auto">
    <nav class="absolute grid w-full grid-cols-3 carousel top-11">
      <div class="col-start-2 place-self-center">
        {#each [{title: "hello"}, {title: "world"}] as page, i}
          <input
            id="carousel-item-{i}"
            type="radio"
            name="carousel-dots"
            class="hidden"
            checked={false}
          />
          <label for="carousel-item-{i}" class="mx-1">{page.title} {i}</label>
        {/each}
      </div>
    </nav>
    {#if true}
      <div
        class="fixed cursor-pointer top-1/2 left-2"
      >
        <Icons icon="simplearrowleft" />
      </div>
    {/if}
    {#if true}
      <div
        class="fixed cursor-pointer top-1/2 right-2"
      >
        <Icons icon="simplearrowright" />
      </div>
    {/if}
    <div
      class="flex flex-row w-full mainContent"
      class:mb-16={!layout.dialogs.center.isOpen}
      class:blur={layout.dialogs.center.isOpen}
    >
      <div class="fixed">
        {#if layout.dialogs.left.isOpen}
          <LeftDesktop>
            <svelte:component this={layout.dialogs.left.component}
                              {...(layout.dialogs.left.params ? layout.dialogs.left.params : {})}
                              on:clickedOutside={() => layout.dialogs.left.isOpen = false}
                              on:clickedItem={() => layout.dialogs.left.isOpen = false}
                              on:clickedClose={() => layout.dialogs.left.isOpen = false}/>
          </LeftDesktop>
        {/if}
      </div>
      <div class="flex-grow">
        <svelte:component this={layout.main.component}
                          {...(layout.main.params ? layout.main.params : {})} />
      </div>
      <div>
        {#if layout.dialogs.right.isOpen}
          <RightDesktop>
            <svelte:component this={layout.dialogs.right.component}
                              {...(layout.dialogs.right.params ? layout.dialogs.right.params : {})}
                              on:clickedOutside={() => layout.dialogs.right.isOpen = false}
                              on:clickedItem={() => layout.dialogs.right.isOpen = false}
                              on:clickedClose={() => layout.dialogs.right.isOpen = false} />
          </RightDesktop>
        {/if}
      </div>
    </div>
  </main>

</div>

<NextNav navigation={navigation} />

{#if layout.dialogs.center.isOpen}
  <Center blur="true">
    <svelte:component this={layout.dialogs.center.component} {...(layout.dialogs.center.params ? layout.dialogs.center.params : {})} />
  </Center>
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

  .swiper-container {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;

    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }

  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

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
