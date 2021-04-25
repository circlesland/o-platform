<script lang="ts">
  import Time from "svelte-time";
  import { push } from "svelte-spa-router";
  import Web3 from "web3";
  import { Token } from "../data/circles/queries";

  export let token: Token;

  let pictureUrl: string;
  let displayName: String;
  let classes: String;

  $: {
    displayName = token.ownerProfile
      ? token.ownerProfile.displayName
      : token.tokenOwner;

    pictureUrl = token.ownerProfile ? token.ownerProfile.avatarUrl : undefined;
  }

  function loadDetailPage(path) {
    console.log(path);
    push("#/banking/tokens/" + path);
  }
</script>

<section
  on:click|once={() => loadDetailPage(token._id)}
  class="flex items-center justify-center mb-2 text-circlesdarkblue"
>
  <div
    class="flex items-center bg-white shadow p-4 w-full space-x-2 sm:space-x-6"
  >
    <div class="mr-2 text-center">
      <div class="avatar">
        <div class="rounded-full w-12 h-12 sm:w-12 sm:h-12 m-auto">
          <img
            src={pictureUrl ? pictureUrl : "/images/common/circles.png"}
            alt="username"
          />
        </div>
      </div>
    </div>

    <div class="text-left">
      <div class="max-w-full transactionCardName">
        <h2 class="text-2xl sm:text-3xl font-bold truncate ">
          {displayName.length > 22
            ? displayName.substring(0, 22) + ".."
            : displayName}
        </h2>
      </div>
    </div>

    <div class="flex flex-1 flex-col justify-items-end">
      <div class="self-end text-{classes} text-2xl sm:text-3xl">
        <span>
          {Number.parseFloat(
            Web3.utils.fromWei(token.balance ? token.balance : "0", "ether")
          ).toFixed(2)}
        </span>
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
