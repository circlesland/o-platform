<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import ListViewCard from "../atoms/ListViewCard.svelte";
import { onMount } from "svelte";
import { Subscription } from "rxjs";

import { push } from "svelte-spa-router";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import {
  Shop,
  ShopCategory,
  ShopDocument,
  ShopQueryVariables,
  UpsertShopCategoriesDocument,
  ShopCategoryInput,
  ShopInput,
} from "../../../shared/api/data/types";

import Date from "../../../shared/atoms/Date.svelte";
import { ok, err, Result } from "neverthrow";
import { ApiClient } from "../../../shared/apiConnection";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let storeId: number;

storeId = 5;

let shop: Shop | null = null;

let categories: ShopCategory[] = [];
let category: ShopCategory;
let categoryInput: ShopCategoryInput[];
let shellEventSubscription: Subscription;

onMount(async () => {
  shop = await ApiClient.query<Shop, ShopQueryVariables>(ShopDocument, {
    id: parseInt(storeId.toString()),
  });

  if (!shop) {
    await push("/not-found");
    return;
  }

  categories = shop.categories;
  console.log("categories", categories);

  categories[0].description = "Go West!";
  delete categories[0].createdAt;
  delete categories[0].entries;
  delete categories[0].__typename;
  categoryInput = [categories[0]];

  // updateCategory();
});

async function updateCategory() {
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const result = await apiClient.mutate({
    mutation: UpsertShopCategoriesDocument,
    variables: { shopCategories: categoryInput },
  });

  if (result.errors) {
    return err("You can't trust yourself, or do you? ;)");
  }
  console.log("OK");
  return ok(result);
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto -mt-3 md:w-2/3 xl:w-1/2">
  {#if categories.length > 0}
    <div class="table">
      <div class="table-header-group">
        <div class="table-cell">Sort order</div>
        <div class="table-cell">Id</div>
        <div class="table-cell">Created At</div>
        <div class="table-cell">Title</div>
        <div class="table-cell">Description</div>
        <div class="table-cell">Large Banner</div>
        <div class="table-cell">Small Banner</div>
        <div class="table-cell">Listing Style</div>
        <div class="table-cell">Private</div>
        <div class="table-cell">Enabled</div>
      </div>
      <!-- <div class="table-row-group">
        <div class="table-cell w-64 p-1 break-all">
          <input type="text" class="input" placeholder="Title" value="" />
        </div>
        <div class="table-cell p-1 break-all">
          <input type="text" class="input" placeholder="Description" value="" />
        </div>
        <div class="table-cell p-1 ">
          <input type="text" class="input" placeholder="upload picture" value="" />
        </div>
        <div class="table-cell p-1 ">
          <input type="text" class="input" placeholder="mime" value="" />
        </div>
        <div class="table-cell p-1 ">
          <input type="text" class="input" placeholder="Price per Unit" value="" />
        </div>
        <div class="table-cell p-1 ">
          <select class="select">
            <option>cat 1</option>
            <option>category</option>
            <option>kickeriiki</option>
          </select>
        </div>

        <div class="p1">
          <button class="btn btn-success">Create</button>
        </div>
      </div> -->
      {#each categories as category, i}
        <div class="table-row-group">
          <div class="table-cell w-10 p-1">{category.sortOrder}</div>

          <div class="table-cell w-10 p-1">
            {category.id}
          </div>

          <div class="table-cell w-64 p-1">
            <Date time="{category.createdAt}" />
          </div>

          <div class="table-cell w-64 p-1 break-all">
            <input type="text" class="input" placeholder="{category.name}" value="{category.name}" />
          </div>

          <div class="table-cell p-1 break-all">
            <input type="text" class="input" placeholder="{category.description}" value="{category.description}" />
          </div>

          <div class="table-cell p-1 ">
            <input
              type="text"
              class="input"
              placeholder="{category.largeBannerUrl}"
              value="{category.largeBannerUrl}" />
          </div>

          <div class="table-cell p-1 ">
            <input
              type="text"
              class="input"
              placeholder="{category.smallBannerUrl}"
              value="{category.smallBannerUrl}" />
          </div>
          <div class="table-cell p-1 ">
            <select class="select" bind:value="{category.productListingStyle}">
              <option value="LIST">List</option>
              <option value="TILES">Tiles</option>
            </select>
          </div>
          <div class="table-cell p-1 ">
            <input
              type="checkbox"
              class="inline-block toggle toggle-primary"
              value="{category.private}"
              bind:checked="{category.private}" />
          </div>
          <div class="table-cell p-1 ">
            <input
              type="checkbox"
              class="inline-block toggle toggle-primary"
              value="{category.enabled}"
              bind:checked="{category.enabled}" />
          </div>
        </div>
      {/each}
      <div class="p1">
        <button class="btn btn-primary">Save</button>
      </div>
    </div>
  {/if}
</div>
