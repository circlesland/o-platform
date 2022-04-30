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

export let context: any;
let profile: Profile | Organisation;
let tableNumber: number;
let tableError: Boolean = false;
let placeholder: Boolean = true;
let metadata: any;
let shopId: any = null;
function range(from:number, to:number) {
  const result:number[] = [];
  for(let i = from; i <= to; i++) {
    result.push(i);
  }
  return result;
}


// Bar:
//         1
// Außen:
//         100-107
//         201-204
//         300-310
//         400-411
//
// Innen:
//         501-503
//         601-608
//         701-705
const tables = {
  bar: 1,
  outside: range(100, 107)
          .concat(range(201, 204))
          .concat(range(300, 310))
          .concat(range(400, 411)),
  inside: range(501, 503)
          .concat(range(601, 608))
          .concat(range(701, 705))
};


$: {
  context = context;
  console.log("CheckoutSummary.context:", context)
  profile = context.data.sellerProfile;
}

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
      let shop: Shop = await ApiClient.query<Shop, ShopQueryVariables>(ShopDocument, {
        id: parseInt(shopId.toString()),
      });

      if (shop.purchaseMetaDataKeys && context.data.metadata) {
        metadata = context.data.metadata;
        tableNumber = context.data.metadata.Table;
      } else if (shop.purchaseMetaDataKeys) {
        metadata = JSON.parse(shop.purchaseMetaDataKeys);
      } else {
        metadata = undefined;
      }
    }
    // let hasMetadata = result
    //   .filter((o) => o.hasStoreId == true)
    //   .map((o) => {
    //     return o.hasStoreId == true;
    //   });
    // if (hasMetadata.includes(true)) {
    // }
    // $cartContents.find(function (entry, index) {
    //   if (entry.hasOwnProperty("shopId")) {
    //     shopId = $cartContents[index].shopId;
    //     console.log("SHOP", shopId);
    //   }
    // });

    // if (shopId !== null) {
    //   let shop: Shop = await ApiClient.query<Shop, ShopQueryVariables>(ShopDocument, {
    //     id: parseInt(shopId.toString()),
    //   });

    //   if (shop.purchaseMetaDataKeys) {
    //     metadata = JSON.parse(shop.purchaseMetaDataKeys);
    //   }
    // }
  }
});

let classes: string;

function submit() {
  if (!tableNumber) {
    tableError = true;
    return;
  }
  const answer = new Continue();

  context.data.metadata = { Table: tableNumber };
  answer.data = context.data;
  context.process.sendAnswer(answer);
}

function onkeydown(e: KeyboardEvent) {
  if (e.key == "Enter") {
    submit();
  }
}
function resetError() {
  tableError = false;
}
</script>

{#if context.data && profile}
  <div class="flex flex-col items-center self-center w-full m-auto space-y-4 text-center justify-self-center">
    <div>
      {#if metadata}
        <span class="inline-block text-2xl {classes}" class:text-alert-dark="{tableError}"
          >Please select your Table Number</span>
        <div class="mt-2">
          <select
            class="w-full max-w-xs select select-lg select-bordered"
            bind:value="{tableNumber}"
            on:change="{() => resetError()}"
            class:select-error="{tableError}">
            {#if placeholder}
              <option value="" disabled selected>Select your table number</option>
            {/if}

            {#if tables.bar}
              <option value={tables.bar}>&nbsp;&nbsp;&nbsp;Bar</option>
            {/if}

            {#if tables.outside}
              <option disabled>Outdoor:</option>
              {#each tables.outside as table, i}
                <option value="{table}">&nbsp;&nbsp;&nbsp;{table}</option>
              {/each}
            {/if}

            {#if tables.inside}
              <option disabled>Indoor:</option>
              {#each tables.inside as table, i}
                <option value="{table}">&nbsp;&nbsp;&nbsp;{table}</option>
              {/each}
            {/if}
          </select>
        </div>
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
