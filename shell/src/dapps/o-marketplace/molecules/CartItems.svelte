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

<template lang="pug">
+each(`groupedItems as {item}`)
  div.flex.justify-between.items-center.mb-6.pb-6.border-b.w-full
    div.flex.items-center.w-full
      img.rounded-full.w-20.mask.mask-circle(src='{item.item.pictureUrl}' alt='{item.item.title}')
      div.flex.flex-col.ml-2.space-y-2.w-full.items-start
        div.flex.flex-row.justify-between.w-full
          div(class="md:text-md") {item.item.title}

          div.text-dark.cursor-pointer.self-center(on:click!="{() =>  removeAllItems(item.item.id)}" class:hidden="{!editable}")
            Icons(icon="smallx" size="2")
            
        div.flex.justify-end.items-center.w-full
          div.flex-grow.text-sm.text-dark-lightest.text-left 1 {item.item.unitTag ? item.item.unitTag.value : "item"}
            
          div.pr-8.flex
            div.span.font-semibold.cursor-pointer(on:click!="{() =>  removeOneItem(item.item.id)}" class:hidden="{!editable}") -
            
            input.bg-gray-100.border.h-6.w-8.rounded.text-sm.text-center.px-2.mx-2(type="text" value="{item.qty}" disabled="{!editable}" class="focus:outline-none")
            
            span.font-semibold.cursor-pointer(on:click!="{() =>  addOneItem(item.item.id)}" class:hidden="{!editable}") +
          
          div.items-center
            span.whitespace-nowrap {item.item.pricePerUnit} ⦿


</template>
