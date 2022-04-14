<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";

import { onMount } from "svelte";

import { me } from "../../../shared/stores/me";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { Offer, Organisation, Profile } from "../../../shared/api/data/types";
import { storeOffers } from "../../../shared/stores/storeOffers";
import { _ } from "svelte-i18n";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let isLoading: boolean;
let error: Error;
let offers: Offer[] = [];
let store: any;

onMount(() => {
  store = storeOffers.getOffersFor($me.circlesAddress);
  isLoading = true;

  return store.subscribe((data: any) => {
    offers = data;
    isLoading = false;
  });
});
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

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
</div>
