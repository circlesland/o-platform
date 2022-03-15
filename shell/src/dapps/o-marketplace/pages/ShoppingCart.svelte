<script lang="ts">
import { cartContents, totalPrice } from "../stores/shoppingCartStore";
import CartItems from "../molecules/CartItems.svelte";
import { push } from "svelte-spa-router";
import { purchase } from "../processes/purchase";
import { _ } from "svelte-i18n";
import {assetBalances} from "../../../shared/stores/assetsBalances";
import {BN} from "ethereumjs-util";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {convertCirclesToTimeCircles} from "../../../shared/functions/displayCirclesAmount";

function checkout() {
  window.o.runProcess(purchase, cartContents);
}

function handleClickOutside(event) {
  event.preventDefault();
  window.o.publishEvent({
    type: "shell.requestCloseModal",
  });
}

let balance = new BN("0");
$: {
  balance = (convertCirclesToTimeCircles(parseFloat(RpcGateway.get().utils.fromWei($assetBalances.crcBalances.reduce((p, c) => p.add(new BN(c.token_balance)), new BN("0")), "ether")), new Date().toJSON()) / 10).toFixed(2);
}

</script>

<div class="p-5">
  <header>
    <div class="w-full text-center">
      <h1 class="text-3xl uppercase font-heading">
        {$_("dapps.o-marketplace.pages.shoppingCart.cart")}
      </h1>
    </div>
    <div>Your balance: {balance}</div>
  </header>

  {#if $cartContents && $cartContents.length > 0}
    <div>
      <div class="w-full">
        <div class="md:flex">
          <div class="w-full">
            <div class="pt-6 md:grid">
              <CartItems cartContents="{cartContents}" />
              <div class="flex items-center justify-end">
                <span class="mr-2 text-sm font-medium text-gray-400"
                  >{$_("dapps.o-marketplace.pages.shoppingCart.total")}</span
                ><span class="text-lg font-bold"
                  >{$totalPrice.toFixed(2)}
                  <span class="font-enso">€</span></span>
              </div>
              <div class="flex items-center justify-center mt-6">
                <div class="flex flex-row w-full space-x-4">
                  <div class="flex-grow">
                    <button
                      class="h-auto btn-block btn btn-primary"
                      on:click="{() => checkout()}"
                      >{$_(
                        "dapps.o-marketplace.pages.shoppingCart.checkOut"
                      )}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <p class="mt-6 text-center">
      {$_("dapps.o-marketplace.pages.shoppingCart.yourCartIsEmpty")}
    </p>
    <div class="w-full mt-6">
      <button
        class="h-auto btn-block btn btn-light"
        on:click="{(event) => handleClickOutside(event)}"
        >{$_(
          "dapps.o-marketplace.pages.shoppingCart.continueShopping"
        )}</button>
    </div>
  {/if}
</div>
