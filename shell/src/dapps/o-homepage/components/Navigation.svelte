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

<header class="flex px-4 py-2 w-full font-bold uppercase lg:py-4 font-circless">
  <div
    class="relative flex w-full items-center justify-between lg:justify-center lg:space-x-16"
  >
    <ul class="flex items-center hidden space-x-8 lg:flex">
      <li>
        <a
          href="https://discord.gg/CS6xq7jECR"
          target="_blank"
          aria-label="Our product"
          title="Our product"
          class="font-bold tracking-wide transition-colors duration-200 text-secondary hover:text-primary"
          >Chat</a
        >
      </li>
      <li>
        <a
          href="https://aboutcircles.com"
          target="_blank"
          aria-label="Our product"
          title="Our product"
          class="font-bold tracking-wide transition-colors duration-200 text-secondary hover:text-primary"
          >Forum</a
        >
      </li>
    </ul>
    <a
      href="/"
      aria-label="Company"
      title="Company"
      class="inline-flex items-center h-12"
    >
      <img src="/circles.png" alt="CirclesLAND" class="h-12" />
    </a>
    <ul class="flex items-center hidden space-x-8 lg:flex">
      <li>
        <a
          href="https://circlesland.ghost.io/"
          target="_blank"
          aria-label="About us"
          title="About us"
          class="font-bold tracking-wide transition-colors duration-200 text-secondary hover:text-primary"
          >Blog</a
        >
      </li>
      <li>
        <a
          href="https://circlesland.ghost.io/whitepaper/"
          target="_blank"
          aria-label="Sign in"
          title="Sign in"
          class="font-bold tracking-wide transition-colors duration-200 text-secondary hover:text-primary"
          >Whitepaper</a
        >
      </li>
    </ul>
    <div class="absolute w-12 self-center justify-self-end right-8 lg:right-0">
      <button class="btn-link" on:click={login}>Log in</button>
    </div>
    <!-- Mobile menu -->
    <div class="lg:hidden order-last">
      <button
        aria-label="Open Menu"
        title="Open Menu"
        class="p-2 -mr-1 transition duration-200 rounded focus:outline-none focus:shadow-outline hover:bg-deep-purple-50 focus:bg-deep-purple-50"
      >
        <svg class="w-5 text-gray-600" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M23,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,13,23,13z"
          />
          <path
            fill="currentColor"
            d="M23,6H1C0.4,6,0,5.6,0,5s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,6,23,6z"
          />
          <path
            fill="currentColor"
            d="M23,20H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,20,23,20z"
          />
        </svg>
      </button>
      <!-- Mobile menu dropdown 
      <div class="absolute top-0 left-0 w-full">
        <div class="p-5 bg-white border rounded shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <a href="/" aria-label="Company" title="Company" class="inline-flex items-center">
                <svg class="w-8 text-deep-purple-accent-400" viewBox="0 0 24 24" stroke-linejoin="round" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" stroke="currentColor" fill="none">
                  <rect x="3" y="1" width="7" height="12"></rect>
                  <rect x="3" y="17" width="7" height="6"></rect>
                  <rect x="14" y="1" width="7" height="6"></rect>
                  <rect x="14" y="11" width="7" height="12"></rect>
                </svg>
                <span class="ml-2 text-xl font-bold tracking-wide text-gray-800 uppercase">Company</span>
              </a>
            </div>
            <div>
              <button aria-label="Close Menu" title="Close Menu" class="p-2 -mt-2 -mr-2 transition duration-200 rounded hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                <svg class="w-5 text-gray-600" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M19.7,4.3c-0.4-0.4-1-0.4-1.4,0L12,10.6L5.7,4.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l6.3,6.3l-6.3,6.3 c-0.4,0.4-0.4,1,0,1.4C4.5,19.9,4.7,20,5,20s0.5-0.1,0.7-0.3l6.3-6.3l6.3,6.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3 c0.4-0.4,0.4-1,0-1.4L13.4,12l6.3-6.3C20.1,5.3,20.1,4.7,19.7,4.3z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <nav>
            <ul class="space-y-4">
              <li><a href="/" aria-label="Our product" title="Our product" class="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:text-deep-purple-accent-400">Product</a></li>
              <li><a href="/" aria-label="Our product" title="Our product" class="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:text-deep-purple-accent-400">Features</a></li>
              <li><a href="/" aria-label="Product pricing" title="Product pricing" class="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:text-deep-purple-accent-400">Pricing</a></li>
              <li><a href="/" aria-label="About us" title="About us" class="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:text-deep-purple-accent-400">About us</a></li>
              <li><a href="/" aria-label="Sign in" title="Sign in" class="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:text-deep-purple-accent-400">Sign in</a></li>
              <li>
                <a
                  href="/"
                  class="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
                  aria-label="Sign up"
                  title="Sign up"
                >
                  Sign up
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      -->
    </div>
  </div>
</header>
