<script lang="ts">
    import {onMount} from "svelte";
    import {Routable} from "@o-platform/o-interfaces/dist/routable";
    import {Page} from "@o-platform/o-interfaces/dist/routables/page";
    import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";
    import {Trigger} from "@o-platform/o-interfaces/dist/routables/trigger";
    import {DappLoading} from "@o-platform/o-events/dist/shell/dappLoading";
    import {getLastLoadedPage} from "../../loader";

    export let params:{[x:string]:any}|undefined;
    export let getDappEntryPoint:() => Promise<Routable>;
    export let dappManifest: DappManifest<any>;

    let _entryPage:Page<any, any>;
    let _entryTrigger:Trigger<any,any>;
    let _lastLoadedPage:Page<any, any>;

    onMount(async () => {
        const lastLoadedPage = getLastLoadedPage();
        if (!dappManifest) {
            throw new Error(`The 'dappManifest' parameter is not set.`);
        }

        const entryPoint = await getDappEntryPoint();
        window.o.publishEvent(new DappLoading(
            dappManifest, entryPoint, params
        ));
        if (!entryPoint) {
            throw new Error(`Couldn't find the dapp entry point.`);
        }

        if (entryPoint.type === "page"){
            _entryPage = <Page<any, any>>entryPoint;
        } else if (entryPoint.type === "trigger") {
            _entryTrigger = <Trigger<any,any>>entryPoint;
            const triggerEvent = _entryTrigger.eventFactory(params, dappManifest);
            if (!triggerEvent) {
                throw new Error(`The _entryTrigger.eventFactory didn't return an event.`)
            }
            window.o.publishEvent(triggerEvent);
        } else {
            throw new Error(`Entry point type '${entryPoint.type}' is not supported by the DappFrame.`)
        }

        if (lastLoadedPage) {
            // Deffer the loading of the background to make the event-processing of Triggers much snappier
            setTimeout(() => {
                _lastLoadedPage =lastLoadedPage;
            }, 1);
        }
    });
</script>
{#if _entryPage}
    <svelte:component this={_entryPage.component} params={params} />
{:else if _lastLoadedPage}
    <!-- Whenever a Trigger is called via URL, just display the last page (in the background) -->
    <svelte:component this={_lastLoadedPage.component} params={params} />
{:else}
    <h1>No component</h1>
{/if}