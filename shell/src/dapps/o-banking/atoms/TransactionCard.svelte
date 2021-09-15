<script lang="ts">
  import Web3 from "web3";
  import { push } from "svelte-spa-router";

  import Date from "../../../shared/atoms/Date.svelte";
  import ItemCard from "../../../shared/atoms/ItemCard.svelte";
  import {CrcHubTransfer, CrcMinting, Profile, ProfileEvent, TransactionByHashDocument} from "../data/api/types";
  import {onMount} from "svelte";
  import {AvataarGenerator} from "../../../shared/avataarGenerator";
  // import {transactionHash} from "../pages/TransactionDetail.svelte";

  export let transfer: ProfileEvent;

  let path: any;
  let fromProfile: Profile = <any>{};
  let toProfile: Profile = <any>{};
  let error:string;
  let message:string|undefined = undefined;

  onMount(async () => {
    if (transfer && transfer.payload?.__typename == "CrcMinting") {
      const minting = transfer.payload as CrcMinting;
      fromProfile = minting.from_profile ?? {
        id: 0,
        firstName: "Circles Land",
        lastName: "",
        avatarUrl: "/images/common/circles.png",
        circlesAddress: minting.from,
      }
      if (!fromProfile.avatarUrl) {
        fromProfile.avatarUrl = AvataarGenerator.generate(minting.from);
      }
      toProfile = minting.to_profile ?? {
        id: 0,
        firstName: minting.to.substr(0, 24) + '...',
        lastName: "",
        circlesAddress: minting.to
      }
      if (!toProfile.avatarUrl) {
        toProfile.avatarUrl = AvataarGenerator.generate(minting.to);
      }
    }

    if (transfer && transfer.payload?.__typename == "CrcHubTransfer") {
      const hubTransfer = transfer.payload as CrcHubTransfer;
      fromProfile = hubTransfer.from_profile ?? {
        id: 0,
        firstName: hubTransfer.from.substr(0, 24) + '...',
        lastName: "",
        circlesAddress: hubTransfer.from,
      }
      if (!fromProfile.avatarUrl) {
        fromProfile.avatarUrl = AvataarGenerator.generate(hubTransfer.from);
      }
      toProfile = hubTransfer.to_profile ?? {
        id: 0,
        firstName: hubTransfer.to.substr(0, 24) + '...',
        lastName: "",
        circlesAddress: hubTransfer.to
      }
      if (!toProfile.avatarUrl) {
        toProfile.avatarUrl = AvataarGenerator.generate(hubTransfer.to);
      }
      path = {
        transfers: hubTransfer.transfers
      };
    }

    if (transfer) {
      message = transfer.tags?.find(o => o.typeId === "o-banking:transfer:message:1")?.value
    }
  });

  function loadDetailPage(path) {
    push(`#/banking/transactions/${path}`);
  }
</script>

<div on:click="{() => loadDetailPage(transfer.transaction_hash)}">
  <ItemCard
    params="{{
      edgeless: false,
      imageUrl: transfer.direction === 'in' ? fromProfile.avatarUrl : toProfile.avatarUrl,
      imageAlt: transfer.direction === 'in' ? fromProfile.circlesAddress : toProfile.circlesAddress,
      imageAction: (e) => {
        const target = transfer.direction === 'in'
          ? fromProfile.circlesAddress
          : toProfile.circlesAddress;
        push(`#/friends/${target}`);
        e.stopPropagation();
      },
      title: transfer.direction === 'in'
        ? fromProfile.firstName + ' ' + fromProfile.lastName
        : toProfile.firstName + ' ' + toProfile.lastName,
      subTitle: message ? message : '',
      truncateMain: true }}">

    <div slot="itemCardEnd">
      <div
        class="self-end text-right"
        class:text-success="{transfer.direction === 'in'}"
        class:text-alert="{transfer.direction === 'out'}">
        <span>{Number.parseFloat(Web3.utils.fromWei(transfer ? transfer.value.toString() : '0', 'ether')).toFixed(2)}</span>
      </div>
      <div class="self-end text-xs text-dark-lightest whitespace-nowrap">
        {#if transfer.timestamp}
          <Date time="{transfer.timestamp / 1000}" />
        {/if}
      </div>
    </div>
  </ItemCard>
</div>
