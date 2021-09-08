<script lang="ts">
  import Web3 from "web3";
  import { push } from "svelte-spa-router";

  import Date from "../../../shared/atoms/Date.svelte";
  import ItemCard from "../../../shared/atoms/ItemCard.svelte";
  import {CrcHubTransfer, CrcMinting, ProfileEvent} from "../data/api/types";

  export let transfer: ProfileEvent;
  export let message: String;

  let pictureUrl: string;
  let otherSafeAddress: string;
  let displayName: string;
  let classes: string;
  let amount: string;

  $: {
    if (transfer && transfer.type == "crc_minting" && transfer.payload) {
      let minting = transfer.payload as CrcMinting;
      if (minting) {
        displayName = "Circles Land";
      }

      amount = Number.parseFloat(
              Web3.utils.fromWei(minting.value.toString(), "ether")
      ).toFixed(2);
    }
    if (transfer && transfer.type == "crc_hub_transfer" && transfer.payload) {
      let hubTransfer = transfer.payload as CrcHubTransfer;
      if (hubTransfer) {
        displayName = transfer.direction === "in"
                ? (hubTransfer.from_profile
                        ? hubTransfer.from_profile.firstName + hubTransfer.from_profile.lastName ?? ""
                        : hubTransfer.from)
                : (hubTransfer.to_profile
                        ? hubTransfer.to_profile.firstName + hubTransfer.to_profile.lastName ?? ""
                        : hubTransfer.to);

        pictureUrl = transfer.direction === "in"
                        ? (hubTransfer.from_profile
                            ? hubTransfer.from_profile.avatarUrl
                            : undefined)
                        : (hubTransfer.to_profile
                            ? hubTransfer.to_profile.avatarUrl
                            : undefined);
      }

      amount = Number.parseFloat(
              Web3.utils.fromWei(hubTransfer.flow.toString(), "ether")
      ).toFixed(2);

      otherSafeAddress = transfer.direction === "in" ? hubTransfer.from : hubTransfer.to;
    }

    pictureUrl = displayName === "Circles Land" ? "/images/common/circles.png" : pictureUrl;
    message = displayName === "Circles Land" ? "Universal basic income" : ">>Transaction message<<";

    classes =
      transfer.direction === "in"
        ? "transactionpositive"
        : "transactionnegative";

    if (classes == "transactionnegative") {
      amount = "-" + amount;
    }
  }

  function loadDetailPage(path) {
    push(`#/banking/transactions/${path}`);
  }
</script>

<div on:click="{() => loadDetailPage(transfer.transaction_hash)}">
  <ItemCard
    params="{{ edgeless: false, imageUrl: pictureUrl, imageAlt: otherSafeAddress, title: displayName, subTitle: message, truncateMain: true }}">

    <div slot="itemCardEnd">
      <div
        class="self-end text-right"
        class:text-success="{classes == 'transactionpositive'}"
        class:text-alert="{classes == 'transactionnegative'}">
        <span>{amount}</span>
      </div>
      <div class="self-end text-xs text-dark-lightest whitespace-nowrap">
        {#if transfer.timestamp}
          <Date time="{transfer.timestamp / 1000}" />
        {/if}
      </div>
    </div>
  </ItemCard>
</div>
