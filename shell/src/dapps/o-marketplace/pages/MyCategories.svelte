<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import { onMount } from "svelte";
import { uploadFile } from "../../../shared/api/uploadFile";
import { showToast } from "../../../shared/toast";
import { push } from "svelte-spa-router";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import ImageUpload from "../../../shared/molecules/ImageUpload/ImageUpload.svelte";
import { useMachine } from "xstate-svelte";
import { flip } from "svelte/animate";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";

import {
  Shop,
  ShopCategory,
  ShopDocument,
  ShopQueryVariables,
  UpsertShopCategoriesDocument,
  ShopCategoryInput,
  UpsertShopCategoriesResult,
  UpsertShopCategoriesMutationVariables,
} from "../../../shared/api/data/types";

import { ok, err, Result } from "neverthrow";
import { ApiClient } from "../../../shared/apiConnection";
import Center from "../../../shared/layouts/Center.svelte";
import { Environment } from "../../../shared/environment";
import { Readable } from "svelte/store";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let storeId: number;

storeId = 5;

let shop: Shop | null = null;
let _state: Readable<any>;
let showModal: Boolean = false;
let editImage: Boolean = false;
let editType: string = "";
let currentImage: string = null;
let newCategory: ShopCategory;
let categories: ShopCategory[] = [];
let categoryInput: ShopCategoryInput[];
let currentCategoryId: any;

$: categories = categories;

onMount(async () => {
  shop = await ApiClient.query<Shop, ShopQueryVariables>(ShopDocument, {
    id: parseInt(storeId.toString()),
  });

  if (!shop) {
    await push("/not-found");
    return;
  }

  categories = shop.categories;
});

let hovering = false;

const dragstart = (event, i) => {
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.dropEffect = "move";
  const start = i;
  event.dataTransfer.setData("text/plain", start);
};

const drop = (event, target) => {
  event.dataTransfer.dropEffect = "move";
  const start = parseInt(event.dataTransfer.getData("text/plain"));
  const newTracklist = categories;

  if (start < target) {
    newTracklist.splice(target + 1, 0, newTracklist[start]);
    newTracklist.splice(start, 1);
  } else {
    newTracklist.splice(target, 0, newTracklist[start]);
    newTracklist.splice(start + 1, 1);
  }
  categories = newTracklist;
  hovering = null;

  categories.forEach((element, index) => {
    element.sortOrder = index;
  });
};

$: if (categories.length) {
  console.log("cool");
}

async function submit() {
  categories.forEach((element, index) => {
    delete categories[index].createdAt;
    delete categories[index].entries;
    delete categories[index].__typename;
  });
  categoryInput = categories;

  await updateCategory();
  showToast("success", "Categories successfully updated");
}

function imageEditor(id, type, edit) {
  currentCategoryId = id;
  showModal = true;
  editImage = false;
  if (edit) {
    editImage = true;
  }
  editType = type;
  if (type == "largeBannerUrl") {
    currentImage = categories[currentCategoryId].largeBannerUrl;
  }
  if (type == "smallBannerUrl") {
    currentImage = categories[currentCategoryId].smallBannerUrl;
  }
}

function handleImageUpload(event) {
  const machine = (<any>uploadFile).stateMachine("123");
  const machineOptions = {
    context: {
      data: {
        appId: Environment.filesAppId,
        fileName: `${shop.id}/yomama.jpg`,
        mimeType: "image/jpeg",
        bytes: event.detail.croppedImage,
      },
    },
  };

  const { service, state, send } = useMachine(machine, machineOptions);
  service.start();
  _state = state;
  showModal = false;
}
$: {
  if (_state) {
    if (editType == "largeBannerUrl") {
      categories[currentCategoryId].largeBannerUrl = $_state.context.data.url;
    }
    if (editType == "smallBannerUrl") {
      categories[currentCategoryId].smallBannerUrl = $_state.context.data.url;
    }
  }
}

async function updateCategory() {
  const result = await ApiClient.mutate<UpsertShopCategoriesResult, UpsertShopCategoriesMutationVariables>(
    UpsertShopCategoriesDocument,
    { shopCategories: categoryInput }
  );

  return ok(result);
}

function handleClickOutside(event) {
  showModal = false;
}

function addCategory() {
  newCategory = {
    description: null,
    enabled: true,
    id: null,
    largeBannerUrl: null,
    name: null,
    private: null,
    productListingStyle: null,
    shopId: 5,
    smallBannerUrl: null,
    sortOrder: categories.length,
  };
  categories = [...categories, newCategory];

  console.log(categories);
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="w-2/3 px-4 mx-auto -mt-3">
  <div class="items-center w-full p-4 ">
    {#if categories.length > 0}
      <div class="table">
        {#each categories as category, index (category.id)}
          <div
            class="table-row-group"
            animate:flip
            draggable="{true}"
            on:dragstart="{(event) => dragstart(event, index)}"
            on:drop|preventDefault="{(event) => drop(event, index)}"
            ondragover="return false"
            on:dragenter="{() => (hovering = index)}"
            class:is-active="{hovering === index}">
            <div class="table-cell w-10 p-1 cursor-move">
              <Icon name="menu" class="inline w-10 h-10 heroicon" />
            </div>

            <div class="table-cell w-64 p-1 break-all">
              <input type="text" class="input" placeholder="{category.name}" bind:value="{category.name}" />
            </div>

            <div class="table-cell p-1 break-all">
              <input
                type="text"
                class="input"
                placeholder="{category.description}"
                bind:value="{category.description}" />
            </div>

            <div class="table-cell w-64 h-10 p-1 overflow-hidden ">
              <div class="w-64 h-12 ">
                {#if category.largeBannerUrl}
                  <img
                    src="{category.largeBannerUrl}"
                    alt="large Banner Url"
                    on:click="{() => imageEditor(index, 'largeBannerUrl', false)}" />
                {:else}
                  <div on:click="{() => imageEditor(index, 'largeBannerUrl', true)}" class="link link-primary">
                    Upload image
                  </div>
                {/if}
              </div>
              <!-- <input
              type="text"
              class="input"
              placeholder="{category.largeBannerUrl}"
              value="{category.largeBannerUrl}"
               /> -->
            </div>

            <div class="table-cell w-64 h-10 p-1 overflow-hidden ">
              <div class="w-64 h-12 ">
                {#if category.smallBannerUrl}
                  <img
                    src="{category.smallBannerUrl}"
                    alt="small Banner Url"
                    on:click="{() => imageEditor(index, 'smallBannerUrl', false)}" />
                {:else}
                  <div on:click="{() => imageEditor(index, 'smallBannerUrl', true)}" class="link link-primary">
                    Upload image
                  </div>
                {/if}
              </div>
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
      </div>
      <div class="flex justify-between w-full">
        <button class="btn btn-primary" on:click="{submit}">Save</button>
        <button class="btn btn-success" on:click="{() => addCategory()}">Create new Category</button>
      </div>
      {#if showModal}
        <Center blur="{true}" on:clickedOutside="{handleClickOutside}">
          {#if editImage}
            <ImageUpload on:submit="{handleImageUpload}" />
          {:else}
            <div class="flex flex-col w-full h-full p-4">
              <button
                class="self-center mb-4 btn btn-primary btn-sm"
                on:click="{() => {
                  editImage = true;
                }}">Remove Image</button>
              <div class="text-center">
                <div class="inline-flex">
                  <img class="m-auto " id="cropCanvas" src="{currentImage}" height="300" alt="avatar" />
                </div>
              </div>
            </div>
          {/if}
        </Center>
      {/if}
    {/if}
  </div>
</div>

<style>
/* .list-item {
  display: block;
  padding: 0.5em 1em;
}

.list-item:not(:last-child) {
  border-bottom: 1px solid #dbdbdb;
} */

.table-row-group.is-active {
  @apply bg-primary;
}
</style>
