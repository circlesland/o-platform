<script lang="ts">
import {
  AggregateType,
  CompleteSaleDocument,
  InvoiceDocument,
  Profile,
  QueryInvoiceArgs,
  Sale,
  Sales,
} from "../../../shared/api/data/types";
import { onMount } from "svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Subscription } from "rxjs";
import { me } from "../../../shared/stores/me";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { push } from "svelte-spa-router";
import UserImage from "src/shared/atoms/UserImage.svelte";
import Date from "../../../shared/atoms/Date.svelte";
import DetailActionBar from "../../../shared/molecules/DetailActionBar.svelte";
import { displayableName } from "../../../shared/functions/stringHelper";
import { saveBufferAs } from "../../../shared/saveBufferAs";
import { ApiClient } from "../../../shared/apiConnection";
import QrCode from "svelte-qrcode";
import { sales } from "../../../shared/stores/sales";
import { _ } from "svelte-i18n";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let id: string;

let isLoading: boolean;
let error: Error;
let buyerProfile: Profile;
let sale: Sale;
let shellEventSubscription: Subscription;
let groupedItems;
let actions = [];

async function load() {
  if (isLoading) return;

  sale = await sales.findById(parseInt(id));
  if (!sale) {
    return;
  }
  isLoading = false;

  actions = [
    {
      icon: "chat",
      title: window.i18n("dapps.o-marketplace.pages.mySaleDetail.chat"),
      action: () => push(`#/contacts/chat/${sale.buyerProfile.circlesAddress}`),
    },
  ];

  if (sale.invoices && sale.invoices.length) {
    const pickUpAction = {
      icon: "transactions",
      title: window.i18n("dapps.o-marketplace.pages.mySaleDetail.iHandedOut"),
      action: async () => {
        const action = actions.find((o) => o.title == window.i18n("dapps.o-marketplace.pages.mySaleDetail.iHandedOut"));
        actions = actions.splice(actions.indexOf(action) - 1, 1);
        await sales.completeSale(sale.invoices[0].id);
        actions.push(unPickUpAction);
      },
    };
    const unPickUpAction = {
      icon: "transactions",
      title: window.i18n("dapps.o-marketplace.pages.mySaleDetail.iHaventHandedOut"),
      action: async () => {
        const action = actions.find(
          (o) => o.title == window.i18n("dapps.o-marketplace.pages.mySaleDetail.iHaventHandedOut")
        );
        actions = actions.splice(actions.indexOf(action) - 1, 1);
        await sales.revokeSale(sale.invoices[0].id);
        actions.push(pickUpAction);
      },
    };
    if (!sale.invoices[0].sellerSignature) {
      actions.push(pickUpAction);
    } else if (sale.invoices[0].sellerSignature) {
      actions.push(unPickUpAction);
    }
    actions.push(
      {
        icon: "transactions",
        title: window.i18n("dapps.o-marketplace.pages.mySaleDetail.transaction"),
        action: () =>
          push(
            `#/banking/transactions/${sale.invoices[0].paymentTransactionHash}`
          ),
      },
      {
        icon: "document",
        title: window.i18n("dapps.o-marketplace.pages.mySaleDetail.downloadInvoice"),
        action: async () => {
          for (let invoice of sale.invoices) {
            const invoiceData = await ApiClient.query<string, QueryInvoiceArgs>(
              InvoiceDocument,
              {
                invoiceId: invoice.id,
              }
            );

            saveBufferAs(Buffer.from(invoiceData, "base64"), `invoice.pdf`);
          }
        },
      }
    );
  }
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

function totalPrice(items) {
  let pricePerUnit = 0;
  if (items) {
    items.forEach(
      (e) => (pricePerUnit = pricePerUnit + parseFloat(e.pricePerUnit))
    );
  }
  return pricePerUnit;
}

onMount(async () => {
  await load();

  groupedItems = sale ? orderItems(sale.lines) : {};
  buyerProfile = sale?.buyerProfile;

  shellEventSubscription = window.o.events.subscribe(
    async (event: PlatformEvent) => {
      if (
        event.type != "shell.refresh" ||
        (<any>event).dapp != "marketplace:1"
      ) {
        return;
      }
      await load();
    }
  );

  return () => {
    shellEventSubscription.unsubscribe();
  };
});
</script>

<div class="p-5">
  <header class="grid overflow-hidden bg-white ">
    <div class="w-full text-center">
      <h1 class="text-3xl uppercase font-heading">{$_("dapps.o-marketplace.pages.mySaleDetail.saleDetails")}</h1>
    </div>
    <div class="w-full text-center">
      {#if sale}
        <span class="text-dark-lightest"
          >{$_("dapps.o-marketplace.pages.mySaleDetail.saleDate")}<Date time="{sale.createdAt}" /></span>
      {/if}
    </div>
  </header>
  {#if isLoading}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>{$_("dapps.o-marketplace.pages.mySaleDetail.loadingSales")}</div>
        </div>
      </div>
    </section>
  {:else if groupedItems}
    <!-- <CartItems cartContents="{sale.lines}" editable="{false}" /> -->
    <!-- <pre>{JSON.stringify(sale, null, 2)}</pre> -->

    <div class="mt-6">
      <div class="flex flex-row items-stretch p-2 mb-6 bg-light-lighter">
        <div
          class="flex flex-row items-center content-start self-end space-x-2 text-base font-medium text-left cursor-pointer"
          on:click="{() =>
            push(`#/contacts/profile/${buyerProfile.circlesAddress}`)}">
          <div class="inline-flex">
            <UserImage
              profile="{buyerProfile}"
              size="{5}"
              gradientRing="{false}" />
          </div>

          <div>
            {displayableName(buyerProfile.firstName, buyerProfile.lastName)}
          </div>
        </div>
      </div>
      {#each groupedItems as groupSale, i}
        <div
          class="flex items-center justify-between w-full pb-6 mb-6 border-b">
          <div class="flex items-center w-full">
            <img
              src="{groupSale.item.item.offer.pictureUrl}"
              alt="{groupSale.item.item.offer.title}"
              class="w-20 rounded-full mask mask-circle" />
            <div class="flex flex-col items-start w-full ml-2 space-y-2">
              <div class="flex flex-row justify-between w-full">
                <div class="md:text-md">
                  <a
                    href="#/marketplace/offer/{groupSale.item.item.offer.id}"
                    alt="{groupSale.item.item.offer.title}">
                    {groupSale.item.item.offer.title}
                  </a>
                </div>
              </div>
              <div class="flex items-center justify-end w-full">
                <div class="flex-grow text-sm text-left text-dark-lightest">
                  1 {groupSale.item.item.offer.unitTag
                    ? groupSale.item.item.offer.unitTag.value
                    : "item"}
                </div>

                <div class="flex pr-8">
                  <input
                    type="text"
                    value="{groupSale.item.item.amount}"
                    disabled
                    class="w-8 h-6 px-2 mx-2 text-sm text-center bg-gray-100 border rounded focus:outline-none" />
                </div>
                <div class="items-center">
                  <span class="whitespace-nowrap">
                    {groupSale.item.item.offer.pricePerUnit} €
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
    {#each sale.invoices as invoice}
      <div class="flex flex-col w-full mb-6 space-y-2 text-left ">
        <div class="pb-1 bg-gradient-to-r from-gradient1 to-gradient2">
          <h1 class="p-2 text-center text-white uppercase bg-dark-dark">
            {$_("dapps.o-marketplace.pages.mySaleDetail.pickupCode")}
          </h1>
        </div>

        <div class="w-full text-center">
          {#if !invoice.pickupCode}
            <h1 class="text-3xl uppercase font-heading">
              {$_("dapps.o-marketplace.pages.mySaleDetail.noCode")}
            </h1>
          {:else}
            <h1 class="text-6xl uppercase font-heading">
              {invoice.pickupCode}
            </h1>
            <div class="container">
              <center>
                <QrCode value="{invoice.pickupCode}" color="#081B4A" />
              </center>
            </div>
          {/if}
        </div>
      </div>
    {/each}
    <DetailActionBar actions="{actions}" />
  {/if}
</div>
