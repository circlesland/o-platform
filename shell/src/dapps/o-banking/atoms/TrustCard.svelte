<script lang="ts">
  import { transfer } from "../processes/transfer";
  import { TrustObject } from "../data/circles/types";
  import { tryGetCurrentSafe } from "../init";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";
  import Icons from "../../../shared/molecules/Icons.svelte";
  import { push } from "svelte-spa-router";
  import Card from "src/shared/atoms/Card.svelte";

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
    push(`#/banking/profile/${path}`);
  }

  function execTransfer(recipientAddress?: string) {
    window.o.runProcess(transfer, {
      recipientAddress,
      safeAddress: tryGetCurrentSafe()?.safeAddress,
      privateKey: localStorage.getItem("circlesKey"),
    });
  }
</script>

<section
  class="flex items-center justify-center mb-2"
  on:click={() => loadDetailPage(safeAddress)}
>
  <Card>
    <div class="mr-2 text-center">
      <div class="avatar">
        <div class="m-auto mt-1 rounded-full w-11 h-11 sm:w-12 sm:h-12">
          <img src={pictureUrl} alt={displayName} />
        </div>
      </div>
    </div>

    <div class="relative flex-grow text-left truncate">
      <div class="truncateThis">
        <h2 class="text-base">{displayName}</h2>
      </div>
      <p class="text-xs text-dark-lightest">
        {#if untrusted}Not trusted{/if}
        {#if trustedBy && trusting}Mutual trust{/if}
        {#if !(trustedBy && trusting) && trustedBy}Is trusting you{/if}
        {#if !(trustedBy && trusting) && trusting}Trusted by you{/if}
      </p>
    </div>

    <div class="flex flex-col flex-1 justify-items-end">
      <div class="self-end text-lg sm:text-3xl">
        <button
          on:click={(e) => {
            execTransfer(safeAddress);
            e.stopPropagation();
            return false;
          }}
          class="self-end text-base "
        >
          <Icons icon="sendmoney" />
        </button>
      </div>
    </div>
  </Card>
</section>
