<script lang="ts">
  import { push } from "svelte-spa-router";
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import { transfer } from "../processes/transfer";
  import { setTrust } from "../processes/setTrust";
  import { TrustObject } from "../data/circles/queries";

  export let trusting: TrustObject;
  export let trustedBy: TrustObject;
  export let direction: String;

  let pictureUrl: string;
  let displayName: String;
  let limit: String = "0";
  let id: String;

  $: {
    switch (direction) {
      case "trusted":
      case "mutual":
        displayName = trustedBy.profile
          ? trustedBy.profile.displayName
          : trustedBy.safeAddress;
        pictureUrl = trustedBy.profile
          ? trustedBy.profile.avatarUrl
          : undefined;
        limit = trusting.limit
          ? trusting.limit.toString()
          : "0" + "/" + trustedBy.limit
          ? trustedBy.limit.toString()
          : "0";
        id = trustedBy._id;
      case "trusting":
        displayName = trusting.profile
          ? trusting.profile.displayName
          : trusting.safeAddress;
        pictureUrl = trusting.profile ? trusting.profile.avatarUrl : undefined;
        limit = trusting.limit ? trusting.limit.toString() : "0";
        id = trusting._id;
    }
  }

  function loadDetailPage(path) {
    push("#/banking/trusts/" + path);
  }

  function execTransfer(recipientAddress?: string) {
    window.o.publishEvent(
      new RunProcess<ShellProcessContext>(shellProcess, true, async (ctx) => {
        ctx.childProcessDefinition = transfer;
        ctx.childContext = {
          data: {
            recipientAddress,
          },
          dirtyFlags: {},
          environment: {},
        };
        return ctx;
      })
    );
  }

  function execTrust(recipientAddress?: string) {
    window.o.publishEvent(
      new RunProcess<ShellProcessContext>(shellProcess, true, async (ctx) => {
        ctx.childProcessDefinition = setTrust;
        ctx.childContext = {
          data: {
            trustLimit: 100,
            trustReceiver: recipientAddress,
          },
          dirtyFlags: {},
          environment: {},
        };
        return ctx;
      })
    );
  }

  function execUntrust(recipientAddress?: string) {
    window.o.publishEvent(
      new RunProcess<ShellProcessContext>(shellProcess, true, async (ctx) => {
        ctx.childProcessDefinition = setTrust;
        ctx.childContext = {
          data: {
            trustLimit: 0,
            trustReceiver: recipientAddress,
          },
          dirtyFlags: {},
          environment: {},
        };
        return ctx;
      })
    );
  }
</script>

<section
  on:click|once={() => loadDetailPage(id)}
  class="flex items-center justify-center mb-2 text-circlesdarkblue"
>
  <div
    class="flex items-center bg-white shadow p-4 w-full space-x-2 sm:space-x-6"
  >
    <div class="mr-2 text-center">
      <div class="avatar">
        <div class="rounded-full w-12 h-12 sm:w-12 sm:h-12 m-auto">
          <img
            src={pictureUrl ? pictureUrl : "/images/common/circles.png"}
            alt="username"
          />
        </div>
      </div>
    </div>

    <div class="text-left">
      <div class="max-w-full trustCardName">
        <h2 class="text-2xl sm:text-3xl font-bold truncate ">
          {displayName && displayName.length > 22
            ? displayName.substring(0, 22) + ".."
            : displayName}
        </h2>
      </div>
      <div class="text-left text-sm text-green mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 inline -mt-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
        <span class="inline text-dark"> {limit}% trust. </span>
      </div>
    </div>

    <div class="flex flex-1 flex-col justify-items-end">
      <div class="self-end text-2xl sm:text-3xl">
        <button
          on:click={() => execTransfer(userId)}
          class="btn btn-square btn-sm btn-primary"
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
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </button>
        <button
          on:click={() => execTrust(userId)}
          class="btn btn-square btn-sm btn-primary"
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
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </button>
      </div>
      <!-- <div class="self-end mt-2 text-xs text-circleslightblue">
          9 days ago
        </div> -->
    </div>
  </div>
</section>

<style>
  @media (max-width: 496px) {
    .trustCardName {
      max-width: 200px;
    }
  }
</style>
