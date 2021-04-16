<script lang="ts">
  import {onMount} from "svelte";
  import BankingDetailHeader from "../atoms/BankingDetailHeader.svelte";

  export let params: {
    symbol: string
  };
</script>
<BankingDetailHeader />
Token detail page for "{params.symbol}"