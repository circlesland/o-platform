<script lang="ts">
  import {
    runShellProcess,
  } from "../../../shared/processes/shellProcess";
  import ProcessContainer from "../../../shared/molecules/ProcessContainer.svelte";
  import { Process } from "@o-platform/o-process/dist/interfaces/process";
  import { Subscription } from "rxjs";
  import { ProcessStarted } from "@o-platform/o-process/dist/events/processStarted";
  import { onMount } from "svelte";
  const {push} = require("svelte-spa-router");
  import {identify, IdentifyContextData} from "../processes/identify/identify";

  let runningProcess: Process;

  export let params: {
    code: string;
    redirectTo: string;
  };

  onMount(() => {
    if (!params.code) {
      throw new Error(`Can't login: No one time code supplied.`)
    }

    // TODO: Refactor to request/response pattern with timeout
    let answerSubscription: Subscription;
    const code = params ? params.code : undefined;
    const requestEvent = runShellProcess(identify, <IdentifyContextData>{
      oneTimeCode: code,
      redirectTo: "/dashboard"
    });
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
  });
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
                // isOpen = false;
                runningProcess = null;
              }}
            />{/if}
        </div>
      </div>
    </div>
  </div>
</div>

<div class="font-primary" />
