<script lang="ts">
import { cartContents, totalPrice } from "../stores/shoppingCartStore";
import CartItems from "../molecules/CartItems.svelte";
import { purchase } from "../processes/purchase";
import { _ } from "svelte-i18n";
import { assetBalances } from "../../../shared/stores/assetsBalances";
import { BN } from "ethereumjs-util";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { Currency } from "../../../shared/currency";
import { ApiClient } from "../../../shared/apiConnection";
import { TransitivePath } from "../../o-banking/processes/transferCircles";
import { DirectPathDocument, Profile, QueryDirectPathArgs } from "../../../shared/api/data/types";
import { me } from "../../../shared/stores/me";
import { onMount } from "svelte";

function checkout() {
  window.o.runProcess(purchase, {});
}

function handleClickOutside(event) {
  event.preventDefault();
  window.o.publishEvent({
    type: "shell.requestCloseModal",
  });
}

let checked: boolean = false;
let balance: number = 0;
let invoiceAmount: number = 0;
let shippingAddressId: number;

let deliveryType: number = 2;

let insufficientFunds: boolean = false;
let insufficientTrust: { sellerProfile: Profile; maxFlow: string; invoiceAmount: string } | undefined = undefined;

async function checkMaxTransferableAmount(sumsBySeller: { [sellerAddress: string]: number }) {
  const maxTransferableAmounts: { sellerAddress: string; maxFlow: BN }[] = await Promise.all(
    Object.keys(sumsBySeller).map(async (sellerAddress) => {
      const flow = await ApiClient.query<TransitivePath, QueryDirectPathArgs>(DirectPathDocument, {
        from: $me.circlesAddress,
        to: sellerAddress,
        amount: RpcGateway.get()
          .utils.toWei(
            (new Currency().convertTimeCirclesToCircles(sumsBySeller[sellerAddress], null) * 10).toString(),
            "ether"
          )
          .toString(),
      });

      return {
        sellerAddress: sellerAddress,
        maxFlow: new Currency().displayAmount(flow.flow == "" ? "0" : flow.flow, null, "EURS"),
      };
    })
  );

  return maxTransferableAmounts;
}

async function checkFlow() {
  const itemsBySeller = $cartContents.groupBy((o) => o.createdByProfile.circlesAddress);
  const sumsBySeller: { [sellerAddress: string]: number } = {};
  Object.keys(itemsBySeller).map((sellerAddress) => {
    const items = itemsBySeller[sellerAddress];
    sumsBySeller[sellerAddress] = items.reduce((p, c) => p + parseFloat(c.pricePerUnit), 0).toFixed(2);
  });

  const sellerProfiles = $cartContents.toLookup(
    (o) => o.createdByProfile.circlesAddress,
    (o) => o.createdByProfile
  );
  checkMaxTransferableAmount(sumsBySeller).then((maxAmountBySeller) => {
    const payableBySeller = maxAmountBySeller.map((maxAmount) => {
      return {
        sellerProfile: sellerProfiles[maxAmount.sellerAddress],
        payable: parseFloat(maxAmount.maxFlow.toString()) >= sumsBySeller[maxAmount.sellerAddress],
        maxAmount: maxAmount.maxFlow,
      };
    });
    const notPayable = payableBySeller.find((o) => !o.payable);
    if (notPayable && notPayable?.sellerProfile?.circlesAddress) {
      insufficientTrust = <{ sellerProfile: Profile; maxFlow: string; invoiceAmount: string }>{
        invoiceAmount: sumsBySeller[notPayable.sellerProfile.circlesAddress],
        maxFlow: notPayable.maxAmount,
        sellerProfile: notPayable.sellerProfile,
      };
    } else {
      insufficientTrust = undefined;
    }
    // console.log(`Max transferable amount per seller:`, o);
    checked = true;
  });
}

function refresh() {
  if ($assetBalances.crcBalances.length > 0 && $totalPrice && $totalPrice > 0) {
    const totalCrcBalance = $assetBalances.crcBalances
      .reduce((p, c) => p.add(new BN(c.token_balance)), new BN("0"))
      .toString();

    balance = Currency.instance().displayAmount(totalCrcBalance, null, "EURS", null);
    insufficientFunds = balance - parseFloat($totalPrice.toFixed(2)) <= 0;
    checked = insufficientFunds;

    if (!insufficientFunds) {
      checkFlow();
      console.log("Bal:", balance);
      console.log("Diff:", balance - parseFloat($totalPrice.toFixed(2)));
    } else {
      insufficientTrust = undefined;
    }
  }
}

let initialized = false;

onMount(() => {
  const sub1 = totalPrice.subscribe(($totalPrice) => {
    if (!initialized) return;
    refresh();
  });
  const sub2 = assetBalances.subscribe(($assetBalances) => {
    if ($assetBalances.crcBalances.length > 0 && !initialized) {
      refresh();
      initialized = true;
    }
  });
  return () => {
    sub1();
    sub2();
  };
});
</script>

<div class="p-5">
  <header>
    <div class="w-full text-center">
      <h1 class="text-3xl uppercase font-heading">
        {$_("dapps.o-marketplace.pages.shoppingCart.cart")}
      </h1>
    </div>
  </header>

  {#if $cartContents && $cartContents.length > 0}
    {#if deliveryType == 1}
      <div class="form-control">
        <label class="cursor-pointer label">
          <select class="select select-bordered" bind:value="{shippingAddressId}">
            <option value="LIST">Thorsten Schau, Ehrengutstrasse 9</option>
            <option value="TILES">Thorsten Rock c/o Steffi Graf, O-strasse 9, Berlin</option>
          </select>
          <div>
            <button
              class="mt-2 btn btn-sm btn-primary"
              on:click="{() => {
                window.o.runProcess(upsertShippingAddress, {});
              }}">Add Address</button>
          </div>
        </label>
      </div>
    {/if}
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
                    {#if !checked}
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
      <button class="h-auto btn-block btn btn-light" on:click="{(event) => handleClickOutside(event)}"
        >{$_("dapps.o-marketplace.pages.shoppingCart.continueShopping")}</button>
    </div>
  {/if}
</div>
