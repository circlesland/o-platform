<script lang="ts">
  import { transfer } from "../processes/transfer";
  // import { TrustObject } from "../data/circles/types";
  // import { tryGetCurrentSafe } from "../init";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";
  import Icons from "../../../shared/molecules/Icons.svelte";
  import { push } from "svelte-spa-router";

  import ItemCard from "../../../shared/atoms/ItemCard.svelte";
  /*
  export let trusting: TrustObject;
  export let trustedBy: TrustObject;
  export let untrusted: TrustObject;
   */

  let pictureUrl: string;
  let displayName: string;
  let safeAddress: string;
  let message: string;

  let id: String;

  $: {
    /*
    if (untrusted) {
      // <!-- TODO: Possible actions: trust (also: send money if they still trust $mySafe) -->
      displayName = untrusted.profile
        ? untrusted.profile.displayName
        : untrusted.safeAddress;
      pictureUrl = untrusted.profile ? untrusted.profile.avatarUrl : undefined;
      safeAddress = untrusted.safeAddress;
      id = untrusted._id;
      message = "Not trusted";
    } else if (trustedBy && trusting) {
      // <!-- TODO: Possible actions: untrust, transfer money -->
      displayName = trustedBy.profile
        ? trustedBy.profile.displayName
        : trustedBy.safeAddress;
      pictureUrl = trustedBy.profile ? trustedBy.profile.avatarUrl : undefined;
      safeAddress = trusting.safeAddress;
      id = trustedBy._id;
      message = "Mutual trust";
    } else if (trustedBy) {
      // <!-- TODO: Possible actions: trust, transfer money -->
      displayName = trustedBy.profile
        ? trustedBy.profile.displayName
        : trustedBy.safeAddress;
      pictureUrl = trustedBy.profile ? trustedBy.profile.avatarUrl : undefined;
      safeAddress = trustedBy.safeAddress;
      id = trustedBy._id;
      message = "Is trusting you";
    } else if (trusting) {
      // <!-- TODO: Possible actions: untrust -->
      displayName = trusting.profile
        ? trusting.profile.displayName
        : trusting.safeAddress;
      pictureUrl = trusting.profile ? trusting.profile.avatarUrl : undefined;
      safeAddress = trusting.safeAddress;
      id = trusting._id;
      message = "Trusted by you";
    }

    if (!pictureUrl) {
      pictureUrl = AvataarGenerator.generate(safeAddress);
    }
     */
  }

  function loadDetailPage(path) {
    push(`#/friends/${path}`);
  }

  function execTransfer(recipientAddress?: string) {
    /*
    window.o.runProcess(transfer, {
      recipientAddress,
      safeAddress: tryGetCurrentSafe()?.safeAddress,
      privateKey: localStorage.getItem("circlesKey"),
    });
     */
  }
</script>

<div on:click="{() => loadDetailPage(safeAddress)}">
  <ItemCard
    params="{{ edgeless: false, imageUrl: pictureUrl, title: displayName, subTitle: message, truncateMain: true }}">
    <div slot="itemCardStart">
      <div class="avatar">
        <div class="m-auto mt-1 rounded-full w-11 h-11 sm:w-12 sm:h-12">
          <img src="{pictureUrl}" alt="{displayName}" />
        </div>
      </div>
    </div>
    <div slot="itemCardEnd">
      <div class="self-end text-lg sm:text-3xl">
        <button
          on:click="{e => {
            execTransfer(safeAddress);
            e.stopPropagation();
            return false;
          }}"
          class="self-end text-base ">
          <Icons icon="sendmoney" />
        </button>
      </div>
    </div>
  </ItemCard>
</div>
