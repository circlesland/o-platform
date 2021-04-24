<script lang="ts">
  import TokensHeader from "../atoms/TokensHeader.svelte";
  import {push} from "svelte-spa-router";
  import {mySafe} from "../stores/safe";
  import { BN } from "ethereumjs-util";
  import {Token} from "../data/circles/queries";

  let tokens:Token[] = [];

  function getTokens() {
    const allTokens:Token[] = Object.entries($mySafe.acceptedTokens.tokens);
    tokens = allTokens.filter(token => !(new BN(token[1].balance).eq(new BN("0"))));
  }

  $: {
    if ($mySafe.acceptedTokens) {
      getTokens();
    }
  }

</script>

<TokensHeader/>

<div class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
  {#if tokens.length === 0}
    Loading tokens...
  {:else}
    {#each tokens as token}
      <pre>
        {JSON.stringify(token, null, 2)}
      </pre>
    {/each}
  {/if}
</div>

<div class="mx-4 -mt-6">
  <section
    on:click|once={() => push("#/banking/tokens/GNRL")}
    class="flex items-center justify-center mb-2 text-circlesdarkblue"
  >
    <div
      class="flex items-center bg-white shadow p-4 w-full space-x-2 sm:space-x-6"
    >
      <div class="mr-2 text-center">
        <div class="avatar">
          <div class="rounded-full w-12 h-12 sm:w-12 sm:h-12 m-auto">
            <img src="/images/common/circles.png" alt="username"/>
          </div>
        </div>
      </div>

      <div class="text-left">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold">Circles</h2>
        </div>
      </div>

      <div class="flex flex-1 flex-col justify-items-end">
        <div class="self-end text-2xl sm:text-3xl">
          <span>200.00</span>
        </div>
      </div>
    </div>
  </section>
  <section
    on:click|once={() => push("#/banking/tokens/GNRL")}
    class="flex items-center justify-center mb-2 text-circlesdarkblue"
  >
    <div
      class="flex items-center bg-white shadow p-4 w-full space-x-2 sm:space-x-6"
    >
      <div class="mr-2 text-center">
        <div class="avatar">
          <div class="rounded-full w-12 h-12 sm:w-12 sm:h-12 m-auto">
            <img
              src="https://gblobscdn.gitbook.com/spaces%2F-Lpi9AHj62wscNlQjI-l%2Favatar.png?alt=media"
              alt="username"
            />
          </div>
        </div>
      </div>

      <div class="text-left">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold">xDai</h2>
        </div>
      </div>

      <div class="flex flex-1 flex-col justify-items-end">
        <div class="self-end text-2xl sm:text-3xl">
          <span>1</span>
        </div>
      </div>
    </div>
  </section>
  <section
    on:click|once={() => push("#/banking/tokens/GNRL")}
    class="flex items-center justify-center mb-2 text-circlesdarkblue"
  >
    <div
      class="flex items-center bg-white shadow p-4 w-full space-x-2 sm:space-x-6"
    >
      <div class="mr-2 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <div class="text-left">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold">Invite Credits</h2>
        </div>
      </div>

      <div class="flex flex-1 flex-col justify-items-end">
        <div class="self-end text-2xl sm:text-3xl">
          <span>10</span>
        </div>
      </div>
    </div>
  </section>
</div>
