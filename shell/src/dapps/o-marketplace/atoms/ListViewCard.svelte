<script lang="ts">
import { push } from "svelte-spa-router";
import { Offer, ShopCategoryEntry } from "../../../shared/api/data/types";
import { purchase } from "../processes/purchase";
import Icons from "../../../shared/molecules/Icons.svelte";
import { me } from "../../../shared/stores/me";
import { cartContents } from "../stores/shoppingCartStore";
import { truncateString } from "../../../shared/functions/truncateString";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";

export let entry: ShopCategoryEntry;
export let shopId: number;
export let deliveryMethods: any;

function loadDetailPage() {
  push("#/marketplace/detail/" + shopId + "/" + entry.id);
}

function addToCart(item: Offer & { shopId: number }) {
  $cartContents = $cartContents ? [...$cartContents, item] : [item];
  push(`#/marketplace/cart`);
}

let now = new Date();

let displayName = `${entry.product.createdByProfile.displayName}`;
displayName = displayName.length >= 22 ? displayName.substr(0, 22) + "..." : displayName;
</script>

<section class="flex items-start bg-white shadow-md rounded-xl">
  <div class="flex flex-col w-full ">
    <div class="relative flex flex-col items-stretch w-full px-4 py-4 space-y-4 ">
      <div class="flex flex-row space-x-2">
        {#if entry.product.pictureUrl}
          <div>
            <div class="flex items-center w-full">
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
        <div
          class="flex flex-col self-start justify-end cursor-pointer text-primary"
          on:click="{() => addToCart({ ...entry.product, shopId: shopId })}">
          <Icons icon="cart" />
        </div>
      </div>
      <div class="absolute right-2 bottom-2">
        {#if deliveryMethods}
          {#each deliveryMethods as deliveryMethod, i}
            <div class="inline py-1 pl-2 pr-2 mt-2 ml-2 rounded-md text-2xs top-20 bg-primary-lightest">
              {deliveryMethod.name}
              <!-- <Icon name="home" class="inline w-4 h-4 heroicon smallicon" /> -->
            </div>
          {/each}
        {/if}
      </div>

      <!-- <div class="absolute right-0 py-2 pl-4 pr-1 mt-2 rounded-md text-2xs top-32 bg-alert-lightest">
        Delivery <Icon name="truck" class="inline w-4 h-4 heroicon smallicon" />
      </div> -->
    </div>
  </div>
</section>
