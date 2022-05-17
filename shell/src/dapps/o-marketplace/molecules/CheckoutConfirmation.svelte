<script lang="ts">
import ProcessNavigation from "@o-platform/o-editors/src/ProcessNavigation.svelte";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { Profile, Organisation } from "../../../shared/api/data/types";
import { _ } from "svelte-i18n";
import QrCode from "../../../shared/molecules/QrCode/QrCode.svelte";
import { push } from "svelte-spa-router";

export let context: any;
let profile: Profile | Organisation;
let groupedItems;

$: {
  context = context;

  profile = context.data.sellerProfile;

  groupedItems = context.data ? orderItems(context.data.items) : {};
}

let classes: string;

function submit(redirectTo?: string) {
  const answer = new Continue();

  answer.data = {
    ...context.data,
    redirectTo: redirectTo,
  };
  context.process.sendAnswer(answer);
}

function onkeydown(e: KeyboardEvent) {
  if (e.key == "Enter") {
    submit();
  }
}

function orderItems(items) {
  const orderedCart = {};
  items.forEach((item) => {
    orderedCart[item.id] = {
      item: item,
      qty: orderedCart[item.id] ? orderedCart[item.id].qty + 1 : 1,
    };
  });

  return Object.entries(orderedCart).map(([id, item]) => ({ id, item }));
}
</script>

{#if context.data && profile && groupedItems}
  <div class="mt-2">
    <!-- <div class="flex flex-row items-stretch p-2 mb-6 bg-light-lighter">
      <div
        class="flex flex-row items-center content-start self-end space-x-2 text-base font-medium text-left ">
        <div class="inline-flex">
          <UserImage
            profile="{context.data.sellerProfile}"
            size="{5}"
            gradientRing="{false}" />
        </div>
        <div>
          {context.data.sellerProfile.firstName}
          {context.data.sellerProfile.lastName
            ? context.data.sellerProfile.lastName
            : ""}
        </div>
      </div>
    </div> -->
    {#each groupedItems as groupPurchase, i}
      <div class="flex items-center justify-between w-full pb-6 mb-6 border-b">
        <div class="flex items-center w-full">
          <img
            src="{groupPurchase.item.item.pictureUrl}"
            alt="{groupPurchase.item.item.title}"
            class="w-20 rounded-full mask mask-circle" />
          <div class="flex flex-col items-start w-full ml-2 space-y-2">
            <div class="flex flex-row justify-between w-full">
              <div class="md:text-md">
                <a href="#/marketplace/{groupPurchase.item.item.id}" alt="{groupPurchase.item.item.title}">
                  {groupPurchase.item.item.title}
                </a>
              </div>
            </div>
            <div class="flex items-center justify-end w-full">
              <div class="flex-grow text-sm text-left text-dark-lightest">
                1 {groupPurchase.item.item.unitTag ? groupPurchase.item.item.unitTag.value : "item"}
              </div>

              <div class="flex pr-8">
                <input
                  type="text"
                  value="{groupPurchase.item.qty}"
                  disabled
                  class="w-8 h-6 px-2 mx-2 text-sm text-center bg-gray-100 border rounded focus:outline-none" />
              </div>
              <div class="items-center">
                <span class="whitespace-nowrap">
                  {groupPurchase.item.item.pricePerUnit} €
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}

    <div class="flex flex-col w-full mb-6 space-y-4 text-left ">
      <div class="pb-1 bg-gradient-to-r from-gradient1 to-gradient2">
        <h1 class="p-2 text-white uppercase bg-dark-dark">
          <div class="text-sm">
            {$_("dapps.o-marketplace.molecules.checkoutConfirm.yourPickupCode")}: &nbsp;{context.params
              .simplePickupCode}
          </div>
        </h1>
      </div>

      <div>
        {$_("dapps.o-marketplace.molecules.checkoutConfirm.howToPickup1")}
      </div>

      <div class="w-full mt-6 text-center">
        <div class="container">
          <center>
            <QrCode value="{context.params.pickupCode}" />
          </center>
        </div>
      </div>
      <div class="text-sm">
        {$_("dapps.o-marketplace.molecules.checkoutConfirm.toSeeCode1")}<span class="text-primary-dark"
          >{$_("dapps.o-marketplace.molecules.checkoutConfirm.toSeeCode2")}</span
        >{$_("dapps.o-marketplace.molecules.checkoutConfirm.toSeeCode3")}
        <a
          title="My Purchases"
          href="/#"
          alt="{$_('dapps.o-marketplace.molecules.checkoutConfirm.toSeeCode4')}"
          class="cursor-pointer btn-link"
          on:click="{(e) => {submit('#/marketplace/my-purchases'); e.preventDefault()}}">
          {$_("dapps.o-marketplace.molecules.checkoutConfirm.toSeeCode4")}
        </a>
        {$_("dapps.o-marketplace.molecules.checkoutConfirm.toSeeCode5")}
      </div>

      <div class="pt-2 text-sm font-bold">
        {$_("dapps.o-marketplace.molecules.checkoutConfirm.pickupLocation")}
      </div>
      <!-- <div class="pt-2 text-sm">
        <span class="font-bold">Basic Income Lab GmbH</span><br />
        Reifenstuelstrasse 6<br />
        80469 München<br />
        <span class="text-sm font-thin"
          >Shop hours: Mo - Fr&nbsp;&nbsp;&nbsp;14:00 - 20:00</span>
      </div> -->
    </div>
  </div>
  <ProcessNavigation on:buttonClick="{() => submit(undefined)}" context="{context}" noSticky="{true}" />
{/if}
