<script lang="ts">
  import Web3 from "web3";
  import { Transfer } from "../data/circles/types";
  import { push } from "svelte-spa-router";

  import Date from "../../../shared/atoms/Date.svelte";
  import ItemCard from "../../../shared/atoms/ItemCard.svelte";

  export let transfer: Transfer;
  export let message: String;

  let pictureUrl: string;
  let otherSafeAddress: string;
  let displayName: string;
  let classes: string;
  let amount: string;

  $: {
    displayName =
      transfer.direction === "in"
        ? transfer.fromProfile
          ? transfer.fromProfile.displayName
          : transfer.from
        : transfer.toProfile
        ? transfer.toProfile.displayName
        : transfer.to;

    otherSafeAddress =
      transfer.direction === "in" ? transfer.from : transfer.to;

    displayName =
      displayName === "0x0000000000000000000000000000000000000000"
        ? "CirclesLand"
        : displayName;

    pictureUrl =
      transfer.direction === "in"
        ? transfer.fromProfile
          ? transfer.fromProfile.avatarUrl
          : undefined
        : transfer.toProfile
        ? transfer.toProfile.avatarUrl
        : undefined;

    pictureUrl =
      displayName === "CirclesLand" ? "/images/common/circles.png" : pictureUrl;

    const m = transfer.tags
      ? transfer.tags.find(o => o.typeId === "o-banking:transfer:message:1")
      : undefined;
    const m2 = m ? m.value : "";
    message = displayName === "CirclesLand" ? "Universal basic income" : m2;

    classes =
      transfer.direction === "in"
        ? "transactionpositive"
        : "transactionnegative";

    amount = Number.parseFloat(
      Web3.utils.fromWei(transfer.amount, "ether")
    ).toFixed(2);
    if (classes == "transactionnegative") {
      amount = "-" + amount;
    }
  }

  function loadDetailPage(path) {
    push(`#/banking/transactions/${path}`);
  }
</script>

<div on:click="{() => loadDetailPage(transfer._id)}">
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
        {#if transfer.time}
          <Date time="{transfer.time}" />
        {/if}
      </div>
    </div>
  </ItemCard>
</div>
