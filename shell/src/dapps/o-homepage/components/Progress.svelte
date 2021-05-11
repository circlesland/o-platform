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
          },
        };
        return ctx;
      }
    );

    requestEvent.id = Generate.randomHexString(8);
    window.o.publishEvent(requestEvent);
  }
</script>

<div
  class="relative pt-1 w-full sticky bottom-0 bg-white border-t border-base-300 z-50"
>
  <button
    on:click={login}
    class="btn btn-primary absolute bottom-2 left-2/4 shadow-md"
  >
    <svg
      class="w-6 h-6 inline mr-3"
      viewBox="0 0 229 255"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M118.5 237C150.437 237 179.424 224.366 200.734 203.822C209.904 197.627 215.933 187.136 215.933 175.236C215.933 156.198 200.499 140.764 181.461 140.764C170.572 140.764 160.863 145.812 154.545 153.695L154.457 153.627C145.313 163.112 132.476 169.012 118.261 169.012C90.4957 169.012 67.9879 146.504 67.9879 118.739C67.9879 90.9745 90.4957 68.4667 118.261 68.4667C132.339 68.4667 145.067 74.254 154.193 83.5795L154.29 83.5037C160.581 90.2293 169.535 94.4328 179.471 94.4328C198.51 94.4328 213.944 78.9988 213.944 59.9601C213.944 48.1884 208.043 37.7949 199.039 31.5755C177.899 11.9794 149.599 0 118.5 0C53.0543 0 0 53.0543 0 118.5C0 183.946 53.0543 237 118.5 237Z"
        fill="white"
      />
      <ellipse
        cx="118.979"
        cy="118.739"
        rx="26.5727"
        ry="26.3333"
        fill="white"
      />
    </svg> Join Now
  </button>
  <div class="flex items-center justify-between mb-2">
    <div>
      <span
        class="inline-block px-2 py-1 text-lg font-semibold text-gray-500 uppercase "
      >
        Goal 6
      </span>
    </div>
    <div class="text-right">
      <span class="inline-block px-2 py-1 text-lg font-semibold text-gray-500">
        300 of 453 citizens
      </span>
    </div>
  </div>
  <div class="flex h-16 overflow-hidden text-xs bg-gray-300">
    <div
      style="width:70%"
      class="flex flex-col justify-center text-center text-white shadow-none whitespace-nowrap bg-gradient-to-r from-gradient1 to-gradient2"
    />
  </div>
</div>
