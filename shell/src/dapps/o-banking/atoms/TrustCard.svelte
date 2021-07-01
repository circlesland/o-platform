<script lang="ts">
  import {
    runShellProcess
  } from "../../../shared/processes/shellProcess";
  import { transfer } from "../processes/transfer";
  import { TrustObject } from "../data/circles/types";
  import { tryGetCurrentSafe } from "../init";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";
  import Icons from "../../../shared/molecules/Icons.svelte";
  import {push} from "svelte-spa-router";

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
      pictureUrl = AvataarGenerator.generate(safeAddress);
    }
  }

  function loadDetailPage(path) {
    push(`#/banking/profile/${path}`)
  }

  function execTransfer(recipientAddress?: string) {
    window.o.publishEvent(runShellProcess(transfer, {
      recipientAddress,
      safeAddress: tryGetCurrentSafe()?.safeAddress,
      privateKey: localStorage.getItem("circlesKey"),
    }));
  }
</script>

<section
  class="flex items-center justify-center mb-2 "
  on:click|once={() => loadDetailPage(safeAddress)}
>
  <div
    class="flex items-center w-full px-4 pt-4 space-x-2 bg-white rounded-sm shadow sm:space-x-6"
  >
    <div class="mr-2 -mt-3 text-center">
      <div class="avatar">
        <div class="w-12 h-12 m-auto rounded-full sm:w-12 sm:h-12">
          <img src={pictureUrl} alt={displayName} />
        </div>
      </div>
    </div>

    <div class="relative flex-grow text-left truncate">
      <div class="max-w-full cursor-pointer truncateThis">
        <h2 class="text-base">
          {displayName}
        </h2>
      </div>

      {#if untrusted}
        <div class="mb-4 text-xs text-left text-alert-dark">
          <span class="inline ">Not trusted</span>
        </div>
      {/if}
      {#if trustedBy && trusting}
        <div class="mb-4 text-xs text-left text-light-dark">
          <span class="inline ">Mutual trust</span>
        </div>
      {/if}
      {#if !(trustedBy && trusting) && trustedBy}
        <div class="mb-4 text-xs text-left text-light-dark">
          <span class="inline">Is trusting you</span>
        </div>
      {/if}
      {#if !(trustedBy && trusting) && trusting}
        <div class="mb-4 text-xs text-left text-light-dark">
          <span class="inline">Trusted by you</span>
        </div>
      {/if}
    </div>

    <div class="flex flex-col self-start flex-1 mt-2 justify-items-end">
      <div class="flex flex-col self-end space-y-2 text-2xl sm:text-3xl ">
        <button
          on:click={() => execTransfer(safeAddress)}
          class="self-end text-base "
        >
          <Icons icon="sendmoney" />
        </button>
      </div>
    </div>
  </div>
</section>
