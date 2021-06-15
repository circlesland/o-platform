<script lang="ts">
  import TopNav from "src/shared/atoms/TopNav.svelte";
  import Web3 from "web3";

  export let amount;
  export let classes: String;

</script>

<TopNav showBackArrow={true} />

<div
  class="flex flex-row items-stretch w-full text-white bg-cover h-60 justify-items-stretch bg-primarydark"
  style="background-image: url(/images/common/nice-bg.jpg);"
>
  <div class="self-center flex-grow h-24 -mt-6 text-center justify-self-center">
    {#if classes == "transactionpositive"}
      <span class="block ">Received</span>
    {:else if classes == "transactionnegative"}
      <span class="block ">Sent</span>
    {:else}
      <span class="block text-base">Transfer</span>
    {/if}
    <span class="inline-block ml-10 text-6xl font-circles ">
      {#if classes == "transactionpositive"}
        {Number.parseFloat(
          Web3.utils.fromWei(amount ? amount : "0", "ether")
        ).toFixed(2)}
      {:else if classes == "transactionnegative"}
        -{Number.parseFloat(
          Web3.utils.fromWei(amount ? amount : "0", "ether")
        ).toFixed(2)}
      {/if}

      <svg
        class="inline w-8 h-8 -mt-1 -ml-4"
        viewBox="0 0 229 255"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M118.5 237C150.437 237 179.424 224.366 200.734 203.822C209.904 197.627 215.933 187.136 215.933 175.236C215.933 156.198 200.499 140.764 181.461 140.764C170.572 140.764 160.863 145.812 154.545 153.695L154.457 153.627C145.313 163.112 132.476 169.012 118.261 169.012C90.4957 169.012 67.9879 146.504 67.9879 118.739C67.9879 90.9745 90.4957 68.4667 118.261 68.4667C132.339 68.4667 145.067 74.254 154.193 83.5795L154.29 83.5037C160.581 90.2293 169.535 94.4328 179.471 94.4328C198.51 94.4328 213.944 78.9988 213.944 59.9601C213.944 48.1884 208.043 37.7949 199.039 31.5755C177.899 11.9794 149.599 0 118.5 0C53.0543 0 0 53.0543 0 118.5C0 183.946 53.0543 237 118.5 237Z"
          fill="white"
        />
        <ellipse
          cx="118.979"
          cy="118.739"
          rx="26.5727"
          ry="26.3333"
          fill="white"
        />
      </svg></span
    >
    <span class="inline-block h-full pt-2 text-left align-middle" />
  </div>
</div>
