<script context="module" lang="ts">
    import {IShell} from "./shell";
    import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
    import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
    import {Generate} from "@o-platform/o-utils/dist/generate";
    import LoadingIndicator from "./shared/atoms/LoadingIndicator.svelte";
    import Success from "./shared/atoms/Success.svelte";
    import ErrorIndicator from "./shared/atoms/Error.svelte";
    import {useMachine} from "xstate-svelte";
    import {Subject, Subscription} from "rxjs";
    import {ProcessEvent} from "@o-platform/o-process/dist/interfaces/processEvent";
    import {AnyEventObject} from "xstate";
    import {Bubble} from "@o-platform/o-process/dist/events/bubble";
    import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
    import {Process} from "@o-platform/o-process/dist/interfaces/process";
    import {Sinker} from "@o-platform/o-process/dist/events/sinker";
    import {shellEvents} from "./shared/shellEvents";
    import {ApiConnection} from "./shared/apiConnection";
    import {getProcessContext} from "./main";
    import {PromptContext, PromptEvent} from "./dapps/o-onboarding/components/dialog";

    const runningProcesses: {
        [id: string]: Process;
    } = {};

    const shell: IShell = {
        stateMachines: {
            findById(processId: string) {
                return runningProcesses[processId];
            },
            async run<TContext>(
                definition: ProcessDefinition<any, any>,
                contextModifier?: (
                    processContext: ProcessContext<any>
                ) => Promise<TContext>
            ) {
                const processId = Generate.randomHexString(8);
                console.log(
                    `Starting process (id: ${processId}) with definition:`,
                    definition
                );

                const machine = (<any>definition).stateMachine(
                    LoadingIndicator,
                    Success,
                    ErrorIndicator
                );
                const machineOptions = {
                    context: contextModifier
                        ? await contextModifier(await getProcessContext())
                        : await getProcessContext(),
                };
                const {service, state, send} = useMachine(machine, machineOptions);

                const outEvents = new Subject<ProcessEvent>();
                const inEvents = new Subject<ProcessEvent>();

                let lastInEvent: AnyEventObject;

                service.onTransition((state1, event) => {
                    if (event.type == "error.platform" || event.type == "xstate.error") {
                        console.error(
                            `An error occurred during the execution of process '${definition.name}'::`,
                            event
                        );
                    }
                    if (event.type == "process.ipc.bubble") {
                        process.lastReceivedBubble = <Bubble>event;
                    }

                    //console.log(`window.o.stateMachines: forwarding event to the processEvents stream of process '${definition.name}':`, event);
                    if (event == lastInEvent) {
                        // TODO: Hack: Skip this event - it's 'reflected'
                        lastInEvent = null;
                        return;
                    }
                    outEvents.next(<any>{
                        stopped: false,
                        currentState: state1,
                        previousState: state1.history,
                        event: event,
                    });
                });

                service.onStop(() => {
                    outEvents.next({
                        stopped: true,
                    });

                    delete runningProcesses[processId];
                });

                function isProcessEvent(
                    event: PlatformEvent | ProcessEvent
                ): event is ProcessEvent {
                    return (event as ProcessEvent).currentState !== null;
                }

                const process: Process = {
                    id: processId,
                    events: outEvents,
                    inEvents: inEvents,
                    lastReceivedBubble: null,
                    sendEvent: (event: PlatformEvent & { type: string }) => {
                        if (isProcessEvent(event)) {
                            lastInEvent = event;
                            inEvents.next(<any>{
                                event: event,
                            });
                        }
                        send(event);
                    },
                    sendAnswer(answer: PlatformEvent) {
                        if (!this.lastReceivedBubble || this.lastReceivedBubble.noReply) {
                            throw new Error(
                                "Cannot answer because no Bubble event was received before or the event hat the 'noReply' property set."
                            );
                        }
                        process.sendEvent(<Sinker>{
                            type: "process.ipc.sinker",
                            levels: this.lastReceivedBubble.levels ?? 0,
                            backTrace: this.lastReceivedBubble.trace,
                            wrappedEvent: answer,
                        });
                    },
                };

                service.start();

                runningProcesses[processId] = process;

                return process;
            },
        },
        events: shellEvents.observable,
        publishEvent: (event) => shellEvents.publish(event),
        requestEvent: <TResult extends PlatformEvent>(requestEvent) => {
            const timeoutPeriod = 100;
            return new Promise<TResult>((resolve, reject) => {
                let answerSubscription: Subscription;
                let answered = false;

                let timeout = setTimeout(() => {
                    if (answered) return;

                    reject(
                        new Error(
                            `The request event with the id ${requestEvent.id} wasn't answered within ${timeoutPeriod} ms`
                        )
                    );
                }, timeoutPeriod);

                answerSubscription = window.o.events.subscribe((event) => {
                    if (event.responseToId != requestEvent.id) {
                        return;
                    }

                    answerSubscription.unsubscribe();
                    clearTimeout(timeout);

                    resolve(<TResult>event);
                });

                window.o.publishEvent(requestEvent);
            });
        },
        modal: {
            prompt: null
        },
        dialog: {
            close: null,
            open: null
        }
    };

    async function connectToApi() {
        console.log(`Connecting to __AUTH_ENDPOINT__ ..`);
        shell.authClient = new ApiConnection("__AUTH_ENDPOINT__/");

        console.log(`Connecting to __API_ENDPOINT__ ..`);
        shell.apiClient = new ApiConnection("__API_ENDPOINT__/", "include");

        console.log(`Connecting to __CIRCLES_SUBGRAPH_ENDPOINT__ ..`);
        shell.theGraphClient = new ApiConnection("__CIRCLES_SUBGRAPH_ENDPOINT__");
    }

    connectToApi().then(() => {
        console.log(`Connected to __AUTH_ENDPOINT__ and __API_ENDPOINT__`);
    });

    declare global {
        interface Window {
            o: IShell;
        }
    }

    window.o = shell;
</script>

<script lang="ts">
    import "./shared/css/tailwind.css";

    import Router from "svelte-spa-router";
    import {SvelteToast} from "./shared/molecules/Toast";
    import DappFrame from "src/shared/molecules/DappFrame.svelte";
    import NotFound from "src/shared/pages/NotFound.svelte";
    import Layout from "./dapps/o-onboarding/layouts/Layout.svelte";

    /*
    let publicUrls = {
      "/": true,
      "/miva": true,
      "/citizens": true,
      "/countries": true,
      "/banking/find-my-safe": true,
      "/milestones": true,
    };
     */
    let _routes = {
        "/:dappId?/:1?/:2?/:3?/:4?/:5?/:6?": DappFrame,
        "*": NotFound,
    };
</script>

<SvelteToast/>
<!--
<Router routes={_routes}/>
-->
<Layout/>