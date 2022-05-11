<script lang="ts">
import Icons from "../../../shared/molecules/Icons.svelte";
import Item from "../../../shared/molecules/Select/Item.svelte";

export let cartContents;
export let editable: boolean = true;

$: console.log("Content:", $cartContents);
$: groupedItems = $cartContents ? orderItems($cartContents) : {};

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

function orderItems(items) {
  const orderedCart = {};
  items.forEach((item) => {
    orderedCart[item.id] = {
      item: item,
      qty: orderedCart[item.id] ? orderedCart[item.id].qty + 1 : 1,
    };
  });

  return Object.entries(orderedCart).map(([id, item]) => ({ id, item }));
}
</script>

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
