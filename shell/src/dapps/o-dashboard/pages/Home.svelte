<script lang="ts">
  import {dashboard} from "../../o-dashboard.manifest";
  import DashboardHeader from "../atoms/DashboardHeader.svelte";
  import {me} from "../../../shared/stores/me";
  import {showToast} from "../../../shared/toast";
  import {onMount} from "svelte";
  import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
  import {BN} from "ethereumjs-util";
  import CopyClipBoard from "../../../shared/atoms/CopyClipboard.svelte";

  const {mySafe} = require("src/dapps/o-banking/stores/safe");
  import {INVITE_VALUE} from "src/dapps/o-passport/processes/invite/invite";
  import Web3 from "web3";

  $: me;

  function buyXats() {
    window.o.publishEvent(
      dashboard.actions.find((o) => o.key == "xats").event(undefined)
    );
  }

  let accountAddress: string = "";
  let accountBalance: string = "";
  let safeDeployThreshold: string = "200000000000000000";
  let inviteThreshold: string = "";
  let showFundHint: boolean = false;
  let inviteLink: string = "";

  onMount(async () => {
    const pk = localStorage.getItem("circlesKey");
    if (!pk || localStorage.getItem("isCreatingSafe") !== "true") {
      return;
    }

    accountAddress = RpcGateway.get().eth.accounts.privateKeyToAccount(pk).address;

    if (localStorage.getItem("isCreatingSafe")) {
      showFundHint = true;
      return;
    }
    accountBalance = await RpcGateway.get().eth.getBalance(accountAddress);
    showFundHint = new BN(accountBalance).lt(new BN(safeDeployThreshold));
  })

  const copy = () => {
    const app = new CopyClipBoard({
      target: document.getElementById("clipboard"),
      props: {name: inviteLink},
    });
    app.$destroy();
  };

  $: {
    if ($me) {
      inviteLink = `${window.location.protocol}//${window.location.host}/#/passport/profile/${$me.id}`
    }
  }
</script>

<DashboardHeader/>
<div class="mx-4">
  {#if showFundHint}
    <!-- Create safe  -->
    <section class="mb-8">
      <div class="bg-white shadow px-2  w-full rounded-sm">
        <div class="mr-4  px-4 py-2  text-center -ml-3 text-secondary">
        </div>
        <div style="text-align: center">
          <p class="text-2xl mt-2">Welcome! You're almost there.</p>
          <p class="text mt-4">Copy the invite link and send it to someone who's already a citizen of circles.land:</p>
          <div class="break-all mt-4 text-xs" id="clipboard">
            <input type="text" class="hidden" bind:value={inviteLink}/>
            <p class="text-2xl">{inviteLink}</p>
            <div
              class="inline-block text-light cursor-pointertext-center text-xs relative -bottom-1"
              on:click={copy}
              alt="Copy to Clipboard"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 stroke-current transform group-hover:rotate-[-4deg] transition"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
          <p class="text">
            If you don't know anybody who has Circles yet, ask nicely in our <a href="" class="btn-link">Discord</a> if
            someone can send you
            the required invite.
          </p>
          <p class="text-xs mt-4 pb-4">
            alternatively, <a href="#/dashboard/become-a-hub">become a hub</a>
          </p>
          <div class="mr-1 text-primary">
          </div>
        </div>
      </div>
    </section>

  {:else if $mySafe}
    <!-- Create safe  -->
    <section class="mb-8">
      <div class="bg-white shadow px-2  w-full rounded-sm">
        <div class="mr-4  px-4 py-2  text-center -ml-3 text-secondary">
        </div>
        <div style="text-align: center">
          <p class="text-2xl mt-2">Grow the global UBI economy!</p>
          <p class="text mt-4">xxxxxxx/1.000.000.000 Progress bar</p>
          <p class="text mt-4">Help others to get aboard in our <a href="" class="btn-link">Discord</a> or <a
            href="/#/dashboard/become-a-hub" class="btn-link">become a hub</a> and invite your family and friends</p>
          <div class="mr-1 text-primary">
          </div>
        </div>
      </div>
    </section>
  {/if}

  <!-- PASSPORT  -->
  <a href="/#/passport/profile">
    <section class="flex items-center justify-center mb-8">
      <div
        class="flex items-center bg-white shadow px-2 -mt-6 w-full rounded-sm"
      >
        <div class="mr-4  px-4 py-2  text-center -ml-3 text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-14 w-14 m-auto"
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
          <h2 class="text-4xl font-circles mr-2 text-secondary font-medium">
            Passport
          </h2>
        </div>
        <div class="flex justify-end flex-1 mr-1 text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
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
  {#if showFundHint}
    <section class="flex items-center justify-center mb-8">
      <div class="flex items-center bg-white shadow px-2 w-full rounded-sm">
        <div class="mr-4  px-4 py-2  text-center -ml-3 text-base-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-14 w-14 m-auto"
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
          <h2 class="text-4xl font-circles mr-2 text-base-300">Banking</h2>
        </div>
        <div class="flex justify-end flex-1 mr-1 text-base-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
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
    <a href="{showFundHint ? '/#/dashboard' : '/#/banking/transactions'}">
      <section class="flex items-center justify-center mb-8">
        <div class="flex items-center bg-white shadow px-2 w-full rounded-sm">
          <div class="mr-4  px-4 py-2  text-center -ml-3 text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-14 w-14 m-auto"
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
            <h2 class="text-4xl font-circles mr-2 text-secondary font-medium">
              Banking
            </h2>
          </div>
          <div class="flex justify-end flex-1 mr-1 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
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

  <section class="flex items-center justify-center mb-8">
    <div class="flex items-center bg-white shadow px-2 w-full rounded-sm">
      <div class="mr-4  px-4 py-2  text-center -ml-3 text-base-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-14 w-14 m-auto"
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
        <h2 class="text-4xl font-circles mr-2 text-base-300">Market</h2>
        <p class="text-sm text-base-300">coming soon</p>
      </div>
      <div class="flex justify-end flex-1 mr-1 text-base-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
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

  <!-- Chat -->

  <section class="flex items-center justify-center mb-8">
    <div class="flex items-center bg-white shadow px-2 w-full rounded-sm">
      <div class="mr-4  px-4 py-2  text-center -ml-3 text-base-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-14 w-14 m-auto"
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
      <div class="flex flex-col items-left">
        <h2 class="text-4xl font-circles mr-2 text-base-300">Chat</h2>
        <p class="text-sm text-base-300">coming soon</p>
      </div>
      <div class="flex justify-end flex-1 mr-1 text-base-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
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
</div>
<!-- 
  <div
  class="w-full  h-72 bg-center bg-no-repeat bg-cover"
  style="background-image: url('https://images.unsplash.com/photo-1609343007774-dad98a8f8c33?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1225&q=80');"
>
  <div
    class="w-full h-72 bg-opacity-50 bg-black flex justify-center items-center relative"
  >
    <div class="mx-4 text-center text-white">
      <h1 class="font-bold text-6xl mb-4">Xats is what you need!</h1>
      <h2 class="font-bold text-3xl mb-12">Xats is what you want!</h2>
    </div>
    <div class="absolute bottom-4">
      <button class="btn btn-primary" on:click={() => buyXats()}
        >buy Xats now</button
      >
    </div>
  </div>
</div> 
-->
