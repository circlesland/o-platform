<script lang="ts">
import { Offer } from "../../../shared/api/data/types";
import { onMount } from "svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Subscription } from "rxjs";
import Icons from "../../../shared/molecules/Icons.svelte";
import { cartContents } from "../stores/shoppingCartStore";
import { push } from "svelte-spa-router";
import UserImage from "../../../shared/atoms/UserImage.svelte";
import { offers } from "../../../shared/stores/offers";

let isLoading: boolean;
let error: Error;
let offer: Offer[] = [];
let shellEventSubscription: Subscription;

export let id: number;

async function load() {
  if (!id) {
    offer = [];
    return;
  }

  const o = await offers.findById(parseInt(id.toString()));
  offer = o ? [o] : [];
  isLoading = false;
}

function addToCart(item) {
  $cartContents = $cartContents ? [...$cartContents, item] : [item];
  push(`#/marketplace/cart`);
}

onMount(async () => {
  isLoading = true;
  await load();

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

<div class="pb-4">
  {#if isLoading}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>Loading offers...</div>
        </div>
      </div>
    </section>
  {:else if error}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>
            <b>An error occurred while loading the recent activities:</b>
          </div>
        </div>
      </div>
    </section>
  {:else if offer.length}
    {#each offer as o}
      <section class="flex items-start rounded-xl">
        <div class="flex flex-col w-full ">
          <header class=" rounded-t-xl headerImageContainer">
            <div class="relative rounded-t-xl image-wrapper">
              <img
                src="{o.pictureUrl
                  ? o.pictureUrl
                  : '/images/market/circles-no-image.jpg'}"
                alt="
                "
                class="w-full rounded-t-xl" />
              <div
                class="absolute right-0 py-2 pt-3 pl-4 pr-2 mt-2 text-lg rounded-l-full font-enso top-2 bg-light-lightest">
                <span class="inline-block">{o.pricePerUnit}</span>
                <span class="inline-block">€</span>
              </div>
            </div>
          </header>
          <div
            class="flex flex-row items-center content-start p-4 space-x-4 text-base font-medium text-left bg-light-lighter">
            <div class="inline-flex">
              <UserImage
                profile="{o.createdByProfile}"
                size="{10}"
                gradientRing="{false}" />
            </div>
            <div>
              {o.createdByProfile.firstName}
              {o.createdByProfile.lastName ? o.createdByProfile.lastName : ""}
            </div>
          </div>

          <div class="flex flex-col w-full px-6 mt-2 space-y-4 bg-white">
            <!--
            <div class="flex flex-row flex-grow space-x-2">
              <div
                class="p-2 font-bold text-white uppercase rounded-full cursor-pointer bg-dark-lightest text-2xs">
            
                <a
                  href="#/marketplace/categories/{o.categoryTagId}/{o
                    .categoryTag.value}"
                  alt="{o.categoryTag.value}">
                  {o.categoryTag.value}
                </a>
              </div>
            </div>
            -->
            <div class="text-4xl text-left uppercase font-heading">
              {o.title}
            </div>

            {#if o.description}
              <div class="text-sm text-dark-lightest">{o.description}</div>
            {/if}
            <!-- {#if o.deliveryTermsTag} -->
            <div class="flex flex-col space-y-1 text-right">
              <div class="pt-2 text-sm">
                <span class="text-xs">Store Pick Up at:</span><br />
                Basic Income Lab GmbH<br />
                Reifenstuelstrasse 6<br />
                80469 München<br />
                <span class="text-sm font-thin"
                  >Shop hours: Mo - Fr&nbsp;&nbsp;&nbsp;14:00 - 20:00</span>
              </div>
            </div>
            <!-- {/if} -->
            {#if o.city}
              <div class="flex flex-col space-y-1">
                <div class="text-2xs">Location</div>
                <div class="text-sm text-dark-lightest">{o.city.name}</div>
              </div>
            {/if}
          </div>

          <!-- <div class="relative flex-grow text-left">
      <div class="max-w-full cursor-pointer">
        <h2 class="text-2xl sm:text-3xl">
          {o.title}
          {#if isEditable}
            <button
              class="link link-primary text-primary text-2xs"
              on:click={() => edit({ title: true })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-3 h-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                />
              </svg>
            </button>
          {/if}
        </h2>
        {#if o.description}
          <span class="inline text-dark"
            >{o.description}
            {#if isEditable}
              <button
                class="link link-primary text-primary text-2xs"
                on:click={() => edit({ description: true })}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-3 h-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                  />
                </svg>
              </button>
            {/if}
          </span>
          <br />
        {/if}
        {#if o.deliveryTermsTag}
          <span class="inline text-sm"
            >{o.deliveryTermsTag.value}
            {#if isEditable}
              <button
                class="link link-primary text-primary text-2xs"
                on:click={() => edit({ deliveryTermsTag: true })}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-3 h-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                  />
                </svg>
              </button>
            {/if}
          </span>
        {/if}
        <br />
      </div>

      <OfferCardField
        {allowEdit}
        {o}
        field={{
          key: "categoryTagId",
          title: "Category",
          displayName: (o) => o.categoryTag.value,
        }}
      />
      <OfferCardField
        {allowEdit}
        {o}
        field={{
          key: "geonameid",
          title: "City",
          displayName: (o) => o.city.name,
        }}
      />
      <OfferCardField
        {allowEdit}
        {o}
        field={{
          key: "geonameid",
          title: "Country",
          displayName: (o) => o.city.country,
        }}
      />
      <OfferCardField
        {allowEdit}
        {o}
        field={{
          key: "unitTagId",
          title: "Unit",
          displayName: (o) => o.unitTag.value,
        }}
      />
      <OfferCardField
        {allowEdit}
        {o}
        field={{
          key: "pricePerUnit",
          title: "Price per unit",
        }}
      />
    </div> -->

          <!-- <div class="flex flex-col self-start flex-1 justify-items-end">
      <div class="flex flex-col self-end space-y-2 text-2xl sm:text-3xl ">
        <button
          on:click={() => buy()}
          class="self-end btn btn-square btn-md btn-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-10 h-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </button>
      </div>
      <div class="self-end mt-2 text-xs text-light-dark">
        {o.publishedAt} (9 days ago)
      </div>
    </div> -->
        </div>
      </section>

      <!-- 
      <CreatorCard profile={o.createdBy} />
      <OfferCard {o} allowEdit={true} /> -->
      <div
        class="sticky bottom-0 left-0 right-0 w-full px-4 mt-4 bg-white rounded-xl">
        <div class="flex flex-row space-x-4">
          <div>
            <button class="btn btn-square btn-light">
              <Icons icon="star" />
            </button>
          </div>
          <div>
            <button
              class="btn btn-square btn-light"
              on:click="{() =>
                push(`#/contacts/chat/${o.createdByProfile.circlesAddress}`)}">
              <Icons icon="chat" />
            </button>
          </div>
          <div class="flex-grow">
            <button
              type="submit"
              class="relative btn btn-primary btn-block"
              on:click="{() => addToCart(o)}">
              Add to Cart
              <div class="absolute mr-1 right-2">
                <Icons icon="cart" />
              </div>
            </button>
          </div>
        </div>
      </div>
    {/each}
  {:else}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>Not found</div>
        </div>
      </div>
    </section>
  {/if}
</div>

<style>
/* Ensure image is always 16:9 Ratio */
.headerImageContainer {
  max-width: none;
}

.image-wrapper {
  position: relative;
  /* padding-bottom: 56.2%;b 16:9 */
  padding-bottom: 75%; /* 4:3 */
}

.image-wrapper img {
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
