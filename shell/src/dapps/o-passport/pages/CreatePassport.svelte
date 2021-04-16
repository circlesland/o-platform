<script lang="ts">
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
  import { upsertIdentity } from "../processes/upsertIdentity";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";

  let devHome = true;
  let devDash = false;
  let runningProcess: Process;

  onMount(() => {
    // <!-- TODO: Check if the passport creation was successful -->
    createPassport();
  });

  function createPassport() {
    // TODO: Refactor to request/response pattern with timeout
    let answerSubscription: Subscription;
    let requestId: string;

    const requestEvent = new RunProcess<ShellProcessContext>(
      shellProcess,
      false,
      async (ctx) => {
        ctx.childProcessDefinition = upsertIdentity;
        ctx.childContext = {
          data: {},
          dirtyFlags: {},
          environment: {
            errorView: Error,
            progressView: LoadingIndicator,
            successView: Success,
          },
        };
        return ctx;
      }
    );

    requestEvent.id = Generate.randomHexString(8);

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
  <div class="flex h-screen flex-wrap content-end">
    <div class="m-auto h-auto grid">
      <img
        class="inline m-auto w-12 h-12 -mb-6 z-30"
        src="/images/common/circles.png"
        alt="circles.land"
      />
      <div class="card shadow bg-white z-0">
        <div class="card-body justify-end ">
          {#if runningProcess}
            <ProcessContainer
              process={runningProcess}
              on:stopped={() => {
                // <!-- TODO: Check if the passport creation was successful -->
                push("/passport/create-or-import-key");
              }}
            />{/if}
        </div>
      </div>
    </div>
  </div>
</div>

<div class="font-primary" />
