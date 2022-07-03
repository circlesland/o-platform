<script lang="ts">
import { onMount } from "svelte";
import { me } from "../../../shared/stores/me";
import { displayCirclesAmount } from "src/shared/functions/displayCirclesAmount";
import { AssetBalance } from "../../../shared/api/data/types";
import { assetBalances } from "../../../shared/stores/assetsBalances";

 
import Card from "../../../shared/atoms/Card.svelte";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";

import Label from "../../../shared/atoms/Label.svelte";
 
import Card from "../../../shared/atoms/Card.svelte";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";

let loading = true;
let balances: AssetBalance[] = [];

onMount(async () => {
  balances = $assetBalances.crcBalances;
  loading = false;
});
</script>

<div class="p-5">
  <div class="w-full mb-4 text-center">
    <h1 class="uppercase font-heading"><Label key="dapps.o-banking.pages.crcDetail.individualCircles" /></h1>
  </div>
  {#if loading}
    <section class="flex items-center justify-center mb-2 ">
      <Card>
        <div class="flex flex-col items-start">
          <div><Label key="dapps.o-banking.pages.crcDetail.loadingTokens"  /></div>
        </div>
      </Card>
    </section>
  {:else}
    {#each balances as token}
      {#if token && token.token_balance > 0}
        <div>
          <ItemCard
            params="{{
              edgeless: false,
              imageProfile: token.token_owner_profile
                ? token.token_owner_profile
                : {
                    circlesAddress: token.token_owner_address,
                  },
              title: token.token_owner_profile.displayName,
              subTitle: token.token_owner_profile
                ? token.token_owner_address
                : '',

              shadowSmall: true,
              noLink: true,
              mobileTextCutoff: 18,
              endTextBig: displayCirclesAmount(
                token.token_balance ? token.token_balance : '0',
                null,
                true,
                ($me && $me.displayTimeCircles !== undefined
                  ? $me.displayTimeCircles
                  : true) ||
                  ($me && $me.displayTimeCircles !== undefined
                    ? $me.displayTimeCircles
                    : true) === undefined
              ),
            }}" />
        </div>
      {/if}
    {/each}
  {/if}
</div>
