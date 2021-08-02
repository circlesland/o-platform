<script lang="ts">
  import Web3 from "web3";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";
  import Card from "src/shared/atoms/Card.svelte";
  import { Token } from "../data/circles/types";
  import { push } from "svelte-spa-router";

  export let token: Token;
  export let label: String;
  export let colorClass: String;

  let pictureUrl: string;
  let displayName: string;
  let classes: String;

  $: {
    displayName = token.ownerProfile
      ? token.ownerProfile.displayName
      : token.tokenOwner;

    pictureUrl = token.ownerProfile ? token.ownerProfile.avatarUrl : undefined;
    if (!pictureUrl) {
      pictureUrl = AvataarGenerator.generate(token.tokenOwner);
    }

    // console.log("TOKEN: ", token);
  }

  function loadDetailPage(path) {
    push(`#/banking/profile/${path}`);
  }
</script>

<section class="flex items-center justify-center mb-2 ">
  <div class="flex flex-col w-full p-4 space-y-2 bg-white rounded-lg shadow-sm">
    <div
      class="{colorClass ? colorClass : 'text-light'} text-xs font-bold
      text-left"
    >
      {label ? label : ''}
    </div>
    <div class="flex items-center w-full space-x-2 bg-white sm:space-x-6">
      <div class="mr-2 text-center">
        <div class="avatar">
          <div class="w-12 h-12 m-auto rounded-full sm:w-12 sm:h-12">
            <img src={pictureUrl} alt={displayName} />
          </div>
        </div>
      </div>

      <div class="relative flex-grow text-left truncate">
        <div
          class="max-w-full truncateThis "
          class:cursor-pointer={displayName != 'You'}
          on:click={() => (displayName == 'You' ? false : loadDetailPage(token.tokenOwner))}
        >
          <h2 class="text-2xl truncate sm:text-3xl ">{displayName}</h2>
        </div>
      </div>

      <div class="flex flex-col flex-1 justify-items-end">
        <div class="self-end text-2xl text-primary sm:text-3xl">
          <span>
            {Number.parseFloat(Web3.utils.fromWei(token.balance ? token.balance : '0', 'ether')).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  @media (max-width: 496px) {
    .transactionCardName {
      max-width: 200px;
    }
  }
</style>
