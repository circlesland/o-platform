<script lang="ts">
  import DashboardHeader from "../atoms/DashboardHeader.svelte";
  import { me } from "../../../shared/stores/me";
  import { onMount } from "svelte";
  import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
  import { BN } from "ethereumjs-util";
  import CopyClipBoard from "../../../shared/atoms/CopyClipboard.svelte";

  const { mySafe } = require("src/dapps/o-banking/stores/safe");

  $: me;

  let disableBanking: boolean = false;

  let accountAddress: string = "";
  let accountBalance: string = "";
  let safeDeployThreshold: string = "200000000000000000";
  let showFundHint: boolean = false;
  let inviteLink: string = "";

  const init = async () => {
    const pk = localStorage.getItem("circlesKey");
    if (!pk || localStorage.getItem("isCreatingSafe") !== "true") {
      disableBanking = !pk;
      return;
    }

    accountAddress =
      RpcGateway.get().eth.accounts.privateKeyToAccount(pk).address;

    if (localStorage.getItem("isCreatingSafe")) {
      showFundHint = true;
      return;
    }
    accountBalance = await RpcGateway.get().eth.getBalance(accountAddress);
    showFundHint = new BN(accountBalance).lt(new BN(safeDeployThreshold));
  };

  onMount(init);

  const copy = () => {
    const app = new CopyClipBoard({
      target: document.getElementById("clipboard"),
      props: { name: inviteLink },
    });
    app.$destroy();
  };

  const sub = window.o.events.subscribe((event) => {
    if (event.type !== "shell.refresh") {
      return;
    }
    init();
  });

  $: {
    if ($me) {
      inviteLink = `${window.location.protocol}//${window.location.host}/#/banking/profile/${$me.id}`;
    }
  }

</script>

<DashboardHeader />
<div class="mx-4">
  {#if showFundHint}
    <!-- Create safe  -->
    <section class="mb-8">
      <div class="w-full px-2 pb-4 -mt-6 bg-white rounded-sm shadow">
        <div class="px-4 py-2 mr-4 -ml-3 text-center " />
        <div style="text-align: center">
          <p class="w-64 m-auto mt-2 text-2xl font-bold text-gradient">
            You're almost there.
          </p>
          <p class="mt-4 text">
            To unlock your Circles basic income, you need to get invited by a
            CirclesLand citizen.
          </p>
          <div class="mt-4 mb-4 text-xs break-all" id="clipboard">
            <input type="text" class="hidden" bind:value={inviteLink} />
            <div class="inline-block text-2xl">
              <button class="btn btn-primary" on:click={copy}
                >Copy Invite Link</button
              >
            </div>

            <div class="block mt-2 text-sm text-light ">
              {inviteLink}
            </div>
          </div>
          <p class="text">
            If you don't know anybody who has Circles yet, ask nicely in our <a
              href="https://discord.gg/4DBbRCMnFZ"
              target="_blank"
              class="btn-link">Discord</a
            > if someone can invite you.
          </p>
          <p class="pb-4 mt-4 text-xs">
            alternatively, <a href="#/dashboard/become-a-hub" class="btn-link"
              >become an invite hub</a
            >
          </p>
          <div class="mr-1 text-primary" />
        </div>
      </div>
    </section>
  {:else if $mySafe}
    <!-- Create safe  -->
    <section class="mb-8">
      <div class="w-full px-2 pb-8 -mt-6 bg-white rounded-sm shadow">
        <div class="px-4 py-2 mr-4 -ml-3 text-center " />
        <div class="text-center">
          <p class="w-full m-auto mt-2 text-2xl font-bold text-gradient">
            Grow the basic income economy!
          </p>
          <!-- <p class="mt-4 text-lg ">
            xxxxxxx/1.000.000.000 Progress
          </p>
          <div class="w-full px-2 m-auto">
            <progress
              class="h-1 progress progress-accent "
              value={12}
              max="100"
            />
          </div> -->
          <p class="mt-4 text">
            Help your family, friends and others to get onboard by <a
              href="/#/dashboard/become-a-hub"
              class="btn-link">becoming an invite hub</a
            >
          </p>
          <div class="mr-1 text-primary" />
        </div>
      </div>
    </section>
  {/if}

  <!-- PASSPORT  -->
  <a href="/#/passport/profile">
    <section class="flex items-center justify-center mb-4">
      <div class="flex items-center w-full px-2 bg-white rounded-sm shadow">
        <div class="px-4 py-2 mr-4 -ml-3 text-center ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="m-auto h-14 w-14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
            />
          </svg>
        </div>
        <div class="flex items-center">
          <h2 class="mr-2 text-4xl font-medium ">Passport</h2>
        </div>
        <div class="flex justify-end flex-1 mr-1 text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
    </section>
  </a>

  <!-- BANKING -->
  {#if showFundHint || disableBanking}
    <section class="flex items-center justify-center mb-4">
      <div class="flex items-center w-full px-2 bg-white rounded-sm shadow">
        <div class="px-4 py-2 mr-4 -ml-3 text-center text-base-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="m-auto h-14 w-14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <div class="flex flex-col items-left">
          <h2 class="mr-2 text-4xl text-base-300">Banking</h2>
        </div>
        <div class="flex justify-end flex-1 mr-1 text-base-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
    </section>
  {:else}
    <a href={showFundHint ? "/#/dashboard" : "/#/banking/transactions"}>
      <section class="flex items-center justify-center mb-4">
        <div class="flex items-center w-full px-2 bg-white rounded-sm shadow">
          <div class="px-4 py-2 mr-4 -ml-3 text-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="m-auto h-14 w-14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div class="flex items-center">
            <h2 class="mr-2 text-4xl font-medium ">Banking</h2>
          </div>
          <div class="flex justify-end flex-1 mr-1 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </section>
    </a>
  {/if}

  <!-- Market -->

  <a href="/#/marketplace/stream">
    <section class="flex items-center justify-center mb-4">
      <div class="flex items-center w-full px-2 bg-white rounded-sm shadow">
        <div class="px-4 py-2 mr-4 -ml-3 text-center ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="m-auto h-14 w-14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <div class="flex flex-col items-left">
          <h2 class="mr-2 text-4xl ">Market</h2>
          <p class="text-sm text-base-300">coming soon</p>
        </div>
        <div class="flex justify-end flex-1 mr-1 text-primary">
          <div class="flex justify-end flex-1 mr-1 text-base-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  </a>

  <!-- Chat -->

  <a href="https://discord.gg/4DBbRCMnFZ" target="_blank">
    <section class="flex items-center justify-center mb-4">
      <div class="flex items-center w-full px-2 bg-white rounded-sm shadow">
        <div class="px-4 py-2 mr-4 -ml-3 text-center ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="m-auto h-14 w-14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
            />
          </svg>
        </div>
        <div class="flex flex-col items-left">
          <h2 class="mr-2 text-4xl ">Chat</h2>
        </div>
        <div class="flex justify-end flex-1 mr-1 text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
    </section>
  </a>
</div>
