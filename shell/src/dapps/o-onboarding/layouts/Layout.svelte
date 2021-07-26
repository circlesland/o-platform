<script lang="ts">
    import Icons from "../../../shared/molecules/Icons.svelte";
    import LeftDesktop from "./desktop/Left.svelte";
    import LeftMobile from "./mobile/Left.svelte";
    import RightDesktop from "./desktop/Right.svelte";
    import RightMobile from "./mobile/Right.svelte";
    import Text from "../views/Text.svelte";
    import NavigationList from "../views/NavigationList.svelte";
    import FilterList from "../views/FilterList.svelte";
    import Center from "./Center.svelte";
    import NextNav from "../../../shared/molecules/NextNav/NextNav.svelte";
    import {NavigationManifest} from "@o-platform/o-interfaces/dist/navigationManifest";
    import ListComponent from "../../../shared/molecules/NextNav/Components/List.svelte";
    import ActionButtonComponent from "../../../shared/molecules/NextNav/Components/ActionButton.svelte";
    import LinkComponent from "../../../shared/molecules/NextNav/Components/Link.svelte";
    import {isMobile} from "../../../shared/functions/isMobile";

    let dialogs = {
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
    };

    let route = "homepage";
    let navManifest: NavigationManifest = {
        navPill: {
            left: {
                component: ListComponent,
                props: {
                    icon: "list",
                    action: () => {
                        dialogs.left.isOpen = !dialogs.left.isOpen;
                    },
                },
            },
            center: {
                component: ActionButtonComponent,
                props: {
                    icon: "logo",
                    action: () => {
                        dialogs.center.isOpen = !dialogs.center.isOpen;
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
                    />
                    <label for="carousel-item-{i}" class="mx-1">{page.title} {i}</label>
                {/each}
            </div>
        </nav>
        {#if false}
            <div class="fixed cursor-pointer top-1/2 left-2">
                <Icons icon="simplearrowleft" />
            </div>
        {/if}
        {#if false}
            <div class="fixed cursor-pointer top-1/2 right-2">
                <Icons icon="simplearrowright" />
            </div>
        {/if}
        <div
                class="flex flex-row w-full mainContent"
                class:mb-16={!dialogs.center.isOpen || route !== "homepage"}
                class:blur={dialogs.center.isOpen}
        >
            <div class="fixed">
                {#if dialogs.left.isOpen}

                    {#if isMobile()}
                        <LeftMobile on:click={() => dialogs.left.isOpen = false}>
                            <svelte:component this={dialogs.left.component}
                                              {...(dialogs.left.params ? dialogs.left.params : {})}
                                              on:clickedOutside={() => dialogs.left.isOpen = false}
                                              on:clickedItem={() => dialogs.left.isOpen = false}
                                              on:clickedClose={() => dialogs.left.isOpen = false} />
                        </LeftMobile>
                    {:else}
                        <LeftDesktop>
                            <svelte:component this={dialogs.left.component}
                                              {...(dialogs.left.params ? dialogs.left.params : {})}
                                              on:clickedOutside={() => dialogs.left.isOpen = false}
                                              on:clickedItem={() => dialogs.left.isOpen = false}
                                              on:clickedClose={() => dialogs.left.isOpen = false}/>
                        </LeftDesktop>
                    {/if}
                {/if}
            </div>
            <div class="flex-grow">
                <div class="flex flex-col overflow-hidden ">
                    MAIN<br/>
                    <button on:click={() => dialogs.right.isOpen = true}>Open right</button>
                </div>
            </div>
            <div>
                {#if dialogs.right.isOpen}
                    {#if isMobile}
                        <RightMobile on:click={() => dialogs.right.isOpen = false}>
                            <svelte:component this={dialogs.right.component}
                                              {...(dialogs.right.params ? dialogs.right.params : {})} />
                        </RightMobile>
                    {:else}
                        <RightDesktop>
                            <svelte:component this={dialogs.right.component}
                                              {...(dialogs.right.params ? dialogs.right.params : {})} />
                        </RightDesktop>
                    {/if}
                {/if}
            </div>
        </div>
    </main>
</div>

{#if !(isMobile && (dialogs.left.isOpen || dialogs.right.isOpen))}
    <NextNav navigation={navManifest} />
{/if}

{#if dialogs.center.isOpen}
    <Center blur="true">
        <svelte:component this={dialogs.center.component} {...(dialogs.center.params ? dialogs.center.params : {})} />
        <button class="text-info" on:click={() => dialogs.center.isOpen = false}>Close</button>
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
