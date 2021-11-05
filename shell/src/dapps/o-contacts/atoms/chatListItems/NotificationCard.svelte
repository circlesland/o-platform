<script>
    import DetailActionBar from "../../../../shared/molecules/DetailActionBar.svelte";
    import Icons from "../../../../shared/molecules/Icons.svelte";
    import Date from "../../../../shared/atoms/Date.svelte";
</script>

<div class="px-2 sm:px-6">
    <div class="flex flex-row w-full p-px space-x-2">

        <div
                class="flex flex-col flex-grow space-y-1 bg-gradient-to-r from-gradient1 to-gradient2 rounded-xl">
            <div
                    class="relative w-full p-4 pt-3 pb-6 text-xs sm:text-sm message chatText"
                    class:border-light-lighter="{['transfer_in', 'invite'].includes(params.content.notificationType)}"
                    class:border-primary-dark="{params.content.notificationType == 'transfer_out'}"
                    class:border-primary-lighter="{params.content.notificationType == 'trust_added'}"
                    class:border-alert-lightest="{params.content.notificationType == 'trust_removed'}">
                <div class="absolute bottom-2 right-3 text-2xs">
                    <Date time="{params.time}" />
                </div>

                <div
                        class="flex flex-row items-center content-center space-x-3"
                        class:text-alert="{params.content.notificationType == 'trust_removed'}">

                    <Icons icon="{params.content.icon}" />

                    <h1 class="uppercase font-heading">{params.content.title}</h1>
                </div>
                <div class="mt-2">
                    {@html params.content.text}
                </div>
                <div class="mt-4">
                    <DetailActionBar actions="{params.content.actions}" />
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .chatText {
        overflow-wrap: break-word;
        word-wrap: break-word;
        -ms-word-break: break-all;
        word-break: break-word;
        -ms-hyphens: auto;
        -moz-hyphens: auto;
        -webkit-hyphens: auto;
        hyphens: auto;
    }
</style>
