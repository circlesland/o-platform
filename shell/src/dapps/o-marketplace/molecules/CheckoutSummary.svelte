<script lang="ts">
import { onMount } from "svelte";
import { cartContents, totalPrice } from "../stores/shoppingCartStore";
import CartItems from "../molecules/CartItems.svelte";
import ProcessNavigation from "@o-platform/o-editors/src/ProcessNavigation.svelte";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { Profile, Organisation, Shop, ShopQueryVariables, ShopDocument } from "../../../shared/api/data/types";
import { Currency } from "../../../shared/currency";
import { _ } from "svelte-i18n";
import { ApiClient } from "../../../shared/apiConnection";
import ShopMetadata from "../../../shared/molecules/ShopMetadata.svelte";

export let context: any;
let profile: Profile | Organisation;
let metadataError: Boolean = false;
let placeholder: Boolean = true;
let metadata: any;
let shopId: any = null;

$: {
  context = context;
  console.log("CheckoutSummary.context:", context)
  profile = context.data.sellerProfile;
}

let shop: Shop;

onMount(async () => {
  console.log("ASLKAJSDLAKSJDLAKDSJ", $cartContents);
  if ($cartContents.length) {
    const result = await Promise.all(
      $cartContents
        .filter((o) => o.hasOwnProperty("shopId") == true)
        .map(async (o) => {
          return { shopId: o.shopId, item: o };
        })
    );
    if (result.length) {
      shopId = result[0].shopId;
      shop = await ApiClient.query<Shop, ShopQueryVariables>(ShopDocument, {
        id: parseInt(shopId.toString()),
      });

      if (shop.purchaseMetaDataKeys && context.data.metadata) {
        metadata = context.data.metadata;
      } else {
        metadata = undefined;
      }
    }
  }
});

let classes: string;

function submit() {
  if (shop.purchaseMetaDataKeys && metadataError) {
    return;
  }

  const answer = new Continue();

  context.data.metadata = metadata;
  answer.data = context.data;
  context.process.sendAnswer(answer);
}

function onkeydown(e: KeyboardEvent) {
  if (e.key == "Enter") {
    submit();
  }
}

</script>

{#if context.data && profile}
  <div class="flex flex-col items-center self-center w-full m-auto space-y-4 text-center justify-self-center">
    <div>
      {#if shop && shop.purchaseMetaDataKeys}
        <ShopMetadata jsonSchema={shop.purchaseMetaDataKeys} bind:value={metadata} bind:error={metadataError}/>
      {/if}
    </div>

    <!-- <UserImage profile="{profile}" size="{36}" gradientRing="{true}" />

    <div>
      <span class="mt-4 text-xl">
        {$_("dapps.o-marketplace.molecules.checkoutSummary.to")} {displayableName(profile.firstName, profile.lastName)}
      </span>
      <div class="mt-2 text-dark-lightest">
        Reifenstuelstrasse. 6, 80469 München
        <br />
        <span class="text-sm"
          >Shop hours: Mo - Fr&nbsp;&nbsp;&nbsp;14:00 - 20:00</span>
      </div>
    </div> -->
    <!--
    {#if context.data && context.data.transitivePath}
      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">
          {$_("dapps.o-marketplace.molecules.checkoutSummary.paymentPath")}
        </div>
        <div class="flex items-center w-full">
          <CirclesTransferGraph
            transfers="{context.data.transitivePath.transfers}"
            height="70px"
            onWhiteBackground="{true}" />
        </div>
      </div>
    {/if} -->

    <div class="flex flex-col w-full mt-6 space-y-1">
      <div class="flex flex-col items-center w-full">
        <CartItems cartContents="{cartContents}" editable="{false}" />
      </div>
      <div class="flex items-center justify-end w-full -mt-2">
        <span class="mr-2 text-sm font-medium text-gray-400">
          {$_("dapps.o-marketplace.molecules.checkoutSummary.total")}
        </span>
        <span class="w-20 text-lg font-bold text-right">
          {$totalPrice.toFixed(2)} €
        </span>
      </div>
      <div class="flex items-center justify-end w-full -mt-2">
        <span class="mr-2 text-sm font-medium text-gray-400">
          {$_("dapps.o-marketplace.molecules.checkoutSummary.tax")}
        </span>
        <span class="w-20 text-lg text-right font-primary text-dark-lightest">
          {((19 / 100) * $totalPrice).toFixed(2)} €
        </span>
      </div>
      <div class="flex items-center justify-end w-full -mt-2">
        <span class="mr-2 text-sm font-medium text-gray-400">Time Circles:</span>
        <span class="w-20 text-lg text-right font-primary text-dark-lightest"
          >{$totalPrice * 10} {Currency.currencySymbol["TIME_CRC"]}</span>
      </div>

      <!-- <div class="flex items-center justify-end w-full -mt-2">
        <span class="mr-2 text-sm font-medium text-gray-400">
          Total in Time:
        </span>

        <span class="w-20 text-sm font-bold text-right">
          {($totalPrice * 10).toFixed(2)} ⦿
        </span>
      </div> -->
    </div>

    <!-- <div class="flex flex-col w-full space-y-2 text-left">
      <div class="pb-1 bg-gradient-to-r from-gradient1 to-gradient2">
        <h1 class="p-2 text-white uppercase bg-dark-dark ">
          {$_(
            "dapps.o-marketplace.molecules.checkoutSummary.storePickupLocation"
          )}
        </h1>
      </div>
      <div>
        {@html $_("dapps.o-marketplace.molecules.checkoutSummary.storeAddress")}
        <br />
        <span class="text-sm font-thin">
          {@html $_("dapps.o-marketplace.molecules.checkoutSummary.storeHours")}
        </span>
      </div>
    </div> -->
  </div>
  <ProcessNavigation on:buttonClick="{submit}" context="{context}" noSticky="{true}" />
{/if}
