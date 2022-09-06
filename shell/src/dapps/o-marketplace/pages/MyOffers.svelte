<script lang="ts">
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";

import { onMount } from "svelte";
import { me } from "../../../shared/stores/me";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
// import Editor from "@tinymce/tinymce-svelte";
import ListViewCard from "../atoms/ListViewCard.svelte";

import RichTextEditor from "@o-platform/o-editors/RichTextEditor.svelte";

import {
  Shop,
  Offer,
  ShopCategory,
  ShopDocument,
  ShopQueryVariables,
  UpsertOfferDocument,
  UpsertOfferMutationVariables,
  OfferInput,
  UpsertShopCategoryEntriesResult,
  ShopCategoryInput,
  UpsertShopCategoryEntriesDocument,
  UpsertShopCategoryEntriesMutationVariables,
  ShopCategoryEntry,
  ShopsQueryVariables,
  ShopsDocument,
} from "../../../shared/api/data/types";
import { Environment } from "../../../shared/environment";
import { Readable } from "svelte/store";
import { ok } from "neverthrow";
import { ApiClient } from "../../../shared/apiConnection";
import Center from "../../../shared/layouts/Center.svelte";

import { uploadFile } from "../../../shared/api/uploadFile";
import { showToast } from "../../../shared/toast";

import ImageUpload from "../../../shared/molecules/ImageUpload/ImageUpload.svelte";
import { useMachine } from "@xstate/svelte";
import { flip } from "svelte/animate";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";
import ShopEditorSelector from "../molecules/ShopEditorSelector.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let shopId: number;

let isLoading: boolean;
let error: Error;
let offers: Offer[] = [];
let shops: Shop[] | null = null;
let shop: Shop | null = null;
let _state: Readable<any>;
let showModal: Boolean = false;
let editImage: Boolean = false;
let editType: string = "";
let editOfferId: Number = null;
let currentImage: string = null;
let newOffer: OfferInput = null;
let categories: ShopCategory[] = [];
let categoryInput: ShopCategoryInput[];
let offerInput: OfferInput;
let changeList: { id: number; entry: ShopCategoryEntry }[] = [];
let currentCategoryId: any;
let currentEntry: ShopCategoryEntry;
let hovering: number = null;
let selectedShopIndex: any = localStorage.getItem("editShopIndex") || 0;
const options = {
  theme: "snow",
  plainclipboard: true,
};

onMount(async () => {
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

  categories = shop.categories;
  categoryInput = categories;
}

async function updateOffer(entry) {
  try {
    delete entry.product.__typename;
    delete entry.product.createdByProfile;
    delete entry.product.version;
    delete entry.product.createdAt;
    delete entry.product.createdByAddress;
    delete entry.product.tags;

    offerInput = entry.product;

    offerInput.createdByProfileId = $me.id;
    offerInput.pictureMimeType = "image/jpeg";
    offerInput.timeCirclesPriceShare = 100;

    const result = await ApiClient.mutate<Offer, UpsertOfferMutationVariables>(UpsertOfferDocument, {
      offer: offerInput,
    });

    showToast("success", "Product was updated");

    if (entry.id) {
      const entryId = JSON.parse(JSON.stringify(entry.id));
      changeList.splice(
        changeList.findIndex((v) => v.id === entryId),
        1
      );
    }

    entry.product = result;
    entry.productVersion = result.version;

    // This happens for when we add a new product:
    if (newOffer) {
      entry.productId = result.id;

      newOffer = null;
      hovering = null;
    }
    let entryresult = await updateCategoryEntries([entry]);
    categories = categories;
    changeList = changeList;
    editOfferId = null;
    return ok(result);
  } catch (error) {
    console.log("ERROR", error);
    showToast("error", "Categories not updated");
  }
}

async function updateCategoryEntries(entries) {
  try {
    let myEntries = JSON.parse(JSON.stringify(entries)); // Sometimes js is weird.

    myEntries.forEach((element, index) => {
      delete element.product;
      delete element.__typename;
    });
    const result = await ApiClient.mutate<UpsertShopCategoryEntriesResult, UpsertShopCategoryEntriesMutationVariables>(
      UpsertShopCategoryEntriesDocument,
      { shopCategoryEntries: myEntries }
    );
    showToast("success", "Category Entries updated");
    return ok(result);
  } catch (error) {
    console.log("ERROR", error);
    showToast("error", "Category Entries not updated");
  }
}

// Drag & Drop stuff START
const dragstart = (event, i) => {
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.dropEffect = "move";
  const start = i;
  event.dataTransfer.setData("text/plain", start);
};

async function drop(event, target, catIndex) {
  event.dataTransfer.dropEffect = "move";
  const start = parseInt(event.dataTransfer.getData("text/plain"));
  const newTracklist = categories[catIndex].entries;

  if (start < target) {
    newTracklist.splice(target + 1, 0, newTracklist[start]);
    newTracklist.splice(start, 1);
  } else {
    newTracklist.splice(target, 0, newTracklist[start]);
    newTracklist.splice(start + 1, 1);
  }
  categories[catIndex].entries = newTracklist;
  hovering = null;

  categories[catIndex].entries.forEach((element, index) => {
    element.sortOrder = index;
  });
  await updateCategoryEntries(categories[catIndex].entries);
}
// Drag & Drop stuff END

function imageEditor(categoryId, entryId, edit) {
  let sourceCategory: ShopCategory = categories.find((o) => o.id === categoryId);
  let entry: ShopCategoryEntry = sourceCategory.entries.find((o) => o.id === entryId);

  showModal = true;
  editImage = false;
  if (edit) {
    editImage = true;
  }
  currentImage = entry.product.pictureUrl;
  currentEntry = entry;
}

function handleImageUpload(event) {
  const machine = (<any>uploadFile).stateMachine("123");
  const machineOptions = {
    context: {
      data: {
        appId: Environment.filesAppId,
        fileName: `${shop.id}/yomama.jpg`, // errr....
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
  hovering = hovering;
  changeList = changeList;
  if (_state) {
    currentEntry.product.pictureUrl = $_state.context.data.url;
    changeEntry(currentEntry.id, currentEntry);
  }
}

function handleClickOutside(event) {
  showModal = false;
}

// This is to keep track of the changes per offer, so we can show the 'save' button...
function changeEntry(entryId: number, entry: ShopCategoryEntry) {
  if (changeList.find(({ id }) => id === entryId)) {
    return true;
  } else {
    changeList = [...changeList, { id: entryId, entry: entry }];
  }
}

async function changeCategory(e, entryId, entryIndex, categoryIndex, categoryId) {
  // intricate function that removes a entry from one category and moves it into another.
  const target: any = e.target;
  const targetCategoryId: number = target.querySelector("option:checked")?.__value;

  let targetCategory: ShopCategory = categories.find((o) => o.id === targetCategoryId);
  let sourceCategory: ShopCategory = categories.find((o) => o.id === categoryId);
  let entry: ShopCategoryEntry = sourceCategory.entries.find((o) => o.id === entryId);

  entry.shopCategoryId = targetCategoryId;

  targetCategory.entries.push(entry);

  sourceCategory.entries.splice(entryIndex, 1);

  await updateCategoryEntries(targetCategory.entries);

  categories = [...categories];
}

function addProduct(categoryId) {
  newOffer = {
    description: null,
    id: null,
    pictureUrl: "",
    title: null,
    createdByProfileId: $me.id,

    timeCirclesPriceShare: 100,

    pictureMimeType: "image/jpeg",
  };
  let targetCategory: ShopCategory = categories.find((o) => o.id === categoryId);
  let entry: ShopCategoryEntry = {
    private: false,
    enabled: true,
    product: newOffer,
    productId: null,
    productVersion: null,
    sortOrder: null,
    shopCategoryId: categoryId,
  };
  if (targetCategory.entries) {
    targetCategory.entries.unshift(entry);
  } else {
    targetCategory.entries = [entry];
  }

  categories = [...categories];
}

function handleEdit(event) {
  if (editOfferId == event.detail) {
    editOfferId = null;
  } else {
    editOfferId = event.detail;
  }
  console.log("EER", editOfferId);
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="pb-20 mx-auto -mt-3 space-y-4 xl:w-1/2 md:w-2/3">
  {#if shops}
    <div class="flex flex-col justify-center ">
      <ShopEditorSelector
        shops="{shops}"
        bind:shopIndex="{selectedShopIndex}"
        on:indexChange="{(e) => loadShop(e.detail)}" />
    </div>
  {/if}

  <div class="flex flex-col mb-20 space-y-4 ">
    {#if shop}
      {#if categories && categories.length > 0}
        {#each categories as category, catindex (category.name)}
          <div class="w-full p-2 whitespace-nowrap rounded-t-md">
            <h1 class="inline pr-4 h1">{category.name}</h1>
            <button class="inline btn btn-primary btn-square btn-sm" on:click="{() => addProduct(category.id)}"
              >+</button>
          </div>

          {#if category.entries}
            {#each category.entries as entry, index (entry.id)}
              <div class="relative">
                {#if editOfferId == entry.id}
                  <div
                    class="absolute z-10 text-center align-top list-none cursor-pointer top-1 left-2 inline-table "
                    on:click="{() => imageEditor(category.id, entry.id, false)}">
                    <span>
                      <span class="table-cell w-10 h-10 align-middle bg-black rounded-full text-primary bg-opacity-60">
                        <Icon name="camera" class="inline w-6 h-6 heroicon smallicon" />
                      </span>
                    </span>
                  </div>
                {/if}
                <ListViewCard
                  entry="{entry}"
                  shopId="{shopId}"
                  editable="{true}"
                  id="{entry.id}"
                  on:edit="{handleEdit}" />
              </div>
              {#if editOfferId == entry.id}
                <div class="flex flex-col space-y-4 ">
                  <div class="">
                    <h1 class="w-full mt-2 text-left label">Title</h1>
                    <input
                      type="text"
                      class="w-full input"
                      placeholder="{entry.product.title}"
                      bind:value="{entry.product.title}"
                      on:input="{() => changeEntry(entry.id, entry)}" />
                  </div>

                  <div class="break-all ">
                    <h1 class="w-full mt-2 text-left label">Description</h1>
                    <RichTextEditor
                      bind:editorValue="{entry.product.description}"
                      on:valueChange="{(e) => (entry.product.description = e.detail)}" />
                  </div>

                  <div class="grid grid-cols-1 gap-4 auto-rows-auto xs:grid-cols-3">
                    <div class="break-all xs:justify-self-start">
                      <h4 class="w-full mt-2 text-left label">Price per Unit</h4>
                      <input
                        type="text"
                        class="w-20 input"
                        placeholder="{entry.product.pricePerUnit}"
                        bind:value="{entry.product.pricePerUnit}"
                        on:input="{() => changeEntry(entry.id, entry)}" />
                    </div>
                    <div class="xs:justify-self-center">
                      <h4 class="w-full mt-2 text-left label">Change Category</h4>
                      <select
                        class="select"
                        value="{category.id}"
                        on:change="{(event) => changeCategory(event, entry.id, index, catindex, category.id)}">
                        {#each categories as listcategory}
                          <option value="{listcategory.id}">{listcategory.name}</option>
                        {/each}
                      </select>
                    </div>
                    <div class="xs:justify-self-end">
                      <h4 class="w-full mt-2 text-left label">Display</h4>
                      <input
                        type="checkbox"
                        class="inline-block toggle toggle-primary"
                        value="{entry.enabled}"
                        bind:checked="{entry.enabled}"
                        on:change="{() => updateCategoryEntries(category.entries)}" />
                      <div class="inline-block align-top">Enabled?</div>
                    </div>

                    <div class="xs:justify-self-start">
                      <h4 class="w-full mt-2 text-left label">Minimum Age Restriction</h4>
                      <input
                        type="number"
                        class="w-20 input"
                        placeholder="{entry.product.minAge}"
                        bind:value="{entry.product.minAge}" />
                    </div>
                    <div class="xs:justify-self-center">
                      <h4 class="w-full mt-2 text-left label">Inventory</h4>
                      <input
                        type="number"
                        class="w-20 input"
                        placeholder="{entry.product.currentInventory}"
                        bind:value="{entry.product.currentInventory}" />
                    </div>
                    <div class="xs:justify-self-center">
                      <h4 class="w-full mt-2 text-left label">Product Version</h4>
                      {entry.productVersion}
                    </div>
                  </div>

                  <div class="relative flex items-center py-5">
                    <div class="flex-grow border-t border-gray-400"></div>
                    <span class="flex-shrink mx-4 text-gray-400"
                      ><button class="btn btn-primary" on:click="{updateOffer(entry)}">Save Offer</button></span>
                    <div class="flex-grow border-t border-gray-400"></div>
                  </div>
                </div>
              {/if}
            {/each}
          {/if}
        {/each}
        {#if showModal}
          <Center blur="{true}" on:clickedOutside="{handleClickOutside}">
            {#if editImage}
              <ImageUpload on:submit="{handleImageUpload}" cropShape="square" aspect="{1 / 1}" maxWidth="{800}" />
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
      {:else}
        <div class="text-center">
          You don't have any Categories set up yet. <a
            href="/#/marketplace/my-categories"
            class="link"
            alt="set up categories">Create a Category</a>
        </div>
      {/if}
    {:else}
      <h2>sorry, you don't have any stores. are you logged in as the right Organization?</h2>
    {/if}
  </div>
</div>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.quilljs.com/1.3.6/quill.snow.css" />
</svelte:head>
