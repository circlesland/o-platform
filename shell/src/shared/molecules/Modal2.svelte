<script context="module" lang="ts">
  import {CancelRequest} from "@o-platform/o-process/dist/events/cancel";
  import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
  import {RunProcess} from "@o-platform/o-process/dist/events/runProcess";
  import {Generate} from "@o-platform/o-utils/dist/generate";
  import {shellProcess} from "../processes/shellProcess";
  import {ProcessStarted} from "@o-platform/o-process/dist/events/processStarted";
  import {Process} from "@o-platform/o-process/dist/interfaces/process";

  let isOpen = false;
  let runningProcess: Process|undefined;

  export async function runProcess (processDefinition:ProcessDefinition<any, any>, contextData:{[x:string]:any}) {
    const modifier = async (ctx) => {
      ctx.childProcessDefinition = processDefinition;
      ctx.childContext = {
        data: contextData
      };
      return ctx;
    };
    const requestEvent:any = new RunProcess(shellProcess, true, modifier);
    requestEvent.id = Generate.randomHexString(8);

    const processStarted:ProcessStarted = await window.o.requestEvent<ProcessStarted>(requestEvent);
    showProcess(processStarted.processId);
  }

  export function showProcess(processId:string) {
    runningProcess = window.o.stateMachines.findById(processId);
    if (!isOpen && runningProcess) {
      isOpen = true;
    }
  }

  export function closeModal() {
    if (runningProcess && isOpen) {
      runningProcess.sendEvent(new CancelRequest());
    }
    if (!runningProcess && isOpen) {
      isOpen = false;
    }
  }
</script>
<script lang="ts">
  import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
  import ProcessContainer from "./ProcessContainer.svelte";
  import {onMount} from "svelte";
  import {fade} from "svelte/transition";

  const onKeyDown = (e) => {
    if (e.key !== "Escape")
      return;

    closeModal();
  };

  onMount(() => {
    window.o.events.subscribe(async (event: PlatformEvent) => {
    });
  });
</script>

{#if isOpen}
  <aside
    id="modalAside"
    on:keydown={onKeyDown}
    aria-labelledby="modal-heading"
    aria-modal="true"
    tabIndex={-1}
    role="dialog"
    in:fade={{ duration: 50 }}
    out:fade={{ duration: 50 }}
    on:click|self={closeModal}
    class="z-40 pt-2 text-base overlay"
  >
    <div
      class="w-full p-2 mt-1 modalAsideContentContainer"
      on:click|self={closeModal}
    >
      <div
        class="w-full bg-white rounded-lg modalAsideContent md:w-2/3 xl:w-1/2"
      >
        <div class="modalAsideScrollableContent">
          <div class="w-full m-auto">
            {#if runningProcess}
              <ProcessContainer
                      process={runningProcess}
                      on:stopped={() => {
                  runningProcess = null;
                  closeModal();
                }}/>
            {:else}
              No running process
            {/if}
          </div>
        </div>
      </div>
    </div>
  </aside>
{/if}

<style>
  * {
    box-sizing: border-box;
  }
  aside {
    /* z-index: 1000; */
    background-color: rgba(177, 192, 200, 0.4);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    overflow-y: hidden;
    @apply pb-20;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
  .modalAsideContentContainer {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    justify-content: flex-end;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 4.25rem;
  }
  .modalAsideContent {
    flex-grow: 0;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
  .modalAsideScrollableContent {
    flex-grow: 1;
    overflow: auto;
    min-height: 0;
  }
  /* Background Blurring for firefox and other non supportive browsers lies in App.svelte through the .blur class */
  @supports (backdrop-filter: blur(4px)) or (-webkit-backdrop-filter: blur(4px)) {
    aside {
      opacity: 1;
      -webkit-backdrop-filter: blur(4px);
      backdrop-filter: blur(4px);
    }
  }
</style>
