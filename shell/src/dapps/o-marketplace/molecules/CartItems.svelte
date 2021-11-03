<script lang="ts">
import Icons from "../../../shared/molecules/Icons.svelte";
import Item from "../../../shared/molecules/Select/Item.svelte";

export let cartContents;

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
  .flex.justify-between.items-center.mb-6.pb-6.border-b
    .flex.items-center
      img.rounded-full.w-20.mask.mask-circle(src='{item.item.pictureUrl}' alt='{item.item.title}')
      .flex.flex-col.ml-2
        span(class="md:text-md") {item.item.title}

    .flex.justify-center.items-center
      .pr-8.flex  
        .span.font-semibold.cursor-pointer(on:click!="{() =>  removeOneItem(item.item.id)}") -
        
        input.bg-gray-100.border.h-6.w-8.rounded.text-sm.text-center.px-2.mx-2(type='text' value='{item.qty}', class="focus:outline-none")
        
        span.font-semibold.cursor-pointer(on:click!="{() =>  addOneItem(item.item.id)}") +
      
      .pr-8.items-center
        span.whitespace-nowrap.text-sm {item.item.pricePerUnit} ⦿
      div.text-light-dark.cursor-pointer(on:click!="{() =>  removeAllItems(item.item.id)}")
        Icons(icon="smallx" size="4")

</template>
