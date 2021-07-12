<script lang="ts">
    import {onMount} from "svelte";
    import {Routable} from "@o-platform/o-interfaces/dist/routable";
    import {Page} from "@o-platform/o-interfaces/dist/routables/page";
    import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";
    import {Trigger} from "@o-platform/o-interfaces/dist/routables/trigger";
    import {dapps, setLastLoadedDapp, setLastLoadedRoutable} from "../../loader";
    import {arraysEqual} from "../functions/arraysEqual";
    import {Link} from "@o-platform/o-interfaces/dist/routables/link";
    import Modal2 from "./Modal2.svelte";

    import {getNavigationManifest} from "../functions/GetNavigationManifest.svelte";
    import {ProcessContainerNavigation} from "./ProcessContainer.svelte";
    import {NavigationManifest} from "@o-platform/o-interfaces/dist/navigationManifest";
    import NextNav from "./NextNav/NextNav.svelte";
    import NotFound from "./../pages/NotFound.svelte";
    import {ProcessStarted} from "@o-platform/o-process/dist/events/processStarted";
    import {Generate} from "@o-platform/o-utils/dist/generate";
    import {shellProcess} from "../processes/shellProcess";
    import {RunProcess} from "@o-platform/o-process/dist/events/runProcess";
    import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
    import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
    import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";

    export let params: {
        dappId: string;
        "1": string | null;
        "2": string | null;
        "3": string | null;
        "4": string | null;
        "5": string | null;
        "6": string | null;
    };
    let pageParams:{[x:string]:any} = {};

    let layoutClasses = "";

    let _entryPage: Page<any, any>;
    let _entryTrigger: Trigger<any, any>;

    let _modal: Modal2;
    let _modalIsOpen = false;

    let _processNavigation: ProcessContainerNavigation;
    let _navManifest: NavigationManifest;

    let _runtimeDapps: {[dappId:string]:RuntimeDapp<any>} = {};

    let dapp: DappManifest<any>;
    let runtimeDapp: RuntimeDapp<any>;
    let routable: Routable;

    onMount(async () => {
        window.o.events.subscribe(async (event: PlatformEvent) => {
            switch (event.type) {
                case "shell.runProcess":
                    const runProcessEvent = <RunProcess<any>>event;
                    const runningProcess = await window.o.stateMachines.run(
                        runProcessEvent.definition,
                        runProcessEvent.contextModifier
                    );

                    // If not, send an event with the process id.
                    const startedEvent = new ProcessStarted(runningProcess.id);
                    startedEvent.responseToId = runProcessEvent.id;
                    window.o.publishEvent(startedEvent);
                    break;
            }
        });

        window.o.runProcess = async function runProcess(
            processDefinition: ProcessDefinition<any, any>,
            contextData: { [x: string]: any },
            dirtyFlags: { [x: string]: boolean } | undefined
        ) {
            const modifier = async (ctx) => {
                ctx.childProcessDefinition = processDefinition;
                ctx.childContext = {
                    data: contextData,
                    dirtyFlags: !dirtyFlags ? {} : dirtyFlags,
                };
                return ctx;
            };
            const requestEvent: any = new RunProcess(shellProcess, true, modifier);
            requestEvent.id = Generate.randomHexString(8);

            const processStarted: ProcessStarted =
                await window.o.requestEvent<ProcessStarted>(requestEvent);
            _modal.showProcess(processStarted.processId);
        };

        onParamsChanged();
    });

    $: {
        if (params) {
            onParamsChanged()
        }
        layoutClasses =
            (dapp && dapp.isFullWidth) ||
            (_entryPage && _entryPage.isFullWidth)
                ? ""
                : "md:w-2/3 xl:w-1/2";

        if (_modal && _modalIsOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "visible";
        }
    }

    function onParamsChanged() {
        const dappId = params.dappId && params.dappId.endsWith(":1") ? params.dappId : params.dappId + ":1";
        if (!dappId) {
            _entryPage = <any>{
                component: NotFound
            };
            return;
        }

        dapp = dapps.find(o => o.dappId == dappId);
        if (!_runtimeDapps[dappId]) {
            _runtimeDapps[dappId] = <RuntimeDapp<any>>{
                ...dapp,
                route: dapp,
                state: {}
            }
            if (_runtimeDapps[dappId].initialize) {
                _runtimeDapps[dappId].initialize([], runtimeDapp);
            }
        }

        runtimeDapp = _runtimeDapps[dappId];
        setLastLoadedDapp(runtimeDapp);

        if (!dapp) {
            _entryPage = <any>{
                component: NotFound
            };
            return;
        }

        let routePartsFromParams = [];
        if (params["1"]) routePartsFromParams.push(params["1"]);
        if (params["2"]) routePartsFromParams.push(params["2"]);
        if (params["3"]) routePartsFromParams.push(params["3"]);
        if (params["4"]) routePartsFromParams.push(params["4"]);
        if (params["5"]) routePartsFromParams.push(params["5"]);
        if (params["6"]) routePartsFromParams.push(params["6"]);

        let possibleRoutes = dapp.routables.filter(o => o.routeParts.length == routePartsFromParams.length);
        console.log("Possible routes (same length):", possibleRoutes);

        for (let matchingRoute of possibleRoutes) {
            const exactParts = matchingRoute.routeParts.filter(part => part.startsWith("=")).map(o => o.replace("=", ""));
            if (exactParts.length <= routePartsFromParams.length) {
                // Could be a matching route
                const overlapFromParams = routePartsFromParams.slice(0, exactParts.length);
                if (arraysEqual(exactParts, overlapFromParams)) {
                    routable = matchingRoute;
                    setLastLoadedRoutable(routable);
                    console.log("Matching route:", matchingRoute);

                    const remainingParamsSpec = matchingRoute.routeParts.slice(exactParts.length).map(o => o.replace(":", "").replace("?", ""));
                    const remainingParams = routePartsFromParams.slice(exactParts.length);

                    const newPageParams = {};
                    for (let i = 0; i < remainingParamsSpec.length; i++) {
                        newPageParams[remainingParamsSpec[i]] = remainingParams[i];
                    }

                    pageParams = newPageParams;
                    break;
                }
            }
        }

        if (!routable) {
            // 404
            throw new Error(`Not found!`);
        }

        _navManifest = getNavigationManifest(dapp, _processNavigation, _modal);

        if (routable.type === "page") {
            _entryPage = <Page<any, any>>routable;
        } else if (routable.type === "trigger") {
            _entryTrigger = <Trigger<any, any>>routable;
            if (_entryTrigger.eventFactory) {
                const triggerEvent = _entryTrigger.eventFactory(params, dapp);
                if (!triggerEvent) {
                    throw new Error(
                        `The _entryTrigger.eventFactory didn't return an event.`
                    );
                }
                window.o.publishEvent(triggerEvent);
            }
            if (_entryTrigger.action) {
                const triggerEvent = _entryTrigger.action(params, dapp);
            }
        } else if (routable.type === "link") {
            const link = <Link<any, any>>routable;
            link.url(params, dapp);
            window.history.back();
            return;
        } else {
            throw new Error(
                `Entry point type '${routable.type}' is not supported by the DappFrame.`
            );
        }
    }

</script>
<div class="flex flex-col text-base">
    <main class="z-30 flex-1 overflow-y-auto">
        <div
                class="mainContent w-full mx-auto {layoutClasses}"
                class:mb-16={(!_modal || !_modalIsOpen) && dapp && dapp.dappId !== "homepage:1"}
                class:blur={_modal && _modalIsOpen}>
            {#if _entryPage}
                <svelte:component this={_entryPage.component} params={pageParams}/>
            {:else}
                <!--<NotFound />-->
            {/if}
        </div>
    </main>
</div>

{#if _navManifest}
    <NextNav navigation={_navManifest} />
{/if}
<Modal2
        bind:this={_modal}
        on:navigation={(event) => {
      _processNavigation = event.detail;
      _navManifest = getNavigationManifest(dapp, _processNavigation, _modal);
    }}
        on:modalOpen={(e) => {
      _modalIsOpen = e.detail;
      _navManifest = getNavigationManifest(dapp, _processNavigation, _modal);
    }}
/>
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
</style>