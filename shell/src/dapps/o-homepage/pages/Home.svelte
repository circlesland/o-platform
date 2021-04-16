<script lang="ts">
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import Error from "../../../shared/atoms/Error.svelte";
  import LoadingIndicator from "../../../shared/atoms/LoadingIndicator.svelte";
  import Success from "../../../shared/atoms/Success.svelte";
  import { Generate } from "@o-platform/o-utils/dist/generate";
  import {authenticate} from "../../o-auth/processes/authenticate";
  import {push} from "svelte-spa-router";

  $: {
  }

  function login() {
    if (window.o.globalState.isLoggedOn) {
      push("/dashboard")
    } else {
      push("/login")
    }
  }

  function authenticateWithCircles(appId: string, code?: string) {
    const requestEvent = new RunProcess<ShellProcessContext>(
      shellProcess,
      true,
      async (ctx) => {
        ctx.childProcessDefinition = authenticate;
        ctx.childContext = {
          data: {
            appId: appId,
            code: code,
          },
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
    window.o.publishEvent(requestEvent);
  }
</script>
<div class="flex flex-col h-screen ">
  <main class="flex-1 overflow-y-visible z-30">
    Hi! I'm the homepage
  </main>
  <footer class="z-50  w-full sticky bottom-0 ">
    <div class="flex justify-around ">
      <a
        on:click={login}
        class="mb-4 btn btn-outline bg-base-100"
      >
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