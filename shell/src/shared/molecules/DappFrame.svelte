<script lang="ts">
    import {onMount} from "svelte";
    import {Routable} from "@o-platform/o-interfaces/dist/routable";
    import {Page} from "@o-platform/o-interfaces/dist/routables/page";
    import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";
    import {Trigger} from "@o-platform/o-interfaces/dist/routables/trigger";

    export let params:{[x:string]:any}|undefined;
    export let getDappEntryPoint:() => Promise<Routable>;
    export let dappManifest: DappManifest<any>;

    let _entryPage:Page<any, any>;
    let _entryTrigger:Trigger;

    onMount(async () => {
        if (!dappManifest) {
            throw new Error(`The 'dappManifest' parameter is not set.`);
        }
        const entryPoint = await getDappEntryPoint()
        if (!entryPoint) {
            throw new Error(`Couldn't find the dapp entry point.`);
        }
        if (entryPoint.type === "page"){
            _entryPage = <Page<any, any>>entryPoint;
        } else if (entryPoint.type === "trigger") {
            _entryTrigger = <Trigger>entryPoint;
            _entryTrigger.eventFactory(params, dappManifest);
        } else {
            throw new Error(`Entry point type '${entryPoint.type}' is not supported by the DappFrame.`)
        }
    });
</script>
{#if _entryPage}
    <svelte:component this={_entryPage.component} params={params} />
{:else}
    <h1>No component</h1>
{/if}