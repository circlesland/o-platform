<script lang="ts">
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";

import { onMount } from "svelte";
import { me } from "../../../shared/stores/me";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import {
  Shop,
  ShopInput,
  UpsertShopDocument,
  UpsertShopMutationVariables,
  ShopsDocument,
  ShopListingStyle,
  ProductListingType,
  Organisation,
  OrganisationsByAddressQueryVariables,
  OrganisationsByAddressDocument,
  Profile,
  ShopsQueryVariables,
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

import Icon from "@krowten/svelte-heroicons/Icon.svelte";

import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let isLoading: boolean;
let error: Error;
let _state: Readable<any>;
let showModal: Boolean = false;
let editImage: Boolean = false;
let editType: string = "";
let editShopId: Number;
let shops: Shop[] | null = [];
let currentShopIndex: any;
let currentShop: ShopInput;
let currentImage: string = null;
let editName: Boolean = false;

onMount(async () => {
  shops = await ApiClient.query<Shop[], ShopsQueryVariables>(ShopsDocument, {
    ownerId: $me.id,
  });
});

async function updateShop(newShop: Boolean = false) {
  try {
    const result = await ApiClient.mutate<Shop, UpsertShopMutationVariables>(UpsertShopDocument, { shop: currentShop });
    showToast("success", "Shop successfully updated");
    // editShopId = null;
    if (newShop) {
      shops = [...shops, <Shop>currentShop];
    }
    return ok(result);
  } catch {
    showToast("error", "Shop not updated");
  }
}

function toggleEditShop(shopId, index) {
  if (editShopId == shopId) {
    editShopId = null;
  } else {
    delete shops[index].purchaseMetaDataKeys;
    delete shops[index].owner;
    delete shops[index].categories;
    delete shops[index].createdAt;
    delete shops[index].pickupAddress;
    delete shops[index].__typename;
    currentShop = <ShopInput>shops[index];
    editShopId = shopId;
  }
}
async function submit() {
  console.log("SUBMIT");
  updateShop();
}

function imageEditor(index, type, edit) {
  currentShopIndex = index;
  showModal = true;
  editImage = false;
  if (edit) {
    editImage = true;
  }
  editType = type;
  if (type == "largeBannerUrl") {
    currentImage = shops[index].largeBannerUrl;
  }
  if (type == "smallBannerUrl") {
    currentImage = shops[index].smallBannerUrl;
  }
}

function removeImage() {
  if (editType == "largeBannerUrl") {
    shops[currentShopIndex].largeBannerUrl = "";
  }
  if (editType == "smallBannerUrl") {
    shops[currentShopIndex].smallBannerUrl = "";
  }
  showModal = false;
  updateShop();
}
function handleImageUpload(event) {
  const machine = (<any>uploadFile).stateMachine("123");
  const machineOptions = {
    context: {
      data: {
        appId: Environment.filesAppId,
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
        shops[currentShopIndex].largeBannerUrl = $_state.context.data.url;
      } else if (editType == "smallBannerUrl") {
        shops[currentShopIndex].smallBannerUrl = $_state.context.data.url;
      }
      updateShop();
      _state = null;
    }
  }
}

function editShopName(shopId) {
  editName = true;
}

function handleClickOutside(event) {
  showModal = false;
}

async function createNewShop() {
  currentShop = {
    enabled: true,
    private: false,
    name: "",
    description: "",
    largeBannerUrl: "",
    smallBannerUrl: "",
    shopListingStyle: ShopListingStyle.Regular,
    productListingStyle: ProductListingType.List,
    ownerId: $me.id,
  };

  await updateShop(true);

  const updatedProfile = await ApiClient.query<(Profile | Organisation)[], OrganisationsByAddressQueryVariables>(
    OrganisationsByAddressDocument,
    {
      addresses: [$me.circlesAddress],
    }
  );
  const profile = updatedProfile[0];

  window.o.publishEvent(<PlatformEvent>{
    type: "shell.authenticated",
    profile: profile,
  });
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="mb-20 -mt-3 ">
  <!-- <div class="flex flex-wrap items-stretch space-x-4 space-y-8"> -->
  {#if shops}
    {#each shops as shop, index (shop.id)}
      <section
        class="flex items-start px-4 mx-auto mb-20 md:w-2/3 xl:w-1/2 rounded-xl"
        class:active="{editShopId == shop.id}">
        <div class="flex flex-col w-full space-y-2">
          <header class=" rounded-xl headerImageContainer">
            <div class="relative rounded-xl image-wrapper">
              {#if editShopId == shop.id}
                <div
                  class="absolute z-10 text-center align-top list-none cursor-pointer top-1 left-2 inline-table "
                  on:click="{() => imageEditor(index, 'largeBannerUrl', false)}">
                  <span>
                    <span class="table-cell w-10 h-10 align-middle bg-black rounded-full text-primary bg-opacity-60">
                      <Icon name="camera" class="inline w-6 h-6 heroicon smallicon" />
                    </span>
                  </span>
                </div>
              {/if}
              {#if shop.largeBannerUrl}
                <img src="{shop.largeBannerUrl}" alt="" class="w-full rounded-xl" />
              {:else}
                <div class="w-full bg-black h-60 rounded-xl bg-opacity-60 "></div>
              {/if}
              <div
                class="absolute right-0 py-2 pt-3 pl-4 pr-2 mt-2 text-3xl rounded-l-full font-heading top-2 bg-light-lightest">
                <span class="inline-block">{shop.name}</span>
              </div>
            </div>
          </header>
          <header class="rounded-xl">
            <div class="relative overflow-hidden bg-white rounded-xl image-wrapper">
              {#if editShopId == shop.id}
                <div
                  class="absolute z-10 text-center align-top list-none cursor-pointer top-1 left-2 inline-table "
                  on:click="{() => imageEditor(index, 'smallBannerUrl', false)}">
                  <span>
                    <span class="table-cell w-10 h-10 align-middle bg-black rounded-full text-primary bg-opacity-60">
                      <Icon name="camera" class="inline w-6 h-6 heroicon smallicon" />
                    </span>
                  </span>
                </div>
                <div class="absolute z-10 text-white left-2 bottom-10">
                  <input
                    type="checkbox"
                    class="inline-block toggle toggle-primary"
                    value="{shop.enabled}"
                    bind:checked="{shop.enabled}" />
                  <div class="inline-block align-top">Enabled?</div>
                </div>
                <div class="absolute z-10 text-white left-2 bottom-2">
                  <input
                    type="checkbox"
                    class="inline-block toggle toggle-primary"
                    value="{shop.private}"
                    bind:checked="{shop.private}" />
                  <div class="inline-block align-top">Private?</div>
                </div>
              {/if}
              {#if shop.smallBannerUrl}
                <img
                  src="{shop.smallBannerUrl}"
                  alt="{shop.name}"
                  class="w-full rounded-xl object-position: center center;  "
                  class:opacity-60="{editShopId != shop.id}" />
              {:else}
                <div class="w-full h-40 bg-black rounded-xl opacity-60 "></div>
              {/if}
              <div
                class="absolute right-0 pt-1 pb-1 pl-4 pr-2 mt-2 text-xl rounded-l-full sm:pb-2 sm:pt-3 sm:text-3xl font-heading top-2 bg-light-lightest">
                {#if editShopId == shop.id}
                  <input
                    type="text"
                    class="font-primary input"
                    size="30"
                    placeholder="{shop.name}"
                    bind:value="{shop.name}" />
                  <button class="inline btn btn-square btn-primary" on:click="{() => submit()}">
                    <Icon name="check" class="inline w-6 h-6 heroicon smallicon" />
                  </button>
                {:else}
                  <span class="inline-block">{shop.name}</span>
                {/if}
              </div>

              <div
                class="absolute text-center align-top list-none cursor-pointer bottom-1 right-2 inline-table"
                on:click="{() => toggleEditShop(shop.id, index)}">
                <span>
                  <span
                    class="table-cell w-10 h-10 align-middle rounded-full bg-opacity-60"
                    class:bg-white="{editShopId == shop.id}"
                    class:text-base="{editShopId == shop.id}"
                    class:bg-black="{editShopId != shop.id}"
                    class:text-primary="{editShopId != shop.id}">
                    <Icon name="pencil" class="inline w-6 h-6 heroicon smallicon" />
                  </span>
                </span>
              </div>
            </div>
            {#if editShopId == shop.id}
              <div class="flex flex-row w-full mt-2 space-x-2">
                <input
                  type="text"
                  class="flex-grow font-primary input"
                  placeholder="{shop.description}"
                  bind:value="{shop.description}" />
                <button class="inline btn btn-square btn-primary" on:click="{() => submit()}">
                  <Icon name="check" class="inline w-6 h-6 heroicon smallicon" />
                </button>
              </div>
            {:else}
              <div class="w-full mt-2 text-sm text-center">{shop.description}</div>
            {/if}
          </header>
        </div>
      </section>
    {/each}
    {#if showModal}
      <Center blur="{true}" on:clickedOutside="{handleClickOutside}">
        {#if editImage}
          <div class="p4">
            <center>
              <button class="self-center m-4 btn btn-primary btn-sm" on:click="{removeImage}">No Image</button>
            </center>
          </div>
          <ImageUpload
            on:submit="{handleImageUpload}"
            aspect="{editType == 'smallBannerUrl' ? 750 / 216 : 262 / 175}" />
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
  <section class="flex items-start px-4 mx-auto mb-20 md:w-2/3 xl:w-1/2 rounded-xl">
    <div class="flex flex-col w-full space-y-2">
      <button class=" btn btn-large btn-primary" on:click="{() => createNewShop()}"> Create new Shop </button>
    </div>
  </section>
</div>

<style>
.table-row-group.is-active {
  @apply bg-primary;
}
</style>