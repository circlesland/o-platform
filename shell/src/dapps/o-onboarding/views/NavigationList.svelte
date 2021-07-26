<script>
    import Icons from "../../../shared/molecules/Icons.svelte";
    import { clickOutside } from "src/shared/functions/clickOutside.ts";
    import {createEventDispatcher} from "svelte";
    import {isMobile} from "../../../shared/functions/isMobile";

    const navigation = [
        {extern:true, url:"https://circles.land", icon: "home", title: "Link 1"},
        {extern:true, url:"https://circles.land", icon: "home", title: "Link 2"},
        {extern:true, url:"https://circles.land", icon: "home", title: "Link 3"},
        {extern:true, url:"https://circles.land", icon: "home", title: "Link 4"}
    ];

    const eventDispatcher = createEventDispatcher();
</script>
<div
        class="z-10 flex flex-col flex-1 text-white bg-dark"
        use:clickOutside
        on:click_outside={() => eventDispatcher("clickedOutside")}
>
    <nav class="flex flex-col flex-1 w-64 p-4 mt-4" />
    <div class="relative flex-shrink-0 w-64 p-6 pt-4 pb-8 space-y-6">
        {#if navigation}
            {#each navigation as navItem}
                <a
                        href={navItem.extern ? navItem.url : '/#/' + navItem.url}
                        class="flex content-center justify-start space-x-2"
                        target={navItem.extern ? '_blank' : '_self'}
                        on:click={() => eventDispatcher("clickedItem")}
                >
                    <Icons icon={navItem.icon} />
                    <div>{navItem.title}</div>
                </a>
            {/each}
        {/if}
    </div>
</div>
{#if isMobile()}
    <div
            class="fixed z-50 flex justify-center flex-shrink-0 w-12 h-12 px-3 py-4 ml-4 bg-white rounded-full cursor-pointer bottom-6 left-72"
            on:click={() => eventDispatcher("clickedClose")}
    >
        <Icons icon="buttonleftarrow" />
    </div>
{/if}