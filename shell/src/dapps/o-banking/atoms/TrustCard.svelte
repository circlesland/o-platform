<script lang="ts">
  import { push } from "svelte-spa-router";
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import { transfer } from "../processes/transfer";
  import { TrustObject } from "../data/circles/types";
  import { tryGetCurrentSafe } from "../init";
  import { createAvatar } from "@dicebear/avatars";
  import * as style from "@dicebear/avatars-avataaars-sprites";

  export let trusting: TrustObject;
  export let trustedBy: TrustObject;
  export let untrusted: TrustObject;

  let pictureUrl: string;
  let displayName: string;
  let safeAddress: string;

  let id: String;

  $: {
    if (untrusted) {
      // <!-- TODO: Possible actions: trust (also: send money if they still trust $mySafe) -->
      displayName = untrusted.profile
        ? untrusted.profile.displayName
        : untrusted.safeAddress;
      pictureUrl = untrusted.profile ? untrusted.profile.avatarUrl : undefined;
      safeAddress = untrusted.safeAddress;
      id = untrusted._id;
    } else if (trustedBy && trusting) {
      // <!-- TODO: Possible actions: untrust, transfer money -->
      displayName = trustedBy.profile
        ? trustedBy.profile.displayName
        : trustedBy.safeAddress;
      pictureUrl = trustedBy.profile ? trustedBy.profile.avatarUrl : undefined;
      safeAddress = trusting.safeAddress;
      id = trustedBy._id;
    } else if (trustedBy) {
      // <!-- TODO: Possible actions: trust, transfer money -->
      displayName = trustedBy.profile
        ? trustedBy.profile.displayName
        : trustedBy.safeAddress;
      pictureUrl = trustedBy.profile ? trustedBy.profile.avatarUrl : undefined;
      safeAddress = trustedBy.safeAddress;
      id = trustedBy._id;
    } else if (trusting) {
      // <!-- TODO: Possible actions: untrust -->
      displayName = trusting.profile
        ? trusting.profile.displayName
        : trusting.safeAddress;
      pictureUrl = trusting.profile ? trusting.profile.avatarUrl : undefined;
      safeAddress = trusting.safeAddress;
      id = trusting._id;
    }

    if (!pictureUrl) {
      pictureUrl = createAvatar(style, {
        seed: safeAddress,
        topChance: 100,
        style: "transparent",
        dataUri: true,
      });
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
            safeAddress: tryGetCurrentSafe()?.safeAddress,
            privateKey: localStorage.getItem("circlesKey"),
          },
        };
        return ctx;
      })
    );
  }
</script>

<section class="flex items-center justify-center mb-2 text-circlesdarkblue">
  <div
    class="flex items-center bg-white shadow w-full space-x-2 px-4 sm:space-x-6 pt-5 rounded-sm"
  >
    <div class="mr-2 -mt-3 text-center">
      <div class="avatar">
        <div class="rounded-full w-12 h-12 sm:w-12 sm:h-12 m-auto">
          <img src={pictureUrl} alt={displayName} />
        </div>
      </div>
    </div>

    <div class="text-left flex-grow truncate relative">
      <div
        class="max-w-full truncateThis cursor-pointer"
        on:click|once={() => loadDetailPage(safeAddress)}
      >
        <h2 class="text-2xl sm:text-3xl">
          {displayName}
        </h2>
      </div>

      {#if untrusted}
        <div class="text-left text-sm text-red mb-4">
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
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
          <span class="inline text-dark">Not trusted</span>
        </div>
      {/if}
      {#if trustedBy && trusting}
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
          <span class="inline text-dark">Mutual trust</span>
        </div>
      {/if}
      {#if !(trustedBy && trusting) && trustedBy}
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
              d="M11 17l-5-5m0 0l5-5m-5 5h12"
            />
          </svg>
          <span class="inline text-dark">Is trusting you</span>
        </div>
      {/if}
      {#if !(trustedBy && trusting) && trusting}
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
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
          <span class="inline text-dark">Trusted by you</span>
        </div>
      {/if}
    </div>

    <div class="flex flex-1 flex-col justify-items-end self-start">
      <div class="self-end flex flex-col space-y-2 text-2xl sm:text-3xl ">
        <button
          on:click={() => execTransfer(safeAddress)}
          class="btn btn-square self-end btn-md btn-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10"
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
      </div>
      <!-- <div class="self-end mt-2 text-xs text-circleslightblue">
          9 days ago
        </div> -->
    </div>
  </div>
</section>
