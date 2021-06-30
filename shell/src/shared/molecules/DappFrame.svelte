<script lang="ts">
    import {onMount} from "svelte";
    import {getLastLoadedDapp} from "../../loader";
    import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";

    export let params:{[x:string]:any}|undefined;

    export let innerComponent:any;
    export let onMountAction: ((params:{[x:string]:any}|undefined) => PlatformEvent)|undefined;

    onMount(() => {
       const lastLoaddedDapp = getLastLoadedDapp<any>();
       lastLoaddedDapp.params = params;
        console.log("Got params:", params)

        if (onMountAction) {
            const event = onMountAction(params);
            window.o.publishEvent(event);
        }
    });
</script>
{#if innerComponent}
    <svelte:component this={innerComponent} params={params} />
{:else}
    <h1>No component</h1>
{/if}