<script lang="ts">
  import {
    AggregatesDocument,
    AggregateType, InvoiceDocument, Profile, ProfileAggregate, QueryAggregatesArgs, QueryInvoiceArgs,
    Sale, Sales,
  } from "../../../shared/api/data/types";
  import {onMount} from "svelte";
  import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
  import {Subscription} from "rxjs";
  import {me} from "../../../shared/stores/me";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import {push} from "svelte-spa-router";
  import UserImage from "src/shared/atoms/UserImage.svelte";
  import Date from "../../../shared/atoms/Date.svelte";
  import DetailActionBar from "../../../shared/molecules/DetailActionBar.svelte";
  import {displayableName} from "../../../shared/functions/stringHelper";
  import {saveBufferAs} from "../../../shared/saveBufferAs";
  import {ApiClient} from "../../../shared/apiConnection";

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

    const aggregates = await ApiClient.query<ProfileAggregate[], QueryAggregatesArgs>(AggregatesDocument, {
      types: [AggregateType.Sales],
      safeAddress: $me.circlesAddress,
      filter: {
        sales: {
          salesIds: [parseInt(id)],
        },
      },
    });
    const foundAggregate = aggregates.find(o => o.type == AggregateType.Sales)?.payload as Sales;
    if (!foundAggregate) {
      throw new Error(`Couldn't find the Sales in the query result.`);
    }

    sale = foundAggregate.sales[0];
    isLoading = false;

    actions = [
      {
        icon: "chat",
        title: "Chat",
        action: () => push(`#/friends/chat/${sale.buyerProfile.circlesAddress}`),
      },
    ];

    if (sale.invoices && sale.invoices.length) {
      actions.push(
        {
          icon: "transactions",
          title: "Transaction",
          action: () =>
            push(
              `#/banking/transactions/${sale.invoices[0].paymentTransactionHash}`
            ),
        },
        {
          icon: "document",
          title: "Download Invoice",
          action: async () => {
            for (let invoice of sale.invoices) {
              const invoiceData = await ApiClient.query<string, QueryInvoiceArgs>(InvoiceDocument, {
                invoiceId: invoice.id
              });

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

    return Object.entries(orderedCart).map(([id, item]) => ({id, item}));
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
            <h1 class="text-3xl uppercase font-heading">Sale Details</h1>
        </div>
        <div class="w-full text-center">
            {#if sale}
        <span class="text-dark-lightest"
        >Sale Date: <Date time="{sale.createdAt}"/></span>
            {/if}
        </div>
    </header>
    {#if isLoading}
        <section class="flex items-center justify-center mb-2 ">
            <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
                <div class="flex flex-col items-start">
                    <div>Loading sales...</div>
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
                        on:click="{() => push(`#/friends/${buyerProfile.circlesAddress}`)}">
                    <div class="inline-flex">
                        <UserImage
                                profile="{buyerProfile}"
                                size="{5}"
                                gradientRing="{false}"/>
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
                                class="w-20 rounded-full mask mask-circle"/>
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
                                            class="w-8 h-6 px-2 mx-2 text-sm text-center bg-gray-100 border rounded focus:outline-none"/>
                                </div>
                                <div class="items-center">
                  <span class="whitespace-nowrap">
                    {groupSale.item.item.offer.pricePerUnit} ⦿
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
                        Pick-Up Code
                    </h1>
                </div>

                <div class="w-full text-center">
                    {#if !invoice.pickupCode}
                        <h1 class="text-3xl uppercase font-heading">
                            No pickup code yet ..
                        </h1>
                    {:else}
                        <h1 class="text-6xl uppercase font-heading">
                            {invoice.pickupCode}
                        </h1>
                    {/if}
                </div>
            </div>
        {/each}
        <DetailActionBar actions="{actions}"/>
    {/if}
</div>
