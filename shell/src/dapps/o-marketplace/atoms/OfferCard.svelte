<script lang="ts">
  import { push } from "svelte-spa-router";
  import { Offer } from "../data/api/types";
  import { purchase } from "../processes/purchase";
  import OfferCardField from "./OfferCardField.svelte";
  import Icons from "../../../shared/molecules/Icons.svelte";
  import { me } from "../../../shared/stores/me";
  import { upsertOffer } from "../processes/upsertOffer";
  import Time from "svelte-time";

  export let offer: Offer = <any>{
    categoryTag: {
      value: "",
      id: 0,
    },
    categoryTagId: 0,
    deliveryTermsTag: {
      value: "",
      id: 0,
    },
    description: "",
    unitTag: {
      value: "",
      id: 0,
    },
    pricePerUnit: "",
    id: 0,
    title: "",
    geonameid: 0,
    createdBy: {},
  };

  export let allowEdit: boolean = false;

  let isEditable: boolean = false;
  $: {
    isEditable =
      allowEdit && $me && offer && $me.id == offer.createdByProfileId;
  }

  function edit(dirtyFlags: { [field: string]: boolean }) {
    console.log("edit: dirtyFlags:", dirtyFlags);
    window.o.runProcess(
      {
        id: upsertOffer.id,
        name: upsertOffer.name,
        stateMachine: (processId?: string) =>
          (<any>upsertOffer).stateMachine(processId, true),
      },
      offer,
      dirtyFlags
    );
  }

  function loadDetailPage() {
    push("#/marketplace/offer/" + offer.id);
  }

  function loadCategoryPage(categoryId: number) {
    push("#/marketplace/offers/" + categoryId);
  }

  function buy() {
    window.o.runProcess(purchase, {});
  }

  let now = new Date();
  let sevendaysago = now.setDate(now.getDate() - 7);

  function dateOlderThanSevenDays(unixTime: number) {
    return sevendaysago > unixTime * 1000;
  }
  console.log("OFFER: ", offer);
</script>

<section
  class="flex items-center justify-center mb-12 "
  on:click|once={() => loadDetailPage()}
>
  <div
    class="flex flex-col w-full bg-white border rounded-lg border-light-lighter"
  >
    <header
      class="relative grid w-full h-40 overflow-hidden bg-cover rounded-t-lg place-content-center"
      style="background: url('{offer.pictureUrl}') no-repeat center center; background-size: cover;"
    >
      <div
        class="absolute top-0 right-0 px-4 py-1 text-xs rounded-tr-lg rounded-bl-lg shadow bg-light-lighter text-light-dark"
      >
        <Time relative timestamp={offer.publishedAt} />
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
    <div class="p-2 text-base text-left text-secondary">
      {offer.title}
    </div>
    <div class="flex flex-row items-center content-start p-2 space-x-1">
      <div class="text-2xl font-bold text-left text-secondary">
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
    <div class="relative flex flex-row p-2 mt-6 space-x-2">
      <div class="flex flex-row flex-grow space-x-2">
        <div class="p-2 rounded-full cursor-pointer bg-light-lighter text-2xs">
          <a
            href="#/marketplace/offers/{offer.categoryTagId}"
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
        class="absolute bottom-0 right-0 flex flex-row items-center content-start self-end p-2 space-x-2 text-xs rounded-tl-lg bg-light-lighter"
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
