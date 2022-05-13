<script lang="ts">
import { onMount } from "svelte";

import { ApiClient } from "../../../shared/apiConnection";
import LoadingIndicator from "../../../shared/atoms/LoadingIndicator.svelte";
import Layout from "../../../shared/layouts/Layout.svelte";
import { purchase } from "../processes/purchase";
import Icons from "../../../shared/molecules/Icons.svelte";
import Item from "../../../shared/molecules/Select/Item.svelte";
import { _ } from "svelte-i18n";
import { TransitivePath } from "../../o-banking/processes/transferCircles";
import {
  DirectPathDocument,
  Profile,
  QueryDirectPathArgs,
  Shop,
  ShopDocument,
  ShopQueryVariables,
} from "../../../shared/api/data/types";
import { me } from "../../../shared/stores/me";
import { assetBalances } from "../../../shared/stores/assetsBalances";
import { BN } from "ethereumjs-util";
import { Currency } from "../../../shared/currency";
import { Liquidity } from "../functions/liquidity";
export let cartContents;
export let cartContentsByShop;

export let editable: boolean = true;
let shops: any = [];
let isLoading: Boolean = true;
let totals = {};
let checked: boolean = false;
let balance: number = 0;
let invoiceAmount: number = 0;
let shippingAddressId: number;
let initialized: boolean = false;

let insufficientFunds: boolean = false;
let insufficientTrust: { sellerProfile: Profile; maxFlow: string; invoiceAmount: string } | undefined = undefined;
// $: console.log("Content:", $cartContents);
// $: groupedItems = $cartContents ? orderItems($cartContents) : {};
$: {
  $cartContentsByShop
    .then((result) => {
      shops = result;
      console.log("RESUUU:", result);
    })
    .catch((err) => {});
}

onMount(async () => {});
function removeAllItems(id) {
  let filteredContent = [];
  for (let i = 0; i < $cartContents.length; i++) {
    if ($cartContents[i].id !== id) {
      filteredContent.push($cartContents[i]);
    }
  }
  $cartContents = filteredContent;
}
onMount(() => {
  const sub2 = assetBalances.subscribe(($assetBalances) => {
    if ($assetBalances.crcBalances.length > 0 && !initialized) {
      initialized = true;
    }
  });
  return () => {
    sub2();
  };
});
function checkout() {
  window.o.runProcess(purchase, {});
}
function removeOneItem(id) {
  let filteredContent = $cartContents;
  filteredContent.splice(
    filteredContent.findIndex(function (i) {
      return i.id === id;
    }),
    1
  );
  $cartContents = filteredContent;
}

function addOneItem(id) {
  let filteredContent = $cartContents;
  filteredContent.push(filteredContent.find((x) => x.id === id));
  $cartContents = filteredContent;
}

function calculateTotal(items, index) {
  let pricePerUnit = 0;
  items.forEach((e) => (pricePerUnit = pricePerUnit + parseFloat(e.item.item.pricePerUnit)));
  totals[index] = pricePerUnit;
  console.log("TOTOA", totals[index]);
  return totals[index];
}

async function refresh(displayShop) {
  insufficientFunds = <boolean>(
    Liquidity.instance().refresh(
      $assetBalances.crcBalances,
      displayShop.shop.owner.circlesAddress,
      displayShop.total,
      $me.circlesAddress
    )
  );
  console.log("DIESER WERT", insufficientFunds);
  return insufficientFunds;
}
</script>

{#if shops.length}
  {#each shops as displayShop, index}
    {console.log("SHOPPENS", shops)}
    {#if displayShop}
      <div class="flex flex-col w-full" class:mt-8="{index >= 1}">
        <header class=" rounded-xl headerImageContainer">
          <div class="relative rounded-xl image-wrapper">
            <img src="{displayShop.shop.smallBannerUrl}" alt="" class="w-full rounded-xl" />
            <div
              class="absolute right-0 py-2 pt-3 pl-4 pr-2 mt-2 text-3xl rounded-l-full font-heading top-2 bg-light-lightest">
              <span class="inline-block">{displayShop.shop.name}</span>
            </div>
          </div>
        </header>
      </div>

      {#each displayShop.items as { item }, index}
        <div class="flex items-center justify-between w-full pb-6 mb-6 border-b" class:mt-8="{index == 0}">
          <div class="flex items-center w-full">
            <img class="w-16 rounded-full mask mask-circle" src="{item.item.pictureUrl}" alt="{item.item.title}" />
            <div class="flex flex-col items-start w-full ml-2 space-y-2">
              <div class="flex flex-row justify-between w-full">
                <div class="md:text-md">{item.item.title}</div>
                <div
                  class="self-center cursor-pointer text-dark"
                  on:click="{() => removeAllItems(item.item.id)}"
                  class:hidden="{!editable}">
                  <Icons icon="trash" size="4" />
                </div>
              </div>
              <div class="flex items-center justify-end w-full">
                <div class="flex-grow text-sm text-left text-dark-lightest">
                  1 {item.item.unitTag ? item.item.unitTag.value : "item"}
                </div>
                <div class="flex pr-8">
                  <div
                    class="font-semibold cursor-pointer span"
                    on:click="{() => removeOneItem(item.item.id)}"
                    class:hidden="{!editable}">
                    -
                  </div>
                  <input
                    class="w-8 h-6 px-2 mx-2 text-sm text-center bg-gray-100 border rounded focus:outline-none"
                    type="text"
                    value="{item.qty}"
                    disabled="{!editable}" /><span
                    class="font-semibold cursor-pointer"
                    on:click="{() => addOneItem(item.item.id)}"
                    class:hidden="{!editable}">+</span>
                </div>
                <div class="items-center">
                  <span class="inline-block whitespace-nowrap"
                    >{item.item.pricePerUnit} <span class="font-enso"> €</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
      <div class="flex items-center justify-end">
        <span class="mr-2 text-sm font-medium text-gray-400">{$_("dapps.o-marketplace.pages.shoppingCart.total")}</span
        ><span class="text-lg font-bold"
          >{displayShop.total.toFixed(2)}
          <span class="font-enso">€</span></span>
      </div>
      {#if refresh(displayShop) == true}
        <button class="h-auto btn-block btn btn-disabled"
          >{$_("dapps.o-marketplace.pages.shoppingCart.checkOut")}
        </button>
      {:else if insufficientFunds}
        <div class="w-full text-center text-alert">
          Oops, it looks like your balance of {balance} € is not enough to cover this order.
          <br />
          Try to remove some items or have a friend send you some circles :)
        </div>
      {:else if insufficientTrust}
        <div class="w-full text-center text-alert">
          Oops, it looks like {insufficientTrust.sellerProfile.displayName}
          only accepts {insufficientTrust.maxFlow} € of your Circles.
          <br />
          Try to remove some items.
        </div>
      {:else}
        <button class="h-auto btn-block btn btn-primary" on:click="{() => checkout()}"
          >{$_("dapps.o-marketplace.pages.shoppingCart.checkOut")}</button>
      {/if}
    {/if}
  {/each}
{/if}
