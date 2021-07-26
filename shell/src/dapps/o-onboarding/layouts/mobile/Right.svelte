<script lang="ts">
    import {fly} from "svelte/transition";
    import Icons from "../../../../shared/molecules/Icons.svelte";

    let x = 500;
</script>
<aside class="flex sideBarRight">
    <div class="w-64">
        <!-- Sidebar -->
        <div
                class="fixed inset-y-0 z-10 flex w-64 sidebar"
                in:fly|local={{ x, delay: 200 }}
                out:fly|local={{ x: x, duration: 200 }}
        >
            <!-- Sidebar content -->
            <div class="z-10 flex flex-col flex-1 text-white bg-dark">
                <nav class="flex flex-col flex-1 w-64 p-4 mt-4"/>
                <div class="flex-shrink-0 p-4 space-y-4">
                    <slot />
                </div>
            </div>
        </div>
    </div>
    <div class="absolute z-50 flex justify-center flex-shrink-0 w-12 h-12 px-3 py-3 ml-4 bg-white rounded-full cursor-pointer bottom-4 right-72"
         on:click>
        <Icons icon="buttonrightarrow"/>
    </div>
</aside>

<style>
    .sideBarRight {
        z-index: 99;
        background-color: rgba(177, 192, 200, 0.4);
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;

        align-items: flex-end;
        justify-content: center;
        overflow-y: hidden;
        @apply pb-20;

        flex-direction: column;
        height: 100%;
        width: 100%;
    }

    .sideBarRight .sidebar {
        --tw-shadow: 0 25px 50px 82px rgba(0, 0, 0, 0.45);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
        var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    }
</style>