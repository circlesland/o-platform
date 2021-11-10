<script lang="ts">
import { push } from "svelte-spa-router";
import { Offer } from "../../../shared/api/data/types";
import { purchase } from "../processes/purchase";
import OfferCardField from "./OfferCardField.svelte";
import UserImage from "src/shared/atoms/UserImage.svelte";
import Icons from "../../../shared/molecules/Icons.svelte";
import { me } from "../../../shared/stores/me";
//import { upsertOffer } from "../processes/upsertOffer";
import { truncateString } from "../../../shared/functions/truncateString";
import Time from "svelte-time";

export let param: Offer = <any>{
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

let offer = param;

export let allowEdit: boolean = false;

let isEditable: boolean = false;
$: {
  isEditable = allowEdit && $me && offer && $me.id == offer.createdByProfileId;
}

function edit(dirtyFlags: { [field: string]: boolean }) {
  // console.log("edit: dirtyFlags:", dirtyFlags);
  // window.o.runProcess(upsertOffer, offer, dirtyFlags, true);
}

function loadDetailPage() {
  push("#/marketplace/offer/" + offer.id);
}

function buy() {
  window.o.runProcess(purchase, {});
}

let now = new Date();
let sevendaysago = now.setDate(now.getDate() - 7);

function dateOlderThanSevenDays(unixTime: number) {
  return sevendaysago > unixTime * 1000;
}

let displayName = `${offer.createdByProfile.firstName} ${
  offer.createdByProfile.lastName ? offer.createdByProfile.lastName : ""
}`;

displayName =
  displayName.length >= 22 ? displayName.substr(0, 22) + "..." : displayName;
</script>

<section class="flex items-start pb-2 bg-white shadow rounded-xl">
  <div class="flex flex-col w-full ">
    <header
      class="cursor-pointer rounded-t-xl headerImageContainer"
      on:click="{() => loadDetailPage()}">
      <div class="relative rounded-t-xl image-wrapper">
        <img
          src="{offer.pictureUrl
            ? offer.pictureUrl
            : '/images/market/circles-no-image.jpg'}"
          alt="
          "
          class="rounded-t-xl" />
        <div
          class="absolute right-0 py-2 pl-4 pr-1 mt-2 text-2xl leading-tight rounded-l-full font-heading top-2 bg-light-lightest">
          {offer.pricePerUnit} ⦿
          <!--{offer.pricePerUnit} C / {offer.unitTag.value}-->
          <!-- <Time relative timestamp={offer.publishedAt} /> -->
        </div>
      </div>
    </header>
    <div
      class="flex flex-row items-center content-start p-4 space-x-4 text-base font-medium text-left bg-light-lighter">
      <div class="inline-flex">
        <UserImage
          profile="{offer.createdByProfile}"
          size="{10}"
          gradientRing="{false}" />
      </div>
      <div>
        {displayName}
      </div>
    </div>
    <div class="flex flex-col w-full px-4 pb-2 mt-2 space-y-4 bg-white">
      <!--<<div class="flex flex-row flex-grow space-x-2">
        div
          class="p-2 font-bold text-white uppercase rounded-full cursor-pointer bg-dark-lightest text-2xs">
         <a
            href="#/marketplace/categories/{offer.categoryTagId}/{offer
              .categoryTag.value}"
            alt="{offer.categoryTag.value}">
            {offer.categoryTag.value}
          </a>
        </div>
      </div>-->
      <div class="h-32">
        <div
          class="text-4xl leading-tight text-left uppercase break-all font-heading">
          {offer.title}
        </div>

        {#if offer.description}
          <div class="text-sm text-dark-lightest">
            {truncateString(offer.description, 70)}
          </div>
        {/if}
      </div>
      <div class="flex flex-row space-x-4">
        <div>
          <button class="btn btn-square btn-light">
            <Icons icon="star" />
          </button>
        </div>
        <div class="flex-grow">
          <button
            type="submit"
            class="relative btn btn-primary btn-block"
            on:click="{() => loadDetailPage()}">
            Show detail
            <div class="absolute mr-1 right-2">
              <Icons icon="eye" />
            </div>
          </button>
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
