<script lang="ts">
    import {fly} from "svelte/transition";
    import Icons from "../../../../shared/molecules/Icons.svelte";

    let x = -500;
</script>
<aside class="flex sideBarLeft">
    <div class="">
        <!-- Sidebar -->
        <div
                class="fixed inset-y-0 z-10 flex w-72 sidebar"
                in:fly|local={{ x, delay: 50 }}
                out:fly|local={{ x: x, duration: 120 }}
        >
            <!-- Sidebar content -->
            <slot />
        </div>
    </div>
    <div class="fixed z-50 flex justify-center flex-shrink-0 w-12 h-12 px-3 py-4 ml-4 bg-white rounded-full cursor-pointer bottom-6 left-72"
         on:click>
        <Icons icon="buttonleftarrow" />
    </div>
</aside>

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