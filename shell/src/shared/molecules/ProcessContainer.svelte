<script lang="ts">
  import NavItem from "../atoms/NavItem.svelte";
  import { faTimes } from "@fortawesome/free-solid-svg-icons";
  import Prompt from "./Prompt.svelte";
  import { createEventDispatcher } from "svelte";
  import { Process } from "@o-platform/o-process/dist/interfaces/process";
  import { ShellEvent } from "@o-platform/o-process/dist/events/shellEvent";
  import { Cancel } from "@o-platform/o-process/dist/events/cancel";
  import { Prompt as PromptEvent } from "@o-platform/o-process/dist/events/prompt";
  import { Subscription } from "rxjs";
  import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
  import { Bubble } from "@o-platform/o-process/dist/events/bubble";
  import { Sinker } from "@o-platform/o-process/dist/events/sinker";
  import Error from "../atoms/Error.svelte";
  import LoadingIndicator from "../atoms/LoadingIndicator.svelte";

  /**
   * A channel to an already running process.
   */
  export let process: Process;

  let inEventSubscription: Subscription;
  let outEventSubscription: Subscription;
  let canSkip = false;
  let canGoBack = false;
  let prompt: PromptEvent;
  let error: Error;

  // Every incoming prompt sets this flag to 'true'
  let waitForNextOutgoingEvent: boolean;
  // When 'waitForNextOutgoingEvent' == true and any event is sent to the process then 'waiting' will be set to 'true'
  let waiting: boolean;

  const dispatch = createEventDispatcher();

  $: {
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

        console.log("ProcessContainer: In/Out -> to Process: ", next.event);

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

        console.log("ProcessContainer: In/Out <- from Process: ", next.event);

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
          prompt = <PromptEvent>event;
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
  const cancelPressed = () => {
    process.sendEvent(new Cancel());
  };
</script>

{#if waiting}
  <LoadingIndicator />
{:else if error}
  <Error data={{ error }} />
{:else if process && prompt}
  <Prompt {process} {prompt} bubble={lastBubble} />
{:else}
  Undefined state
{/if}
