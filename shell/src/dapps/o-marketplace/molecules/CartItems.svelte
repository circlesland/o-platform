<script lang="ts">
  import {purchase} from "../processes/purchase";
  import Icons from "../../../shared/molecules/Icons.svelte";
  import {_} from "svelte-i18n";
  import {Shop} from "../../../shared/api/data/types";
  import {me} from "../../../shared/stores/me";
  import {Liquidity, PayableStatusBySeller, PaymentAmountsBySeller} from "../functions/liquidity";
  import {onMount} from "svelte";
  import {assetBalances} from "../../../shared/stores/assetsBalances";
  import {Currency} from "../../../shared/currency";
  import {BN} from "ethereumjs-util";
  import {cartContents, cartContentsByShop} from "../stores/shoppingCartStore";
  import {ShoppingCartItem} from "../types/ShoppingCartItem";

  export let editable: boolean = true;
  export let shop: any;

  let payableStatusBySeller: PayableStatusBySeller;

  let isLoading: Boolean = true;
  let checked: boolean = false;
  let balance: number = 0;

  let insufficientFunds: boolean = false;

  function getTotalCrcBalance() {
    const totalCrcBalance = $assetBalances.crcBalances
      .reduce((p, c) => p.add(new BN(c.token_balance)), new BN("0"))
      .toString();
    const balance = Currency.instance().displayAmount(totalCrcBalance, null, "EURS", null);

    return parseFloat(balance.toString());
  }

  function hasSufficientFunds(paymentAmountBySeller: PaymentAmountsBySeller) {
    const totalCrcBalance = getTotalCrcBalance();
    const totalPaymentAmount = Object.values(paymentAmountBySeller).reduce((p, c) => p + c, 0);
    return parseFloat(totalPaymentAmount.toFixed(8)) <= parseFloat(totalCrcBalance.toFixed(8));
  }

  // $: shops = shops;

  let _shops: { total: number, shop: Shop & { owner: { id, name, avatarUrl, circlesAddress } }[], items: ShoppingCartItem[] }[]

  async function refresh() {
    isLoading = true;

    _shops = await $cartContentsByShop;

    const contentsByShop: {
      [shopId: number]: {
        items: any[];
        shop: Shop;
      };
    } = _shops.toLookup(
      (o) => o.shop.owner.circlesAddress,
      (o) => {
        return {
          items: o.items,
          shop: o.shop,
        };
      }
    );

    const amountsBySeller = Object.entries(contentsByShop).reduce((p, c) => {
      p[c[0]] = c[1].items.reduce((q, d) => q + d.total, 0);
      return p;
    }, {});

    payableStatusBySeller = await Liquidity.getPayableStatusBySeller($me.circlesAddress, amountsBySeller);

    insufficientFunds = !hasSufficientFunds(amountsBySeller);

    isLoading = false;
  }

  onMount(async () => {
    if (!cartContentsByShop) {
      return;
    }

    refresh();
  });

  async function checkout(shopIndex) {
    const cartContents = await $cartContentsByShop;
    console.log("ITEIET", cartContents[shopIndex].items);

    window.o.runProcess(purchase, {
      items: cartContents[shopIndex].items,
      shop: cartContents[shopIndex].shop,
      sellerProfile: cartContents[shopIndex].shop.owner,
      availableDeliveryMethods: [{
        id: 1,
        name: "Pickup at store"
      }, {
        id: 2,
        name: "Delivery"
      }]
    });
  }

  function addOneItem(id) {
    let filteredContent = $cartContents;
    filteredContent.push(filteredContent.find((x) => x.id === id));
    $cartContents = filteredContent;
    shops = shops;
    refresh();
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
    shops = shops;
    refresh();
  }

  function removeAllItems(id) {
    let filteredContent = [];
    for (let i = 0; i < $cartContents.length; i++) {
      if ($cartContents[i].id !== id) {
        filteredContent.push($cartContents[i]);
      }
    }
    $cartContents = filteredContent;
    shops = shops;
    refresh();
  }

  function handleClickOutside(event) {
    event.preventDefault();
    window.o.publishEvent({
      type: "shell.requestCloseModal",
    });
  }
</script>

{#if $cartContents && $cartContents.length > 0}
    {#each shops as displayShop, shopIndex}
        {#if displayShop}
            <div class="flex flex-col w-full" class:mt-8="{shopIndex >= 1}">
                <header class=" rounded-xl headerImageContainer">
                    <div class="relative rounded-xl image-wrapper">
                        <img src="{displayShop.shop.smallBannerUrl}" alt="" class="w-full rounded-xl"/>
                        <div
                                class="absolute right-0 px-2 mt-2 text-lg rounded-l-full sm:text-xl lg:pb-2 lg:pt-3 lg:pl-4 lg:pr-2 lg:text-3xl font-heading top-2 bg-light-lightest">
                            <span class="inline-block">{displayShop.shop.name}</span>
                        </div>
                    </div>
                </header>
            </div>

            {#each displayShop.items as item, index}
                <div class="flex items-center justify-between w-full pb-6 mb-6 border-b" class:mt-8="{index == 0}">
                    <div class="flex items-center w-full">
                        <img class="w-16 rounded-full mask mask-circle" src="{item.pictureUrl}" alt="{item.title}"/>
                        <div class="flex flex-col items-start w-full ml-2 space-y-2">
                            <div class="flex flex-row justify-between w-full">
                                <div class="md:text-md">{item.title}</div>
                                <div
                                        class="self-center cursor-pointer text-dark"
                                        on:click="{() => removeAllItems(item.offerId)}"
                                        class:hidden="{!editable}">
                                    <Icons icon="trash" size="4"/>
                                </div>
                            </div>
                            <div class="flex items-center justify-end w-full">
                                <div class="flex-grow text-sm text-left text-dark-lightest">
                                    1 {item.unitTag ? item.unitTag.value : "item"}
                                </div>
                                <div class="flex pr-8">
                                    <div
                                            class="font-semibold cursor-pointer span"
                                            on:click="{() => removeOneItem(item.offerId)}"
                                            class:hidden="{!editable}">
                                        -
                                    </div>
                                    <div
                                            class="w-8 h-6 mx-2 text-sm text-center bg-gray-100 border rounded focus:outline-none "
                                            type="text"
                                            value="{item.qty}">
                                        {item.qty}
                                    </div>
                                    <span
                                            class="font-semibold cursor-pointer"
                                            on:click="{() => addOneItem(item.offerId, shopIndex)}"
                                            class:hidden="{!editable}">+</span>
                                </div>
                                <div class="items-center">
                  <span class="inline-block whitespace-nowrap"
                  >{item.pricePerUnit} <span class="font-enso"> EUR</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
            {#if editable}
                <div class="flex items-center justify-end">
          <span class="mr-2 text-sm font-medium text-gray-400"
          >{$_("dapps.o-marketplace.pages.shoppingCart.total")}</span
          ><span class="text-lg font-bold"
                >{displayShop.total.toFixed(2)}
                    <span class="font-enso">EUR</span></span>
                </div>

                {#if isLoading}
                    <button class="h-auto btn-block btn btn-disabled"
                    >{$_("dapps.o-marketplace.pages.shoppingCart.checkOut")}
                    </button>
                {:else if payableStatusBySeller[displayShop.shop.owner.circlesAddress].payable}
                    <button class="h-auto btn-block btn btn-primary" on:click="{() => checkout(shopIndex)}"
                    >{$_("dapps.o-marketplace.pages.shoppingCart.checkOut")}</button>
                {:else if payableStatusBySeller[displayShop.shop.owner.circlesAddress].payable === false}
                    <div class="w-full text-center text-alert">
                        {@html $_(payableStatusBySeller[displayShop.shop.owner.circlesAddress].reason)}
                    </div>
                {/if}
            {/if}
        {/if}
    {/each}
{:else}
    <p class="mt-6 text-center">
        {$_("dapps.o-marketplace.pages.shoppingCart.yourCartIsEmpty")}
    </p>
    <div class="w-full mt-6">
        <button class="h-auto btn-block btn btn-light" on:click="{(event) => handleClickOutside(event)}"
        >{$_("dapps.o-marketplace.pages.shoppingCart.continueShopping")}</button>
    </div>
{/if}
