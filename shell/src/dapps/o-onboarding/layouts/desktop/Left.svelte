<aside class="z-50 flex flex-col flex-1 flex-shrink-0 w-64 h-screen mt-12">
    <div class="">
        <!-- Sidebar -->
        <div class="fixed inset-y-0 z-10 flex w-72 sidebar">
            <!-- Sidebar content -->
            <div class="z-10 flex flex-col flex-1 ">
                <nav class="flex flex-col flex-1 w-64 p-4 mt-4"/>
                <div class="relative flex-shrink-0 w-64 p-4 pt-4 pb-20 space-y-2">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</aside>