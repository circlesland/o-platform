<script lang="ts">
  import MarketplaceHeader from "../atoms/MarketplaceHeader.svelte";
  import { Offer, OffersDocument } from "../data/api/types";
  import OfferCard from "../atoms/OfferCard.svelte";
  import { onMount } from "svelte";
  import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
  import { Subscription } from "rxjs";
  import CreatorCard from "../atoms/CreatorCard.svelte";
  import Time from "svelte-time";
  import Icons from "../../../shared/molecules/Icons.svelte";

  let isLoading: boolean;
  let error: Error;
  let offers: Offer[] = [];
  let shellEventSubscription: Subscription;

  export let params: {
    id: number;
  };

  async function load() {
    if (isLoading || !params || !params.id) return;

    isLoading = true;
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const result = await apiClient.query({
      query: OffersDocument,
      variables: {
        id: parseInt(params.id.toString()),
      },
    });
    if (result.errors && result.errors.length) {
      error = new Error(
        `An error occurred while the offer was loaded: ${JSON.stringify(
          result.errors
        )}`
      );
      throw error;
    }
    isLoading = false;
    offers = result.data.offers;

    console.log("OFFER: ", offers);
  }

  onMount(async () => {
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

<MarketplaceHeader />
<div class="mx-4 -mt-6">
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
  {:else if offers.length}
    {#each offers as offer}
      <section class="flex items-center justify-center">
        <div class="flex flex-col w-full p-2 space-y-12">
          <header
            class="relative grid w-full overflow-hidden bg-cover rounded-lg h-96 place-content-center"
            style="background: url('{offer.pictureUrl}') no-repeat center center; background-size: cover;"
          >
            <div
              class="absolute top-0 right-0 px-4 py-1 text-xs rounded-tr-lg rounded-bl-lg shadow bg-light-lighter text-light-dark"
            >
              Offer created: <Time relative timestamp={offer.publishedAt} />
              <!-- {#if offer.publishedAt}
          {#if dateOlderThanSevenDays(offer.publishedAt)}
            <Time
              timestamp={new Date(offer.publishedAt * 1000)}
              format="D. MMMM YYYY"
            />
          {:else}
            <Time
              relative
              timestamp={new Date(offer.publishedAt * 1000)}
              live={true}
            />
          {/if}
        {/if} -->
            </div>
          </header>
          <div class="text-base text-3xl text-left text-secondary">
            {offer.title}
          </div>
          <div class="flex flex-row items-center content-start space-x-1">
            <div class="text-base text-2xl text-left">Price</div>
            <div class="pl-2 text-2xl text-left text-secondary">
              {offer.pricePerUnit}
            </div>
            <div class="text-secondary">
              <Icons icon="circlessimple" />
              <!-- <img src="/logos/crc.svg" class="inline w-6 h-6 -mt-1" alt="circles" /> -->
            </div>
            <div class="ml-2 text-base text-2xs">
              ({offer.maxUnits}
              {offer.unitTag.value})
            </div>
          </div>
          <div class="flex flex-row">
            <div class="flex-grow">
              <div class="text-base text-2xl">Offer Details</div>
              <div class="mt-4 text-base">{offer.description}</div>
            </div>
            <div>
              <button class="self-end btn btn-md btn-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  class="inline w-6 h-6 mr-2"
                  ><path
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    d="M80.24 61.203H30.392l-6.623-38.61h65.882z"
                  /><path
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    d="M30.392 61.203L18.889 73.752"
                  /><path
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    d="M18.889 73.752H90"
                  /><path
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    d="M23.769 22.593l-5.839-9.027"
                  /><path
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    d="M17.93 13.566H10"
                  /><circle
                    cx="30.981"
                    cy="80.093"
                    r="6.341"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                  /><circle
                    cx="76.995"
                    cy="80.093"
                    r="6.341"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                  /><metadata xmlns:d="https://loading.io/stock/">
                    <d:name>shopping cart</d:name>
                    <d:tags
                      >shopping
                      cart,checkout,purchase,payment,buy,subscribe,spend,sale,trolley,handbarrow</d:tags
                    >
                    <d:license>by</d:license>
                    <d:slug>4tk536</d:slug>
                  </metadata></svg
                >
                Add to cart
              </button>
            </div>
          </div>
          <div>
            <div class="text-base text-2xl">Shipping</div>
            <div class="mt-4 text-base">{offer.deliveryTermsTag.value}</div>
          </div>
          <div
            class="relative bottom-0 right-0 flex flex-row w-full mt-6 space-x-2"
          >
            <div class="flex flex-row flex-grow space-x-2">
              <div
                class="p-2 rounded-full cursor-pointer bg-light-lighter text-2xs"
              >
                <a
                  href="#/marketplace/categories/{offer.categoryTagId}/{offer
                    .categoryTag.value}"
                  alt={offer.categoryTag.value}
                >
                  {offer.categoryTag.value}
                </a>
              </div>
              <!-- <div class="p-2 rounded-full bg-light-lighter text-2xs">
          {offer.city.name}
        </div>
        <div class="p-2 rounded-full bg-light-lighter text-2xs">
          {offer.city.country}
        </div> -->
            </div>

            <div
              class="absolute bottom-0 right-0 flex flex-row items-center content-start self-end p-2 space-x-2 text-xs rounded-lg bg-light-lighter"
            >
              <div>
                {offer.createdBy.firstName}
                {offer.createdBy.lastName}
              </div>
              <div class="avatar">
                <div class="w-8 h-8 m-auto rounded-full sm:w-12 sm:h-12">
                  <img
                    src={offer.createdBy.avatarUrl
                      ? offer.createdBy.avatarUrl
                      : "/images/market/city.png"}
                    alt="user-icon"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="relative flex-grow text-left">
      <div class="max-w-full cursor-pointer">
        <h2 class="text-2xl sm:text-3xl">
          {offer.title}
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
        {#if offer.description}
          <span class="inline text-dark"
            >{offer.description}
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
        {#if offer.deliveryTermsTag}
          <span class="inline text-sm"
            >{offer.deliveryTermsTag.value}
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
        {offer}
        field={{
          key: "categoryTagId",
          title: "Category",
          displayName: (offer) => offer.categoryTag.value,
        }}
      />
      <OfferCardField
        {allowEdit}
        {offer}
        field={{
          key: "geonameid",
          title: "City",
          displayName: (offer) => offer.city.name,
        }}
      />
      <OfferCardField
        {allowEdit}
        {offer}
        field={{
          key: "geonameid",
          title: "Country",
          displayName: (offer) => offer.city.country,
        }}
      />
      <OfferCardField
        {allowEdit}
        {offer}
        field={{
          key: "unitTagId",
          title: "Unit",
          displayName: (offer) => offer.unitTag.value,
        }}
      />
      <OfferCardField
        {allowEdit}
        {offer}
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
        {offer.publishedAt} (9 days ago)
      </div>
    </div> -->
        </div>
      </section>
      <!-- 
      <CreatorCard profile={offer.createdBy} />
      <OfferCard {offer} allowEdit={true} /> -->
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
