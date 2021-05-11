<script lang="ts">
  import { onMount } from "svelte";
  import { getLastLoadedDapp, getLastLoadedPage } from "../../../loader";
  import { PageManifest } from "@o-platform/o-interfaces/dist/pageManifest";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
  import Web3 from "web3";

  let lastLoadedPage: PageManifest;
  let lastLoadedDapp: DappManifest<any>;
  export let amount;
  export let classes: String;

  onMount(() => {
    lastLoadedPage = getLastLoadedPage();
    lastLoadedDapp = getLastLoadedDapp();
  });
</script>

<!-- BANKING HEADER START -->
<div
  class="h-80 flex flex-col items-stretch navbar bg-gradient-to-r from-gradient1 to-gradient2 text-white"
>
  {#if lastLoadedDapp && lastLoadedPage}
    <div
      class="h-24 pt-0  flex flex-row  justify-between navbar bg-gradient-to-r from-gradient1 to-gradient2 text-white"
    >
      <div
        class="self-start cursor-pointer"
        on:click|once={() => history.back()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 inline-block mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span class="text-lg font-circles">
          {#if lastLoadedDapp.title != lastLoadedPage.title}
            {lastLoadedDapp.title} /
          {/if}
          {lastLoadedPage.title}
        </span>
      </div>
      <div class="self-start">
        <button
          class=" text-white"
          on:click={() => (window.location = "/#/dashboard")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </button>
      </div>
    </div>
  {/if}
  <div class="self-center text-center mb-8 block">
    {#if classes == "transactionpositive"}
      <span class="block text-transactionpositive">Received</span>
    {:else if classes == "transactionnegative"}
      <span class="block text-transactionnegative">Sent</span>
    {:else}
      <span class="block text-base">Transfer</span>
    {/if}
    <span class="inline-block text-8xl font-circles ml-10 ">
      {Number.parseFloat(
        Web3.utils.fromWei(amount ? amount : "0", "ether")
      ).toFixed(2)}
      <svg
        class="w-8 h-8 inline -ml-4 -mt-1"
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
      </svg></span
    >
    <span class="inline-block align-middle h-full pt-2 text-left" />
  </div>
</div>
