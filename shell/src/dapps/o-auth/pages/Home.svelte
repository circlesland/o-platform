<script lang="ts">
  import { authenticate } from "../processes/authenticate";
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import Error from "../../../shared/atoms/Error.svelte";
  import LoadingIndicator from "../../../shared/atoms/LoadingIndicator.svelte";
  import Success from "../../../shared/atoms/Success.svelte";
  import ProcessContainer from "../../../shared/molecules/ProcessContainer.svelte";
  import { Process } from "@o-platform/o-process/dist/interfaces/process";
  import { Subscription } from "rxjs";
  import { Generate } from "@o-platform/o-utils/dist/generate";
  import { ProcessStarted } from "@o-platform/o-process/dist/events/processStarted";
  import {authenticateWithCircles} from "../../../shared/authenticateWithCircles";

  let devHome = true;
  let devDash = false;
  let runningProcess: Process;

  export let params: {
    code: string;
  };

  $: {
    if (params && params.code) {
      doAuth("__APP_ID__", params.code);
    } else {
      doAuth("__APP_ID__");
    }
  }

  async function doAuth(appId: string, code?: string) {
    // TODO: Refactor to request/response pattern with timeout
    let answerSubscription: Subscription;
    const requestEvent = await authenticateWithCircles(appId, code);

    answerSubscription = window.o.events.subscribe((event) => {
      console.log("Home.svelte: received event: ", event);
      if (
        event.responseToId == requestEvent.id &&
        event.type == "shell.processStarted"
      ) {
        const processStarted = <ProcessStarted>event;
        answerSubscription.unsubscribe();
        runningProcess = window.o.stateMachines.findById(
          processStarted.processId
        );
        console.log("Home.svelte: displaying process:", runningProcess);
      }
    });

    window.o.publishEvent(requestEvent);
  }
</script>

<div class="grid grid-cols-1 p-2">
  <div class="flex h-screen ">
    <div class="m-auto grid">
      <img
        class="inline m-auto w-12 h-12 -mb-6 z-30"
        src="/images/common/circles.png"
        alt="circles.land"
      />
      <div class="card shadow bg-white z-0">
        <div class="card-body">
          {#if runningProcess}
            <ProcessContainer
              process={runningProcess}
              on:stopped={() => {
                isOpen = false;
                runningProcess = null;
              }}
            />{/if}
        </div>
      </div>
    </div>
  </div>
</div>

<div class="font-primary" />
