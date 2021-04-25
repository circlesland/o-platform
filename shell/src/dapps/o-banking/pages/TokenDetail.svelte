<script lang="ts">
  import {onMount} from "svelte";
  import BankingDetailHeader from "../atoms/BankingDetailHeader.svelte";
  import {Token, Transfer} from "../data/circles/types";
  import {mySafe} from "../stores/safe";

  export let params: {
    symbol: string
  };
  let token:Token;
  $: {
    token = Object.values($mySafe.acceptedTokens.tokens).find(o => o.tokenAddress == params.symbol)
  }
</script>
<BankingDetailHeader />
Token detail page for "{params.symbol}"
<pre>{JSON.stringify(token, null, 2)}</pre>