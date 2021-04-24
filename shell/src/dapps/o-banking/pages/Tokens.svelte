<script lang="ts">
  import TokensHeader from "../atoms/TokensHeader.svelte";
  import { mySafe } from "../stores/safe";
  import { BN } from "ethereumjs-util";
  import { Token } from "../data/circles/queries";
  import TokenCard from "../atoms/TokenCard.svelte";

  let tokens: Token[] = [];

  function getTokens() {
    const allTokens: Token[] = Object.values($mySafe.acceptedTokens.tokens);
    tokens = allTokens.filter(
      (token) => !new BN(token.balance).eq(new BN("0"))
    );
  }

  $: {
    if ($mySafe.acceptedTokens) {
      getTokens();
    }
  }
</script>

<TokensHeader />

<div class="mx-4 -mt-6">
  {#if tokens.length === 0}
    <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
      <div class="flex items-center bg-white shadow p-4 w-full space-x-2 ">
        <div class="flex flex-col items-start">
          <div>Loading Tokens...</div>
        </div>
      </div>
    </section>
  {:else}
    {#each [$mySafe.token].concat(tokens) as token(token._id)}
      <TokenCard {token} />
    {/each}
  {/if}
</div>
