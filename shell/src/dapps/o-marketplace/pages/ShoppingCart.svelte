<script lang="ts">
import { cartContents, totalPrice } from "../stores/shoppingCartStore";
import CartItems from "../molecules/CartItems.svelte";
import { push } from "svelte-spa-router";
import { purchase } from "../processes/purchase";

function checkout() {
  // console.log("edit: dirtyFlags:", dirtyFlags);
  window.o.runProcess(purchase, cartContents);
}
</script>

<template lang="pug">
div.p-5
  header
    div.w-full.text-center
      h1.text-3xl.uppercase.font-heading Cart
  +if('$cartContents && $cartContents.length > 0')  
    div
      .w-full
        div(class="md:flex")
          .w-full
            div.pt-6(class="md:grid")
                
                CartItems(cartContents="{cartContents}")
                
                .flex.justify-end.items-center
                  span.text-sm.font-medium.text-gray-400.mr-2 Total:
                  span.text-lg.font-bold {$totalPrice.toFixed(2)} ⦿
                  
                .flex.justify-center.items-center.mt-6
                
                  .flex.flex-row.w-full.space-x-4
                    div
                      button.h-auto.btn-block.btn.btn-light(on:click!="{() =>  history.back()}") Close Cart
                    .flex-grow
                      button.h-auto.btn-block.btn.btn-primary(on:click!="{() =>  checkout()}") Check Out
    +else
      p.text-center.mt-6 Your cart is empty!
      .w-full.mt-6
          div
          button.h-auto.btn-block.btn.btn-light(on:click!="{() =>  history.back()}") Continue Shopping
</template>
