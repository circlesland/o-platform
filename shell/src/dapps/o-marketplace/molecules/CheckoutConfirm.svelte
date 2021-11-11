<script lang="ts">
import UserImage from "src/shared/atoms/UserImage.svelte";

import CirclesTransferGraph from "../../../shared/pathfinder/CirclesTransferGraph.svelte";
import ProcessNavigation from "@o-platform/o-editors/src/ProcessNavigation.svelte";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { Profile, Organisation } from "../../../shared/api/data/types";
import Account from "../../o-passport/pages/Account.svelte";

export let context: any;
let profile: Profile | Organisation;
let groupedItems;

$: {
  context = context;

  profile = context.data.sellerProfile;
  console.log("CONTEXT BABY ", context);
  console.log("PROFILE BABY ", profile);

  groupedItems = context.data ? orderItems(context.data.lines) : {};
}

let classes: string;

function submit() {
  const answer = new Continue();
  answer.data = context.data;
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
  <div class="mt-6">
    <div class="flex flex-row items-stretch p-2 mb-6 bg-light-lighter">
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
        </div>
      </div>
    </div>
    {#each groupedItems as groupPurchase, i}
      <div class="flex items-center justify-between w-full pb-6 mb-6 border-b">
        <div class="flex items-center w-full">
          <img
            src="{groupPurchase.item.pictureUrl}"
            alt="{groupPurchase.item.title}"
            class="w-20 rounded-full mask mask-circle" />
          <div class="flex flex-col items-start w-full ml-2 space-y-2">
            <div class="flex flex-row justify-between w-full">
              <div class="md:text-md">
                <a
                  href="#/marketplace//{groupPurchase.item.id}"
                  alt="{groupPurchase.item.title}">
                  {groupPurchase.item.title}
                </a>
              </div>
            </div>
            <div class="flex items-center justify-end w-full">
              <div class="flex-grow text-sm text-left text-dark-lightest">
                1 {groupPurchase.item.unitTag
                  ? groupPurchase.item.unitTag.value
                  : "item"}
              </div>

              <div class="flex pr-8">
                <input
                  type="text"
                  value="{groupPurchase.item.amount}"
                  disabled
                  class="w-8 h-6 px-2 mx-2 text-sm text-center bg-gray-100 border rounded focus:outline-none" />
              </div>
              <div class="items-center">
                <span class="whitespace-nowrap">
                  {groupPurchase.item.pricePerUnit} ⦿
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}

    <div class="flex flex-col w-full mb-6 space-y-2 text-left ">
      <div class="p-2 text-white bg-primary-dark">
        <h1 class="text-2xl text-center uppercase x font-heading">
          Important Information
        </h1>
        <div class="text-sm text-center">Your Pick-Up Code</div>
      </div>
      <div>
        After your transaction has been completely verified (which will a in
        couple minutes from now) you will get a <span class="text-dark"
          >PickUp Code</span
        >, which you will need to
        <span class="text-dark">show to the seller</span> when you pick up your Order
        at the Store.
      </div>
      <div class="pt-2 text-sm">
        To see your <span class="text-dark">PickUp Code</span> at any time after
        the purchase, go to
        <a
          href="#/marketplace/my-purchases"
          alt="My Purchases"
          class="text-dark">My purchases</a> and click on the Purchase.
      </div>

      <div class="pt-2 text-sm">Pick-Up Location for this Order is:</div>
      <div class="pt-2 text-sm">
        <span class="font-bold">Homo Circulus, Basic Income Lab GmbH</span
        ><br />
        Reifenstühlstrasse 6<br />
        80469 München<br />
        <span class="text-sm font-thin"
          >Shop hours: Mo - Fr&nbsp;&nbsp;&nbsp;14:00 - 20:00</span>
      </div>
    </div>
  </div>
  <ProcessNavigation
    on:buttonClick="{submit}"
    context="{context}"
    noSticky="{true}" />
{/if}
