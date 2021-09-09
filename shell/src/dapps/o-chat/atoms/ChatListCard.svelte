<script lang="ts">
  import { transfer } from "../../o-banking/processes/transfer";
  import { TrustObject } from "../../o-banking/data/circles/types";
  import { tryGetCurrentSafe } from "../../o-banking/init";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";
  import Icons from "../../../shared/molecules/Icons.svelte";
  import { push } from "svelte-spa-router";

  import ItemCard from "../../../shared/atoms/ItemCard.svelte";
  export let trusting: TrustObject;
  export let trustedBy: TrustObject;
  export let untrusted: TrustObject;

  let pictureUrl: string;
  let displayName: string;
  let safeAddress: string;
  let message: string;
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
  }

  function loadDetailPage(path) {
    push(`#/chat/${path}`);
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
      <div class="self-end h-6 text-right"></div>
      <div class="self-end text-xs text-dark-lightest whitespace-nowrap">
        <span>5 min ago</span>
      </div>
    </div>
  </ItemCard>
</div>
