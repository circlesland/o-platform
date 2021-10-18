<script lang="ts">
import { push } from "svelte-spa-router";
import { me } from "../../../shared/stores/me";

import Date from "../../../shared/atoms/Date.svelte";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import {
  CrcHubTransfer,
  CrcMinting,
  Profile,
  ProfileEvent,
} from "../data/api/types";
import { onMount } from "svelte";
import { displayCirclesAmount } from "src/shared/functions/displayCirclesAmount";

export let param: ProfileEvent;

let path: any;
let fromProfile: Profile = <any>{};
let toProfile: Profile = <any>{};
let error: string;
let message: string | undefined = undefined;
let targetProfile: Profile = <any>{};

onMount(async () => {
  if (param && param.payload?.__typename == "CrcMinting") {
    const minting = param.payload as CrcMinting;
    fromProfile = minting.from_profile ?? {
      id: 0,
      firstName: "Circles Land",
      lastName: "",
      avatarUrl: "/images/common/circles.png",
      circlesAddress: minting.from,
    };

    toProfile = minting.to_profile ?? {
      id: 0,
      firstName: minting.to.substr(0, 24) + "...",
      lastName: "",
      circlesAddress: minting.to,
    };
  }

  if (param && param.payload?.__typename == "CrcHubTransfer") {
    const hubTransfer = param.payload as CrcHubTransfer;
    fromProfile = hubTransfer.from_profile ?? {
      id: 0,
      firstName: hubTransfer.from.substr(0, 24) + "...",
      lastName: "",
      circlesAddress: hubTransfer.from,
    };

    toProfile = hubTransfer.to_profile ?? {
      id: 0,
      firstName: hubTransfer.to.substr(0, 24) + "...",
      lastName: "",
      circlesAddress: hubTransfer.to,
    };

    path = {
      transfers: hubTransfer.transfers,
    };
  }

  if (param) {
    message = param.tags?.find(
      (o) => o.typeId === "o-banking:transfer:message:1"
    )?.value;
  }

  targetProfile = param.direction === "in" ? fromProfile : toProfile;
});

function loadDetailPage(path) {
  push(`#/banking/transactions/${path}`);
}
</script>

<div on:click="{() => loadDetailPage(param.transaction_hash)}">
  <ItemCard
    params="{{
      edgeless: false,
      imageProfile: targetProfile,
      imageAlt:
        param.direction === 'in'
          ? fromProfile.circlesAddress
          : toProfile.circlesAddress,
      imageAction: (e) => {
        const target = targetProfile.circlesAddress;
        push(`#/friends/${target}`);
        e.stopPropagation();
      },
      title: targetProfile.firstName + ' ' + targetProfile.lastName,
      subTitle: message ? message : '',
      truncateMain: true,
    }}">
    <div slot="itemCardEnd">
      <div
        class="self-end text-right"
        class:text-success="{param.direction === 'in'}"
        class:text-alert="{param.direction === 'out'}">
        <span>
          {displayCirclesAmount(
            param ? param.value : "0",
            param.timestamp,
            true,
            $me.displayTimeCircles || $me.displayTimeCircles === undefined
          )}
        </span>
      </div>
      <div class="self-end text-xs text-dark-lightest whitespace-nowrap">
        {#if param.timestamp}
          <Date time="{param.timestamp}" />
        {/if}
      </div>
    </div>
  </ItemCard>
</div>
