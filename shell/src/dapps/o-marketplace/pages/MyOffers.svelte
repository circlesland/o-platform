<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";

import { onMount } from "svelte";
import { push } from "svelte-spa-router";
import { me } from "../../../shared/stores/me";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import {
  Shop,
  Offer,
  ShopCategory,
  ShopDocument,
  ShopQueryVariables,
  UpsertOfferDocument,
  UpsertOfferMutationVariables,
  OfferInput,
  MutationUpsertOfferArgs,
  UpsertShopCategoryEntriesResult,
  UpsertShopCategoriesDocument,
  ShopCategoryInput,
  UpsertShopCategoriesResult,
  UpsertShopCategoriesMutationVariables,
  UpsertShopCategoryEntriesDocument,
  UpsertShopCategoryEntriesMutationVariables,
  MutationUpsertShopCategoryEntriesArgs,
  ShopCategoryEntry,
} from "../../../shared/api/data/types";
import { storeOffers } from "../../../shared/stores/storeOffers";
import { _ } from "svelte-i18n";
import { Environment } from "../../../shared/environment";
import { Readable } from "svelte/store";
import { ok, err, Result } from "neverthrow";
import { ApiClient } from "../../../shared/apiConnection";
import Center from "../../../shared/layouts/Center.svelte";

import { uploadFile } from "../../../shared/api/uploadFile";
import { showToast } from "../../../shared/toast";

import ImageUpload from "../../../shared/molecules/ImageUpload/ImageUpload.svelte";
import { useMachine } from "xstate-svelte";
import { flip } from "svelte/animate";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";
export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let storeId: number;

storeId = 5;

let isLoading: boolean;
let error: Error;
let offers: Offer[] = [];
let shop: Shop | null = null;
let _state: Readable<any>;
let showModal: Boolean = false;
let editImage: Boolean = false;
let editType: string = "";
let currentImage: string = null;
let categories: ShopCategory[] = [];
let categoryInput: ShopCategoryInput[];
let offerInput: OfferInput;
let changeList: { id: number; entry: ShopCategoryEntry }[] = [];
let currentCategoryId: any;
let hovering = false;

onMount(async () => {
  shop = await ApiClient.query<Shop, ShopQueryVariables>(ShopDocument, {
    id: parseInt(storeId.toString()),
  });

  if (!shop) {
    await push("/not-found");
    return;
  }

  categories = shop.categories;
  categoryInput = categories;
  console.log("CATA", categories);
});

async function updateOffer(entry) {
  try {
    delete entry.product.__typename;
    delete entry.product.createdByProfile;
    delete entry.product.version;
    offerInput = entry.product;
    offerInput.createdByProfileId = $me.id;
    offerInput.pictureMimeType = "image/jpeg";
    offerInput.timeCirclesPriceShare = 100;

    const result = await ApiClient.mutate<Offer, UpsertOfferMutationVariables>(UpsertOfferDocument, {
      offer: offerInput,
    });
    showToast("success", "Product was updated");

    changeList.splice(
      changeList.findIndex((v) => v.id === entry.id),
      1
    );
    changeList = changeList;
    return;

    return ok(result);
  } catch (error) {
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
    // return ok(result);
  } catch (error) {
    showToast("error", "Category Entries not updated");
  }
}
const dragstart = (event, i) => {
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.dropEffect = "move";
  const start = i;
  event.dataTransfer.setData("text/plain", start);
};

async function drop(event, target, catIndex) {
  console.log("CACACAC:", categories[catIndex].entries);

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
  console.log("CATENTRIES NOW", categories[catIndex].entries);
}

async function submit() {
  // await updateCategory();
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
  changeList = changeList;
  if (_state) {
    if (editType == "largeBannerUrl") {
      categories[currentCategoryId].largeBannerUrl = $_state.context.data.url;
    }
    if (editType == "smallBannerUrl") {
      categories[currentCategoryId].smallBannerUrl = $_state.context.data.url;
    }
  }
}

function handleClickOutside(event) {
  showModal = false;
}

function changeEntry(entryId: number, entry: ShopCategoryEntry) {
  if (changeList.find(({ id }) => id === entryId)) {
    return;
  } else {
    changeList = [...changeList, { id: entryId, entry: entry }];
  }
  console.log("CHAGNELISGT", changeList);
}

function hasChanges(entryId) {
  if (changeList.find(({ id }) => id === entryId)) {
    return true;
  }
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="w-5/6 px-4 mx-auto -mt-3">
  <div class="items-center w-full p-4 ">
    {#if categories.length > 0}
      {#each categories as category, catindex (category.name)}
        {#if category.entries}
          <div class="w-full p-2 ">
            <h1>{category.name}</h1>
          </div>

          <div class="table mb-10">
            <div class="table-header-group p-4 mb-10">
              <div class="table-row ">
                <div class="table-cell pl-2 ">
                  <Icon name="switch-vertical" class="inline w-6 h-6 heroicon smallicon" />
                </div>
                <div class="table-cell pl-2">Image</div>
                <div class="table-cell pl-2">Title</div>
                <div class="table-cell pl-2">Description</div>

                <div class="table-cell pl-2">Price</div>
                <div class="table-cell pl-2">Category</div>
                <div class="table-cell pl-2 pr-2">Version</div>
              </div>
            </div>

            {#each category.entries as entry, index (entry.id)}
              <div
                class="table-row-group"
                animate:flip
                draggable="{true}"
                on:dragstart="{(event) => dragstart(event, index)}"
                on:drop|preventDefault="{(event) => drop(event, index, catindex)}"
                ondragover="return false"
                on:dragenter="{() => (hovering = index + catindex)}"
                class:is-active="{hovering === index + catindex}">
                <div class="table-cell w-10 p-1 text-gray-400 cursor-move">
                  <Icon name="menu" class="inline w-10 h-10 heroicon" />
                </div>
                <div class="relative table-cell w-12 p-1 overflow-hidden">
                  <div class="absolute w-12 h-12 bottom-2">
                    {#if entry.product.pictureUrl}
                      <img
                        class="w-12 h-12"
                        src="{entry.product.pictureUrl}"
                        alt="large Banner Url"
                        on:click="{() => imageEditor(index, 'pictureUrl', false)}"
                        on:change="{() => changeEntry(entry.id, entry)}" />
                    {:else}
                      <div
                        on:click="{() => imageEditor(index, 'pictureUrl', true)}"
                        class="link link-primary"
                        on:change="{() => changeEntry(entry.id, entry)}">
                        Upload image
                      </div>
                    {/if}
                  </div>
                </div>
                <div class="table-cell p-1 break-all">
                  <input
                    type="text"
                    class="input"
                    placeholder="{entry.product.title}"
                    bind:value="{entry.product.title}"
                    on:input="{() => changeEntry(entry.id, entry)}" />
                </div>

                <div class="table-cell p-1 break-all">
                  <input
                    type="text"
                    size="50"
                    class="input"
                    placeholder="{entry.product.description}"
                    bind:value="{entry.product.description}"
                    on:input="{() => changeEntry(entry.id, entry)}" />
                </div>

                <div class="table-cell w-20 p-1 break-all">
                  <input
                    type="text"
                    class="w-20 input"
                    placeholder="{entry.product.pricePerUnit}"
                    bind:value="{entry.product.pricePerUnit}"
                    on:input="{() => changeEntry(entry.id, entry)}" />
                </div>
                <div class="table-cell p-1 ">
                  <select class="select" bind:value="{category.id}" on:input="{() => changeEntry(entry.id, entry)}">
                    {#each categories as listcategory, index (listcategory.name)}
                      <option value="{listcategory.id}">{listcategory.name}</option>
                    {/each}
                  </select>
                </div>
                <div class="table-cell w-16 p-1 text-center break-all">
                  {entry.product.version}
                </div>
                <div class="table-cell p-1 whitespace-nowrap">
                  {#if changeList.find(({ id }) => id === entry.id)}
                    <button class="btn btn-primary" on:click="{updateOffer(entry)}">Save</button>
                  {/if}
                </div>
              </div>
            {/each}

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
          </div>
        {/if}
      {/each}
    {/if}
  </div>
</div>

<!-- 
<div class="px-4 mx-auto -mt-3 md:w-2/3 xl:w-1/2">
  {#if isLoading}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>{$_("dapps.o-marketplace.pages.myOffers.loadingOffers")}</div>
        </div>
      </div>
    </section>
  {:else if error}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>
            <b>{$_("dapps.o-marketplace.pages.myOffers.error")}</b>
          </div>
        </div>
      </div>
    </section>
  {:else if offers.length}
    <div class="table">
      <div class="table-header-group">
        <div class="table-cell">Title</div>
        <div class="table-cell">Description</div>
        <div class="table-cell">Picture Url</div>
        <div class="table-cell">Picture Mime Type</div>
        <div class="table-cell">Price per Unit</div>
        <div class="table-cell">Category</div>
      </div>
      <div class="table-row-group">
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
      </div>
      {#each offers as offer}
        <div class="table-row-group">
          <div class="table-cell w-64 p-1 break-all">
            <input type="text" class="input" placeholder="{offer.title}" value="{offer.title}" />
          </div>
          <div class="table-cell p-1 break-all">
            <input type="text" class="input" placeholder="{offer.description}" value="{offer.description}" />
          </div>
          <div class="table-cell p-1 ">
            <input type="text" class="input" placeholder="{offer.pictureUrl}" value="{offer.pictureUrl}" />
          </div>
          <div class="table-cell p-1 ">
            <input type="text" class="input" placeholder="{offer.pictureMimeType}" value="{offer.pictureMimeType}" />
          </div>
          <div class="table-cell p-1 ">
            <input type="text" class="input" placeholder="{offer.pricePerUnit}" value="{offer.pricePerUnit}" />
          </div>
          <div class="table-cell p-1 ">
            <select class="select">
              <option>cat 1</option>
              <option>category</option>
              <option>kickeriiki</option>
            </select>
          </div>
          <div class="p1">
            <button class="btn btn-primary">Save</button>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>{$_("dapps.o-marketplace.pages.myOffers.noOffers")}</div>
        </div>
      </div>
    </section>
  {/if}
</div> -->
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
