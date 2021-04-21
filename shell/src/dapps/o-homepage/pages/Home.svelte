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
  } from "../../o-passport/processes/identify";
  import { me } from "../../../shared/stores/me";
  import { showToast } from "../../../shared/toast";

  $: {
    console.log($me); // TODO: This is just to init the store. There could be a better solution to do this :)
  }

  showToast(
    "warning",
    "You got us!<br/>We're currently actively working on this.<br/>All Data will be re-set when we launch.",
    false
  );
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
          },
          dirtyFlags: {},
          environment: {},
        };
        return ctx;
      }
    );

    requestEvent.id = Generate.randomHexString(8);
    window.o.publishEvent(requestEvent);
  }
</script>

<div
  class="flex flex-col h-screen  bg-gradient-to-r from-gradient1 to-gradient2 text-white"
>
  <main class="flex-1 overflow-y-visible z-30" />
  <footer class="z-50  w-full sticky bottom-0 ">
    <div class="flex justify-around ">
      <a href="/#" on:click|once={login} class="mb-4 btn btn-white">
        <img
          width="15px"
          class="mr-3"
          src="/images/common/circles.png"
          alt="circles.land"
        /> Login
      </a>
    </div>
  </footer>
</div>
