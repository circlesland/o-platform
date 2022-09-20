<script lang="ts">
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import { onMount } from "svelte";
import { uploadFile } from "../../../shared/api/uploadFile";
import { showToast } from "../../../shared/toast";
import { push } from "svelte-spa-router";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import ImageUpload from "../../../shared/molecules/ImageUpload/ImageUpload.svelte";
import { useMachine } from "@xstate/svelte";
import { flip } from "svelte/animate";
import Icons from "../../../shared/molecules/Icons.svelte";
import { me } from "../../../shared/stores/me";
import ShopEditorSelector from "../molecules/ShopEditorSelector.svelte";
import {
  Shop,
  ShopCategory,
  ShopDocument,
  ShopQueryVariables,
  UpsertShopCategoriesDocument,
  ShopCategoryInput,
  UpsertShopCategoriesResult,
  UpsertShopCategoriesMutationVariables,
  ShopsQueryVariables,
  ShopsDocument,
} from "../../../shared/api/data/types";

import { ok, err, Result } from "neverthrow";
import { ApiClient } from "../../../shared/apiConnection";
import Center from "../../../shared/layouts/Center.svelte";
import { Environment } from "../../../shared/environment";
import { Readable } from "svelte/store";
import RichTextEditor from "@o-platform/o-editors/RichTextEditor.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let shopId: number;

let shop: Shop | null = null;
let shops: Shop[] | null = null;
let _state: Readable<any>;
let showModal: Boolean = false;
let editImage: Boolean = false;
let editType: string = "";
let currentImage: string = null;
let newCategory: ShopCategory;
let categories: ShopCategory[] = [];
let categoryInput: ShopCategoryInput[];
let currentCategory: ShopCategoryInput;
let currentCategoryId: any;
let editCategoryId: Number;
let categoryOrder: Number;
let selectedShopIndex: any = localStorage.getItem("editShopIndex") || 0;

$: categories = categories;

onMount(async () => {
  if (!$me) {
    return;
  }
  shops = await ApiClient.query<Shop[], ShopsQueryVariables>(ShopsDocument, {
    ownerId: $me.id,
  });

  if (!shops || !shops.length) {
    return;
  }

  loadShop(selectedShopIndex);
});

async function loadShop(selectedShopIndex) {
  shopId = shops[selectedShopIndex].id;

  shop = await ApiClient.query<Shop, ShopQueryVariables>(ShopDocument, {
    id: parseInt(shopId.toString()),
  });

  if (shop.categories == null) {
    newCategory = {
      description: null,
      enabled: true,
      id: null,
      largeBannerUrl: null,
      name: null,
      private: null,
      productListingStyle: null,
      shopId: shopId,
      smallBannerUrl: null,
      sortOrder: categories.length,
    };
    categories = [newCategory];
  } else {
    categories = shop.categories;
  }
}

const drop = (target, thisCategory) => {
  const newTracklist = categories;

  const removedItem = newTracklist[thisCategory];

  newTracklist.splice(thisCategory, 1);
  newTracklist.splice(target + 1, 0, removedItem);

  categories.forEach((element, index) => {
    element.sortOrder = index;
  });

  submit();
  categoryOrder = null;
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

  try {
    await updateCategory();
    showToast("success", "Categories successfully updated");
    editCategoryId = null;
  } catch {
    showToast("error", "Categories not updated");
  }
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
}

function removeImage() {
  if (editType == "largeBannerUrl") {
    categories[currentCategoryId].largeBannerUrl = "";
  }

  showModal = false;
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
    if ($_state.value == "success") {
      if (editType == "largeBannerUrl") {
        categories[currentCategoryId].largeBannerUrl = $_state.context.data.url;
      }
      submit();
      _state = null;
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
    shopId: shopId,
    smallBannerUrl: null,
    sortOrder: categories.length,
  };
  categories = [...categories, newCategory];
}

function removeLast() {
  categories.pop();
  categories = categories;
}

function toggleEditCategory(categoryId, index) {
  if (editCategoryId == categoryId) {
    editCategoryId = null;
  } else {
    editCategoryId = categoryId;
  }
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="mb-20 -mt-3 ">
  {#if shops}
    <ShopEditorSelector
      shops="{shops}"
      bind:shopIndex="{selectedShopIndex}"
      on:indexChange="{(e) => loadShop(e.detail)}" />
  {/if}
  {#if shop}
    <div class="flex flex-col pb-20 space-y-4 ">
      {#if categories.length > 0}
        <div class="flex flex-col space-y-4">
          {#each categories as category, index (category.id)}
            <div class="table-row-group pb-6" animate:flip="{{ duration: 500 }}">
              <div class="pb-2 mx-auto space-y-4 xl:w-1/2 md:w-2/3">
                <div class="relative mx-4 overflow-hidden bg-white rounded-xl image-wrapper">
                  {#if editCategoryId == category.id}
                    <div
                      class="absolute z-10 text-center align-top list-none cursor-pointer top-1 left-2 inline-table "
                      on:click="{() => imageEditor(index, 'largeBannerUrl', false)}">
                      <span>
                        <span
                          class="table-cell w-10 h-10 align-middle bg-black rounded-full text-primary bg-opacity-60">
                          <Icons icon="camera" customClass="inline w-6 h-6 heroicon smallicon" />
                        </span>
                      </span>
                    </div>
                  {/if}
                  {#if category.largeBannerUrl}
                    <img
                      src="{category.largeBannerUrl}"
                      alt="{category.name}"
                      class="w-full rounded-xl opacity-60 object-position: center center;  " />
                  {:else}
                    <div class="w-full h-48 rounded-xl bg-black opacity-60 object-position: center center;  "></div>
                  {/if}
                  <div
                    class="absolute left-0 pt-1 pb-1 pl-2 pr-4 mt-2 text-xl rounded-r-full sm:pb-2 sm:pt-3 sm:text-3xl font-heading bottom-4 bg-light-lightest">
                    {#if editCategoryId == category.id}
                      <input
                        type="text"
                        class="font-primary input"
                        size="30"
                        placeholder="{category.name}"
                        bind:value="{category.name}" />
                      <button class="inline btn btn-square btn-primary" on:click="{() => submit()}">
                        <Icons icon="check" customClass="inline w-6 h-6 heroicon smallicon" />
                      </button>
                    {:else}
                      <span class="inline-block">{category.name}</span>
                    {/if}
                  </div>

                  <div
                    class="absolute text-center align-top list-none cursor-pointer bottom-1 right-2 inline-table"
                    on:click="{() => toggleEditCategory(category.id, index)}">
                    <span>
                      <span
                        class="table-cell w-10 h-10 align-middle rounded-full bg-opacity-60"
                        class:bg-white="{editCategoryId == category.id}"
                        class:text-base="{editCategoryId == category.id}"
                        class:bg-black="{editCategoryId != category.id}"
                        class:text-primary="{editCategoryId != category.id}">
                        <Icons icon="pencil" customClass="inline w-6 h-6 heroicon smallicon" />
                      </span>
                    </span>
                  </div>
                </div>
                <div class="px-4">
                  <h1 class="w-full mt-2 text-left label">Description</h1>
                  {#if editCategoryId == category.id}
                    <div class="w-full">
                      <RichTextEditor
                        bind:editorValue="{category.description}"
                        on:valueChange="{(e) => (category.description = e.detail)}" />
                    </div>
                  {/if}
                  <div class="w-full px-1 text-sm">{@html category.description}</div>

                  <div class="flex flex-row mt-4 space-x-4 ">
                    <div class="p-2 font-primary ">
                      <input
                        type="checkbox"
                        class="inline-block toggle toggle-primary"
                        value="{category.private}"
                        bind:checked="{category.private}" />
                      <div class="inline-block align-top">Private?</div>
                    </div>

                    <div class="p-2 font-primary ">
                      <input
                        type="checkbox"
                        class="inline-block toggle toggle-primary"
                        value="{category.enabled}"
                        bind:checked="{category.enabled}" />
                      <div class="inline-block align-top">Enabled?</div>
                    </div>
                    <div class="p-2 -mt-2">
                      <select
                        class="w-full max-w-xs select"
                        bind:value="{categoryOrder}"
                        on:change="{(event) => drop(categoryOrder, index)}">
                        <option disabled selected>Select where to order this category</option>
                        {#each categories as orderCategory, oi}
                          {#if orderCategory.id != category.id}
                            <option value="{oi}">below {orderCategory.name}</option>
                          {/if}
                        {/each}
                      </select>
                    </div>
                  </div>
                  {#if editCategoryId == category.id}
                    <div class="relative flex items-center py-5">
                      <div class="flex-grow border-t border-gray-400"></div>
                      <span class="flex-shrink mx-4 text-gray-400"
                        ><button class="inline btn btn-primary" on:click="{() => submit()}">Save {category.name}</button
                        ></span>
                      <div class="flex-grow border-t border-gray-400"></div>
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
        <div class="pb-2 mx-auto space-y-4 xl:w-1/2 md:w-2/3">
          <div class="flex justify-end w-full pt-2 space-x-4">
            <button class="btn btn-success" on:click="{() => addCategory()}">Create new Category</button>
          </div>
          {#if showModal}
            <Center blur="{true}" on:clickedOutside="{handleClickOutside}">
              {#if editImage}
                <div class="p4">
                  <center>
                    <button class="self-center m-4 btn btn-primary btn-sm" on:click="{removeImage}">No Image</button>
                  </center>
                </div>
                <ImageUpload on:submit="{handleImageUpload}" aspect="{7 / 2}" maxWidth="{700}" />
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
        </div>
      {/if}
    </div>
  {:else}
    <h2>sorry, you don't have any stores. are you logged in as the right Organization?</h2>
  {/if}
</div>
