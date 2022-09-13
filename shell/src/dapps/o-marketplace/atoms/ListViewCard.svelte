<script lang="ts">
import { push } from "svelte-spa-router";
import { Offer, ShopCategoryEntry } from "../../../shared/api/data/types";
import Icons from "../../../shared/molecules/Icons.svelte";
import { truncateString } from "../../../shared/functions/truncateString";
import { addToCart, AddToCartContextData } from "../processes/addToCart";
import { createEventDispatcher } from "svelte";

const dispatch = createEventDispatcher();

export let entry: ShopCategoryEntry;
export let shopId: number;
export let deliveryMethods: any;
export let editable: Boolean = false;
export let id: Number;

function loadDetailPage() {
  if (editable) {
    dispatch("edit", id);
    return;
  } else {
    push("#/marketplace/detail/" + shopId + "/" + entry.id);
  }
}

function _addToCart(item: Offer & { shopId: number }) {
  window.o.runProcess(addToCart, <AddToCartContextData>{
    offerId: parseInt(item.id.toString()),
    shopId: parseInt(item.shopId.toString()),
    redirectTo: `#/marketplace/cart`,
  });
}
</script>

<section class="flex items-start bg-white shadow-md cursor-pointer rounded-xl">
  <div class="flex flex-col w-full ">
    <div class="relative flex flex-col items-stretch w-full px-4 py-4 space-y-4 ">
      <div class="flex flex-row space-x-2">
        {#if entry.product.pictureUrl}
          <div>
            <div class="flex items-center w-20">
              <img class="w-20 h-20 rounded-md" src="{entry.product.pictureUrl}" alt="{entry.product.title}" />
            </div>
          </div>
        {/if}
        <div class="flex-grow" on:click="{() => loadDetailPage()}">
          <div class="text-lg leading-tight text-left uppercase break-word">
            <span class="cursor-pointer">{entry.product.title}</span>
          </div>
          <div>
            <div class="text-sm text-dark-lightest">
              {#if entry.product.description}
                {@html truncateString(entry.product.description, 40)}
                -
              {/if}
              <span class="inline-block text-dark-dark">{entry.product.pricePerUnit}</span>
              <span class="inline-block text-dark-dark">€</span>
            </div>
          </div>
        </div>
        {#if editable}
          <div
            class="text-center align-top list-none cursor-pointer top-1 left-2 inline-table "
            on:click="{() => dispatch('edit', id)}">
            <span>
              <span class="table-cell w-10 h-10 align-middle bg-black rounded-full text-primary bg-opacity-60">
                <Icons icon="pencil" customClass="inline w-6 h-6 heroicon smallicon" />
              </span>
            </span>
          </div>
        {:else}
          <div
            class="flex flex-col self-start justify-end cursor-pointer text-primary"
            on:click="{() => _addToCart({ ...entry.product, shopId: shopId })}">
            <Icons icon="cart" />
          </div>
        {/if}
      </div>
      <div class="absolute right-2 bottom-2">
        {#if deliveryMethods}
          {#each deliveryMethods as deliveryMethod, i}
            <div class="inline py-1 pl-2 pr-2 mt-2 ml-2 rounded-md text-2xs top-20 bg-primary-lightest">
              {deliveryMethod.name}
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>
</section>
