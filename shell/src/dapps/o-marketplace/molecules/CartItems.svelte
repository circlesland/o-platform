<script lang="ts">
import { onMount } from "svelte";
import { Shop, ShopDocument, ShopQueryVariables } from "../../../shared/api/data/types";
import { ApiClient } from "../../../shared/apiConnection";

import Icons from "../../../shared/molecules/Icons.svelte";
import Item from "../../../shared/molecules/Select/Item.svelte";

export let cartContents;
export let editable: boolean = true;
let shops: any = [];
$: console.log("Content:", $cartContents);
$: groupedItems = $cartContents ? orderItems($cartContents) : {};
// $: shops = groupedItems ? groupByShop(groupedItems) : [];

onMount(async () => {
  groupByShop();
});
function removeAllItems(id) {
  let filteredContent = [];
  for (let i = 0; i < $cartContents.length; i++) {
    if ($cartContents[i].id !== id) {
      filteredContent.push($cartContents[i]);
    }
  }
  $cartContents = filteredContent;
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

async function groupByShop() {
  if ($cartContents) {
    const shopIds = $cartContents.groupBy((o) => o.shopId);

    Object.keys(shopIds) // get the keys as array
      .forEach(async function (key) {
        console.log("KEY", key);

        const myShop = await ApiClient.query<Shop[], ShopQueryVariables>(ShopDocument, {
          id: parseInt(key.toString()),
        });
        shops[key] = { shop: myShop, items: orderItems(shopIds[key]) };
      });

    console.log("SHOPS", shops);
  }
}

function orderItems(items) {
  const orderedCart = {};
  items.forEach((item) => {
    orderedCart[item.id] = {
      shopId: item.shopId,
      item: item,
      qty: orderedCart[item.id] ? orderedCart[item.id].qty + 1 : 1,
    };
  });

  return Object.entries(orderedCart).map(([id, item]) => ({ id, item }));
}
</script>

{#if groupedItems}
  <!-- {#each shops as { sshop }} -->
  <!-- <div class="">{shop.name}</div> -->
  <!-- {console.log("SHOP", sshop)} -->

  {#each groupedItems as { item }}
    <div class="flex items-center justify-between w-full pb-6 mb-6 border-b">
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
  <!-- {/each} -->
{/if}
