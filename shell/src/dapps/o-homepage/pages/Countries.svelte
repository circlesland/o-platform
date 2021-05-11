<script lang="ts">
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import { Generate } from "@o-platform/o-utils/dist/generate";
  import {
    identify,
    IdentifyContextData,
  } from "../../o-passport/processes/identify/identify";
  import { me } from "../../../shared/stores/me";
  import Countries from "../components/Countries.svelte";

  $: {
    console.log($me); // TODO: This is just to init the store. There could be a better solution to do this :)
  }

  $: me;

  async function login() {
    const requestEvent = new RunProcess<ShellProcessContext>(
      shellProcess,
      true,
      async (ctx) => {
        ctx.childProcessDefinition = identify;
        ctx.childContext = {
          data: <IdentifyContextData>{
            redirectTo: "/dashboard",
          }
        };
        return ctx;
      }
    );

    requestEvent.id = Generate.randomHexString(8);
    window.o.publishEvent(requestEvent);
  }
</script>

<div
  class="flex flex-col h-full"
>
  <main class="z-30 flex-1 overflow-y-visible">
  <Countries />
  </main>
</div>
