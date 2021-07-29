<script context="module" lang="ts">
  import {PromptNavigation} from "@o-platform/o-process/dist/events/prompt";

  export interface ProcessContainerNavigation extends PromptNavigation
  {
    canSkip: boolean;
    canGoBack: boolean;
    canSubmit: boolean;
    skip: () => void;
    back: () => void;
    cancel: () => void;
  }
</script>
<script lang="ts">
  import { faTimes } from "@fortawesome/free-solid-svg-icons";
  import Prompt from "./Prompt.svelte";
  import { createEventDispatcher } from "svelte";
  import { Process } from "@o-platform/o-process/dist/interfaces/process";
  import { ShellEvent } from "@o-platform/o-process/dist/events/shellEvent";
  import {Cancel, CancelRequest} from "@o-platform/o-process/dist/events/cancel";
  import { Prompt as PromptEvent } from "@o-platform/o-process/dist/events/prompt";
  import { Subscription } from "rxjs";
  import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
  import { Bubble } from "@o-platform/o-process/dist/events/bubble";
  import { Sinker } from "@o-platform/o-process/dist/events/sinker";
  import Error from "../atoms/Error.svelte";
  import LoadingIndicator from "../atoms/LoadingIndicator.svelte";
  import ChoiceSelector from "../../../../packages/o-editors/src/ChoiceSelector.svelte";
  import {Skip} from "@o-platform/o-process/dist/events/skip";
  import {Back} from "@o-platform/o-process/dist/events/back";

  /**
   * A channel to an already running process.
   */
  export let process: Process;
  export let props: {
    process: Process
  }
  let interceptedProcess: Process;

  let inEventSubscription: Subscription;
  let outEventSubscription: Subscription;
  let canSkip = false;
  let canGoBack = false;
  let prompt: PromptEvent;
  let error: Error;

  // Every incoming prompt sets this flag to 'true'
  let waitForNextOutgoingEvent: boolean;
  // When 'waitForNextOutgoingEvent' == true and any event is sent to the process then 'waiting' will be set to 'true'
  export let waiting: boolean;

  export let beforeCancelPrompt: PromptEvent;
  let cancelDialogVisible: boolean;

  const dispatch = createEventDispatcher();

  $: {
    if (!process && props && props.process) {
      process = props.process;
    }
    if (process) {
      // Give a modified version of the process to the <Prompt>.
      // This will catch the answer to the cancel-question
      // before it reaches the process.
      interceptedProcess = {
        ...process,
        sendAnswer(answer: PlatformEvent) {
          if (
            cancelDialogVisible &&
            answer.type == "process.continue" &&
            (<any>answer).data.___cancelRequest
          ) {
            console.log("Cancel dialog answer:", answer);
            if ((<any>answer).data.___cancelRequest.key === "no") {
              prompt = beforeCancelPrompt;
              beforeCancelPrompt = null;
              cancelDialogVisible = false;
              return;
            } else {
              prompt = beforeCancelPrompt;
              beforeCancelPrompt = null;
              cancelDialogVisible = false;
              process.sendEvent(new Cancel());
            }
          } else {
            process.sendAnswer(answer);
          }
        },
      };
    }
    if (outEventSubscription) {
      outEventSubscription.unsubscribe();
      outEventSubscription = null;
    }
    if (inEventSubscription) {
      inEventSubscription.unsubscribe();
      inEventSubscription = null;
    }
    if (process) {
      subscribeToProcess();
    } else {
      canSkip = false;
      prompt = null;
    }

    if (!process) {
      canSkip = undefined;
      canGoBack = undefined;
    }
  }

  let lastBubble: Bubble;

  function ensureProcess(action: (p: Process) => void) {
    if (!process) {
      console.warn(
        "ProcessContainer.svelte: No running 'process' attached to ProcessContainer."
      );
      return;
    }
    action(process);
  }

  function subscribeToProcess() {
    ensureProcess((process) => {
      inEventSubscription = process.inEvents.subscribe((next) => {
        if (!next.event) return;

        console.log(
          "ProcessContainer: In/Out -> to Process: ",
          JSON.stringify(next.event, null, 2)
        );

        if (next.event.type === "process.cancelRequest") {
          // modalWantsToClose:
          // TODO: Check the context's dirty flags and ask the user only if at least one dirty-flag is set
          console.log("Received cancel request:", next.event);
          beforeCancelPrompt = prompt;

          if (
            beforeCancelPrompt &&
            Object.values(beforeCancelPrompt.editorDirtyFlags).filter(
              (o) => o === true
            ).length == 0 &&
            Object.values(beforeCancelPrompt.dirtyFlags).filter(
              (o) => o === true
            ).length == 0
          ) {
            // No changes yet, just cancel
            process.sendEvent(new Cancel());
            return;
          }

          cancelDialogVisible = true;
          const p = <Prompt>{
            type: "process.prompt",
            field: "___cancelRequest",
            component: ChoiceSelector,
            data: {
              ___cancelRequest: undefined,
            },
            dirtyFlags: {},
            messages: {},
            params: {
              label: "Do you really want to cancel?",
              choices: [
                {
                  key: "yes",
                  label: "Yes",
                  target: "#yes",
                },
                {
                  key: "no",
                  label: "No",
                  target: "#no",
                },
              ],
            },
            isSensitive: false,
            navigation: {
              canGoBack: () => false,
              canSkip: () => false,
            },
          };

          prompt = <PromptEvent>{
            id: "123",
            responseToId: "123",
            ...p,
          };
        }

        if (
          waitForNextOutgoingEvent &&
          next.event.type === "process.ipc.sinker"
        ) {
          waitForNextOutgoingEvent = false;
          waiting = true;
        }
      });

      outEventSubscription = process.events.subscribe((next) => {
        if (next.stopped) {
          prompt = null;
          process = null;
          waiting = false;
          console.log("ProcessContainer.svelte: process stopped");
          dispatch("stopped");
        }

        if (!next.event) return;

        // Unpack bubbled events if necessary
        let event: PlatformEvent;
        if (next.event?.type === "process.ipc.bubble") {
          const bubble = <Bubble>next.event;
          if (!bubble.end) {
            return;
          }
          lastBubble = bubble;
          event = bubble.wrappedEvent;
        } else {
          event = next.event;
        }

        if (event.type === "process.prompt") {
          const promptEvent = <PromptEvent<any>>event;
          if (promptEvent.navigation) {
            dispatch("navigation", {
              ...promptEvent.navigation,
              skip:() => process.sendAnswer(new Skip()),
              back:() => process.sendAnswer(new Back()),
              cancel: () => process.sendAnswer(new CancelRequest())
            });
          }
        }

        try {
          console.log(
            "ProcessContainer: In/Out <- from Process: ",
            JSON.stringify(next.event, null, 2)
          );
        } catch {}

        // If the event is an error event, then set the error property else clear it
        if (event.type === "xstate.error") {
          error = (<any>event).data;
          waiting = false;
        } else {
          error = null;
        }

        // publish shell events if requested by the process
        if (event.type === "process.shellEvent") {
          window.o.publishEvent((<ShellEvent>event).payload);
        }

        // display the requested component for the process
        // and switch the view to 'waiting' after an event
        // was sent from the prompt to the process.
        // The loading spinner will be disabled with the next arriving 'prompt'.
        if (event.type === "process.prompt") {
          console.log(
            "ProcessContainer received 'process.prompt' event: ",
            next
          );
          prompt = <PromptEvent>{
            ...event,
            editorDirtyFlags: {},
          };
          waiting = false;
          waitForNextOutgoingEvent = true;
        }
      });

      process.sendEvent({
        type: "process.continue",
      });
    });
  }

  function sinkEvent(event) {
    if (!lastBubble) {
      // TODO: This is error prone without event-ids
      throw new Error(
        "Can only sink events in response to a previously bubbled event."
      );
    }
    ensureProcess((p) => {
      p.sendEvent(<Sinker>{
        type: "process.ipc.sinker",
        levels: lastBubble.levels,
        backTrace: lastBubble.trace,
        wrappedEvent: event,
      });
    });
  }

  const cancel = {
    data: {
      label: "Cancel",
    },
    design: {
      icon: faTimes,
    },
  };
</script>

{#if waiting}
  <div class="p-4">
    <LoadingIndicator />
  </div>
{:else if error}
  <div class="p-4">
    <Error data={{ error }} />
  </div>
{:else if interceptedProcess && prompt}
  <Prompt process={interceptedProcess} {prompt} bubble={lastBubble} />
{:else}
  <!-- TODO: This could be both: Undefined state or loading .. -->
  <div class="p-4">
    <LoadingIndicator />
  </div>
{/if}
